// ── UID REGISTRY — safe data passing without JSON in onclick ──
const _reg = [];
function _r(val){ const i = _reg.length; _reg.push(val); return i; }
function _g(i){ return _reg[i]; }

// ── EARLY VARIABLE DECLARATIONS ───────────────────────
// These must be at the top so they're initialized before any function runs
var POSTS_PER_PAGE = 15;
var _postsPage = 1;
var _loadingMore = false;
var _blockedUsers = [];
try{ _blockedUsers = JSON.parse(localStorage.getItem('kez_blocked')||'[]'); }catch(e){ _blockedUsers=[]; }
function isBlocked(uid){ return _blockedUsers.includes(uid); }

// ── FIREBASE INIT ─────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCxDRIL9XOeA7d-yqXF84tndWPZY8JxLSY",
  authDomain: "kezz-media.firebaseapp.com",
  projectId: "kezz-media",
  storageBucket: "kezz-media.firebasestorage.app",
  messagingSenderId: "307892917050",
  appId: "1:307892917050:web:5b318f4039affaa26b3603"
};
firebase.initializeApp(firebaseConfig);
const db      = firebase.firestore();
const storage = firebase.storage();
const auth    = firebase.auth();

// Enable Firestore offline persistence so posts survive page refreshes
db.enablePersistence({synchronizeTabs:true}).catch(()=>{});

// ── FIREBASE HELPERS ──────────────────────────────────
const postsCol   = () => db.collection('posts');
const profileDoc = (uid) => db.collection('profiles').doc(uid);

// Upload image: try Cloudinary first, fall back to Firebase Storage, fall back to base64
async function uploadToStorage(base64, path) {
  // Try Cloudinary
  try {
    const blob = await fetch(base64).then(r => r.blob());
    const form = new FormData();
    form.append('file', blob);
    form.append('upload_preset', 'kezz_media');
    const res  = await fetch('https://api.cloudinary.com/v1_1/dyspuqa0s/image/upload', {method:'POST', body:form});
    const data = await res.json();
    if(data.secure_url) return data.secure_url;
  } catch(e) {}
  // Try Firebase Storage
  try {
    const ref  = storage.ref(path);
    const snap = await ref.putString(base64, 'data_url');
    return await snap.ref.getDownloadURL();
  } catch(e) {}
  // Final fallback: return base64 directly (works offline)
  return base64;
}

// Upload raw File object (used for video — too large for base64)
async function uploadFileToStorage(file, path){
  try {
    // Try Cloudinary video upload
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'kezz_media');
    const res = await fetch('https://api.cloudinary.com/v1_1/dyspuqa0s/video/upload', {method:'POST', body:form});
    const data = await res.json();
    if(data.secure_url) return data.secure_url;
  } catch(e) {}
  // Firebase Storage fallback
  try {
    const ref = storage.ref(path);
    const snap = await ref.put(file);
    return await snap.ref.getDownloadURL();
  } catch(e) {}
  return '';
}

// ── DUMMY SEED POSTS (fixed IDs so they never duplicate) ──
const DUMMY_POST_IDS = ['dummy_1','dummy_2','dummy_3'];

async function seedDummyPosts() {
  try {
    const doc = await postsCol().doc('dummy_1').get();
    if(!doc.exists) {
      const batch = db.batch();
      SAMPLE_POSTS.forEach((p, i) => {
        const ts = firebase.firestore.Timestamp.fromMillis(Date.now() - (i+1)*3600000);
        batch.set(postsCol().doc(DUMMY_POST_IDS[i]), {
          ...p,
          id: DUMMY_POST_IDS[i],
          uid: 'system',
          createdAt: ts
        });
      });
      await batch.commit();
    }
  } catch(e) {
    console.warn('Could not seed dummy posts:', e.message);
  }
}

