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

// ── DELETE COMMENT ────────────────────────────────────
async function deleteComment(postId, commentIdx){
  postId = String(postId);
  var p = posts.find(function(x){ return String(x.id)===postId; });
  if(!p || !p.comments[commentIdx]) return;
  var c = p.comments[commentIdx];
  // Only allow owner of comment or admin
  if(c.user && c.user.uid !== me.uid && !isAdmin()){ toast('You can only delete your own comments'); return; }
  if(!confirm('Delete this comment?')) return;

  // Save to deletedComments collection for admin audit
  db.collection('deletedComments').add({
    postId: postId,
    commentIdx: commentIdx,
    text: c.text||'',
    uid: c.user&&c.user.uid||'',
    handle: c.user&&c.user.handle||'',
    deletedBy: me.uid,
    deletedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(){});

  // Remove from local array
  p.comments.splice(commentIdx, 1);
  // Update Firestore
  await updatePostField(postId, {comments: p.comments}).catch(function(){});
  // Re-render all comment lists for this post
  document.querySelectorAll('[id^="cl-'+postId+'"]').forEach(function(cl){
    cl.innerHTML = p.comments.map(function(c2,i){ return commentHTML(c2,postId,i); }).join('');
  });
  // Update comment count on all cards
  document.querySelectorAll('#pc-'+postId).forEach(function(card){
    var cc = card.querySelectorAll('.act')[1];
    if(cc && cc.querySelector('.cc')) cc.querySelector('.cc').textContent = p.comments.length;
  });
  toast('Comment deleted');
}

async function deleteReply(postId, commentIdx, replyIdx){