function startPostsListener() {
  showSkeletons('feed', 4);
  postsCol().orderBy('createdAt','desc').onSnapshot(function(snap){
    posts = snap.docs.map(function(d){
      var data = d.data();
      var likedBy = Array.isArray(data.likedBy) ? data.likedBy : [];
      data.liked = likedBy.includes(me.uid);
      data.likedBy = likedBy;
      if(!data.comments) data.comments = [];
      return data;
    }).filter(function(p){ return !p.hidden || isAdmin(); });
    _postsPage = 1; // reset pagination on fresh load
    renderFeed();
    renderExploreFeed();
    if(currentView==='profile')  refreshProfile();
    if(currentView==='settings') refreshAdmin();
    if(!window._orphanCheckDone && Object.keys(allUsers).length){
      window._orphanCheckDone = true;
      setTimeout(checkOrphanCommentHandles, 1500);
    }
  }, function(err){
    console.warn('Firestore listener error:', err.code, err.message);
    if(err.code === 'permission-denied'){
      toast('⚠️ Firebase rules blocking access — check your Firestore rules');
    } else {
      toast('⚠️ Could not reach database: ' + err.message);
    }
  });
}

async function savePostToFirestore(p) {
  await postsCol().doc(String(p.id)).set({
    ...p,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}
async function updatePostField(id, updates) {
  try { await postsCol().doc(String(id)).update(updates); } catch(e) {}
}
async function deletePostFromFirestore(id) {
  await postsCol().doc(String(id)).delete();
}
async function loadProfile(uid) {
  if(!uid) return;
  try {
    // Race profile load against a 5s timeout so init() never hangs on bad network
    const profilePromise = profileDoc(uid).get();
    const timeoutPromise = new Promise(function(res){ setTimeout(res, 5000); });
    const doc = await Promise.race([profilePromise, timeoutPromise]);
    if(doc && doc.exists) Object.assign(me, doc.data());
  } catch(e) { /* offline, use defaults */ }
}
async function saveProfileToFirestore() {
  if(!me.uid) return;
  if(isAdmin()) me.isAdmin = true;
  // Use merge:true so we NEVER overwrite fields we didn't intend to change
  // Build a clean save object — never include uid-registry internals
  var saveData = {
    uid: me.uid,
    email: me.email || '',
    name: me.name || '',
    handle: me.handle || '',
    bio: me.bio || '',
    color: me.color || 'linear-gradient(135deg,#e2688a,#f0a0b8)',
    initial: me.initial || 'K',
    bannerColor: me.bannerColor || 'linear-gradient(135deg,#f4a8c0,#e2688a,#c93f6e)',
    isAdmin: !!me.isAdmin
  };
  if(me.avatar)       saveData.avatar       = me.avatar;
  if(me.bannerImage)  saveData.bannerImage  = me.bannerImage;
  if(me.website)      saveData.website      = me.website;
  if(me.following)    saveData.following    = me.following;
  if(me.followersCount!==undefined) saveData.followersCount = me.followersCount;
  if(me.profileTheme!==undefined)   saveData.profileTheme   = me.profileTheme;
  if(me.profileLayout)              saveData.profileLayout  = me.profileLayout;
  if(me.blocked)      saveData.blocked      = me.blocked;
  try { await profileDoc(me.uid).set(saveData, {merge:true}); } catch(e) {}
}

// ── STATE ────────────────────────────────────────────
const USERS = [
  {name:'Alex Rivera', handle:'alex_r',  color:'linear-gradient(135deg,#a78bfa,#7c3aed)', initial:'A', followers:2100},
  {name:'Mia Chen',    handle:'mia.chen',color:'linear-gradient(135deg,#f9a8d4,#e879a3)', initial:'M', followers:8400},
  {name:'Kai Tanaka',  handle:'kai_t',   color:'linear-gradient(135deg,#6ee7f7,#2dd4bf)', initial:'K', followers:1300},
  {name:'Sofia Reyes', handle:'sofi_r',  color:'linear-gradient(135deg,#86efac,#22c55e)', initial:'S', followers:5700},
  {name:"Liam O'Brien",handle:'liam.ob', color:'linear-gradient(135deg,#fde68a,#f59e0b)', initial:'L', followers:980},
];

let me = {};

const SAMPLE_POSTS = [
  {id:'dummy_1', uid:'system', user:USERS[1], images:['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'], image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', caption:'Sunday mornings are made for slow coffee and slower scrolling ✨', likes:142, liked:false, comments:[{user:USERS[0],text:"Honestly same ☕"},{user:USERS[3],text:"Can I join? 🙋‍♀️"}], saved:false, time:'2h ago', showComments:true},
  {id:'dummy_2', uid:'system', user:USERS[3], images:['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80','https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'], image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', caption:'Golden hour never misses 🌅 #sunset #photography', likes:389, liked:false, comments:[{user:USERS[2],text:"This is stunning!"}], saved:false, time:'5h ago', showComments:false},
  {id:'dummy_3', uid:'system', user:USERS[0], images:['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'], image:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80', caption:'New project just dropped — been working on this for months!', likes:54, liked:false, comments:[], saved:false, time:'11h ago', showComments:false},
];

let posts = []; // filled by Firestore onSnapshot listener
let uploadImages = []; // array of base64 strings
let toastTimer, currentConvo = null;

const CONVOS = [
  {id:1, user:USERS[1], unread:true,  messages:[{from:'them',text:"Hey! Loved your latest post 😍", time:'2:14 PM'},{from:'me',text:"Thank you so much!! 💖",time:'2:16 PM'},{from:'them',text:"When are you posting next?",time:'2:17 PM'}]},
  {id:2, user:USERS[0], unread:true,  messages:[{from:'them',text:"Can we collab sometime?",time:'Yesterday'},{from:'me',text:"Yes for sure! Let's plan it",time:'Yesterday'}]},
  {id:3, user:USERS[2], unread:false, messages:[{from:'them',text:"Your feed is so aesthetic 🌸",time:'Monday'},{from:'me',text:"Aww that means so much!",time:'Monday'}]},
  {id:4, user:USERS[3], unread:false, messages:[{from:'them',text:"Following you now!",time:'Last week'}]},
  {id:5, user:USERS[4], unread:false, messages:[{from:'them',text:"Love the vibes here ✨",time:'Last week'}]},
];

// ── NOTIFICATIONS (Firestore-backed) ─────────────────
let notifUnsubscribe = null;
async function sendNotification(toUid, type, fromUser, extra){
  // type: 'like'|'comment'|'follow'|'message'|'mention'
  if(!toUid || toUid===me.uid || toUid==='system') return;
  try{
    await db.collection('notifications').add({
      toUid, type,
      fromUid: me.uid,
      fromName: me.name||me.handle,
      fromHandle: me.handle,
      fromColor: me.color,
      fromInitial: me.initial,
      fromAvatar: me.avatar||null,
      extra: extra||'',
      read: false,
      ts: firebase.firestore.FieldValue.serverTimestamp()
    });
  }catch(e){}
}
function watchNotifications(){
  if(!me.uid) return;
  if(notifUnsubscribe){ notifUnsubscribe(); notifUnsubscribe=null; }

  // Track IDs we've already seen so we only popup truly new ones
  var _seenNotifIds = new Set();
  var _firstNotifLoad = true;

  notifUnsubscribe = db.collection('notifications')
    .where('toUid','==',me.uid)
    .onSnapshot(function(snap){
      // Sort newest first client-side
      const sorted = snap.docs.slice().sort(function(a,b){
        const da=a.data(), db_=b.data();
        const ta=da.ts?(da.ts.toMillis?da.ts.toMillis():da.ts.seconds?da.ts.seconds*1000:0):0;
        const tb=db_.ts?(db_.ts.toMillis?db_.ts.toMillis():db_.ts.seconds?db_.ts.seconds*1000:0):0;
        return tb-ta;
      });

      // Find truly NEW notifications (not in our seen set, unread, not from self)
      const brandNew = snap.docChanges().filter(function(change){
        if(change.type !== 'added') return false;
        const n = change.doc.data();
        // On first load, seed seen IDs but don't popup (these are old notifs)
        if(_firstNotifLoad){ _seenNotifIds.add(change.doc.id); return false; }
        if(_seenNotifIds.has(change.doc.id)) return false;
        if(n.read) return false;
        if(n.fromUid === me.uid) return false;
        _seenNotifIds.add(change.doc.id);
        return true;
      });

      _firstNotifLoad = false;

      // Show popup for each new notification
      brandNew.forEach(function(change){
        showNotifPopup(change.doc.id, change.doc.data());
      });

      // Update all badges
      const count = sorted.filter(function(d){return !d.data().read;}).length;
      ['notifBadge','mnNotifBadge','mobNotifBadge','mobTopNotifBadge','mobSheetNotifBadge'].forEach(function(id){
        const el=document.getElementById(id);
        if(!el) return;
        el.textContent=count;
        if(id==='notifBadge') el.classList.toggle('hidden',!count);
        else el.style.display=count?'':'none';
      });
      // Refresh notifs view if open
      const nv=document.getElementById('view-notifs');
      if(nv && nv.classList.contains('active')) renderNotifs(sorted);
    }, function(err){ console.warn('notif listener:', err.message); });
}

// Show a sliding popup card for an incoming notification
function showNotifPopup(nid, n){
  const icons  = {like:'❤️', comment:'💬', follow:'👤', message:'✉️', mention:'@'};
  const texts  = {like:'liked your post', comment:'commented on your post',
                  follow:'started following you', message:'sent you a message', mention:'mentioned you'};
  const container = document.getElementById('notifPopup');
  if(!container) return;

  const item = document.createElement('div');
  item.className = 'notif-popup-item';
  item.innerHTML =
    '<div class="notif-popup-av" style="background:'+(n.fromColor||'var(--pink)')+';">'
      +(n.fromAvatar
        ? '<img src="'+n.fromAvatar+'" alt="">'
        : esc(n.fromInitial||'?'))
    +'</div>'
    +'<div class="notif-popup-icon">'+(icons[n.type]||'🔔')+'</div>'
    +'<div class="notif-popup-body">'
      +'<strong>'+esc(n.fromName||n.fromHandle||'Someone')+'</strong> '
      +'<span>'+(texts[n.type]||n.type)+'</span>'
      +(n.extra ? '<em>'+esc(n.extra.slice(0,50))+'</em>' : '')
    +'</div>'
    +'<button class="notif-popup-close" title="Dismiss">×</button>';

  // Click popup body → go to notifications
  item.addEventListener('click', function(e){
    if(e.target.classList.contains('notif-popup-close')) return;
    goTo('notifs');
    db.collection('notifications').doc(nid).update({read:true}).catch(()=>{});
    dismissPopup(item);
  });

  // Click × → just dismiss
  item.querySelector('.notif-popup-close').addEventListener('click', function(e){
    e.stopPropagation();
    dismissPopup(item);
  });

  container.appendChild(item);
  // Trigger slide-in on next frame
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ item.classList.add('show'); });
  });

  // Auto-dismiss after 5 seconds
  var autoTimer = setTimeout(function(){ dismissPopup(item); }, 5000);
  item._autoTimer = autoTimer;
}

function dismissPopup(item){
  clearTimeout(item._autoTimer);
  item.classList.remove('show');
  item.classList.add('hide');
  setTimeout(function(){ if(item.parentNode) item.parentNode.removeChild(item); }, 400);
}
function renderNotifs(docs){
  const list=document.getElementById('notifList');
  if(!list) return;
  list.innerHTML='';
  // If called without docs, fetch them
  if(!docs){
    db.collection('notifications').where('toUid','==',me.uid).limit(50).get().then(function(snap){
      const sorted=snap.docs.slice().sort(function(a,b){
        const ta=a.data().ts?(a.data().ts.toMillis?a.data().ts.toMillis():0):0;
        const tb=b.data().ts?(b.data().ts.toMillis?b.data().ts.toMillis():0):0;
        return tb-ta;
      });
      renderNotifs(sorted);
    });
    return;
  }
  if(!docs.length){
    list.innerHTML='<div style="padding:40px;text-align:center;color:var(--text3);font-size:14px;">No notifications yet 🌸</div>';
    return;
  }
  const icons={like:'❤️',comment:'💬',follow:'👤',message:'✉️',mention:'@'};
  const texts={like:'liked your post',comment:'commented on your post',follow:'started following you',message:'sent you a message',mention:'mentioned you'};
  docs.forEach(d=>{
    const n=d.data(); const nid=d.id;
    const div=document.createElement('div');
    div.className='notif-item'+(n.read?'':' unread');
    div.innerHTML=
      '<div class="notif-av" style="background:'+(n.fromColor||'var(--pink)')+';color:white;">'
        +(n.fromAvatar?'<img src="'+n.fromAvatar+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">':esc(n.fromInitial||'?'))
      +'</div>'
      +'<div class="notif-icon">'+(icons[n.type]||'🔔')+'</div>'
      +'<div class="notif-text"><strong>'+esc(n.fromName||n.fromHandle||'Someone')+'</strong> '+(texts[n.type]||n.type)+(n.extra?' — <em>'+esc(n.extra.slice(0,40))+'</em>':'')+'</div>'
      +'<div class="notif-time" title="'+fullDate(n.ts)+'">'+timeAgo(n.ts)+'</div>';
    div.addEventListener('click',function(){
      if(!n.read) db.collection('notifications').doc(nid).update({read:true}).catch(()=>{});
      div.classList.remove('unread');
    });
    list.appendChild(div);
  });
  // update unread count label
  const unread=docs.filter(d=>!d.data().read).length;
  const uc=document.getElementById('unreadCount');
  if(uc) uc.textContent=unread?unread+' unread':'All caught up ✓';
}
function markAllRead(){
  db.collection('notifications').where('toUid','==',me.uid).where('read','==',false).get().then(snap=>{
    const batch=db.batch();
    snap.docs.forEach(d=>batch.update(d.ref,{read:true}));
    return batch.commit();
  }).then(()=>{
    toast('All notifications marked as read ✓');
    renderNotifs([]);
  }).catch(()=>toast('Could not mark as read'));
}
function updateNotifBadges(){}// now handled by watchNotifications


const COLORS = [
  'linear-gradient(135deg,#e2688a,#f0a0b8)',
  'linear-gradient(135deg,#a78bfa,#7c3aed)',
  'linear-gradient(135deg,#f9a8d4,#e879a3)',
  'linear-gradient(135deg,#6ee7f7,#2dd4bf)',
  'linear-gradient(135deg,#86efac,#22c55e)',
  'linear-gradient(135deg,#fde68a,#f59e0b)',
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#60a5fa,#2563eb)',
];

const BANNER_COLORS = [
  'linear-gradient(135deg,#f4a8c0,#e2688a,#c93f6e)',
  'linear-gradient(135deg,#c9b8ff,#a78bfa,#7c3aed)',
  'linear-gradient(135deg,#99f6e4,#2dd4bf,#0d9488)',
  'linear-gradient(135deg,#fde68a,#f59e0b,#d97706)',
  'linear-gradient(135deg,#bfdbfe,#60a5fa,#2563eb)',
  'linear-gradient(135deg,#fbcfe8,#f472b6,#db2777)',
];

// ── THEME ─────────────────────────────────────────────
let isDark = localStorage.getItem('kez_theme')==='dark';
const MOON='<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const SUN='<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
function applyTheme(){
  document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
  document.getElementById('themeIcon').innerHTML=isDark?MOON:SUN;
  const dt=document.getElementById('darkToggle');if(dt)dt.checked=isDark;
}
function toggleTheme(){
  isDark=!isDark;
  localStorage.setItem('kez_theme',isDark?'dark':'light');
  applyTheme();
  // Keep browser tab/status bar color in sync with theme
  var tc = document.querySelector('meta[name=theme-color]');
  if(tc) tc.content = isDark ? '#1c1118' : '#e2688a';
}
applyTheme();

// ── NAVIGATION ────────────────────────────────────────
let currentView='home';
let previousView = 'home';
function goTo(view){
  previousView = currentView || 'home';
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('active'));
  const viewEl = document.getElementById('view-'+view);
  if(!viewEl){ console.warn('No view:', view); return; }
  viewEl.classList.add('active');
  const mn = document.getElementById('mn-'+view);
 
