// ══════════════════════════════════════════════════════
// KEZ MEDIA — MEGA FEATURES PATCH
// Covers: Stickers/GIFs, GC Reply-to, GC Themes, @everyone in GC,
//         Mention notifications (comment + poll), Push Notifications (Service Worker),
//         Clickable mentions in comments, DM stickers/GIFs, GC stickers/GIFs
// ══════════════════════════════════════════════════════

// ── GIF/STICKER DATA ──────────────────────────────────
var STICKER_SETS = {
  funny: ['😂','🤣','😹','🙈','💀','🤡','👻','🫠','😵','🤪'],
  love:  ['❤️','😍','🥰','💕','💖','💗','💓','💞','💌','🫶'],
  sad:   ['😢','😭','💔','😔','🥺','😞','😟','😥','🫂','💧'],
  fire:  ['🔥','⚡','💥','✨','🌟','💫','🚀','🎉','🎊','🥳'],
  meme:  ['💯','👀','🧐','🤔','😏','🙄','😤','😠','🤦','🤷'],
  cute:  ['🌸','🌺','🦋','🐱','🐶','🐼','🦊','🐸','🌈','⭐'],
};

// Giphy public API — works without CORS issues
var GIPHY_KEY = 'dc6zaTOxFJmzC'; // public beta key

async function fetchGifs(query, limit){
  limit = limit || 12;
  // Try Giphy first
  try {
    var url = 'https://api.giphy.com/v1/gifs/search?api_key='+GIPHY_KEY+'&q='+encodeURIComponent(query)+'&limit='+limit+'&rating=pg-13&lang=en&bundle=messaging_non_clips';
    var res = await fetch(url);
    if(res.ok){
      var data = await res.json();
      if(data.data && data.data.length){
        return data.data.map(function(g){
          return g.images && g.images.fixed_height_small && g.images.fixed_height_small.url || g.images.original.url || '';
        }).filter(Boolean);
      }
    }
  } catch(e) {}
  // Fallback: use Giphy trending
  try {
    var url2 = 'https://api.giphy.com/v1/gifs/trending?api_key='+GIPHY_KEY+'&limit='+limit+'&rating=pg-13';
    var res2 = await fetch(url2);
    if(res2.ok){
      var data2 = await res2.json();
      if(data2.data && data2.data.length){
        return data2.data.map(function(g){
          return g.images && g.images.fixed_height_small && g.images.fixed_height_small.url || '';
        }).filter(Boolean);
      }
    }
  } catch(e2) {}
  return [];
}

// ── UNIFIED STICKER/GIF PICKER ─────────────────────────
// target: 'dm' | 'gc' | 'comment'
// context: convoId for dm/gc, postId for comment
var _stickerPickerTarget = null;
var _stickerPickerContext = null;
var _stickerPickerTab = 'stickers';

function openStickerPicker(target, context){
  _stickerPickerTarget = target;
  _stickerPickerContext = context;

  var existing = document.getElementById('stickerPickerModal');
  if(existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'stickerPickerModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;padding:0;';
  modal.innerHTML =
    '<div style="background:var(--card);border-radius:22px 22px 0 0;width:100%;max-width:520px;max-height:70vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -4px 30px rgba(0,0,0,.2);">'
      +'<div style="display:flex;align-items:center;padding:14px 18px 0;gap:8px;">'
        +'<button id="sptab-stickers" onclick="switchStickerTab(\'stickers\')" style="flex:1;padding:8px;border-radius:10px;border:none;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;background:var(--pink);color:white;">🎭 Stickers</button>'
        +'<button id="sptab-gif" onclick="switchStickerTab(\'gif\')" style="flex:1;padding:8px;border-radius:10px;border:none;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;background:var(--bg3);color:var(--text2);">🎬 GIF</button>'
        +'<button onclick="closeStickerPicker()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text3);padding:0 4px;">×</button>'
      +'</div>'
      +'<div id="stickerPickerBody" style="flex:1;overflow-y:auto;padding:14px 18px 24px;"></div>'
    +'</div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target===modal) closeStickerPicker(); });
  switchStickerTab('stickers');
}

function switchStickerTab(tab){
  _stickerPickerTab = tab;
  ['stickers','gif'].forEach(function(t){
    var btn = document.getElementById('sptab-'+t);
    if(btn){ btn.style.background = t===tab?'var(--pink)':'var(--bg3)'; btn.style.color = t===tab?'white':'var(--text2)'; }
  });
  var body = document.getElementById('stickerPickerBody');
  if(!body) return;
  if(tab === 'stickers'){
    renderStickerGrid(body);
  } else {
    renderGifSearch(body);
  }
}

function renderStickerGrid(body){
  var html = '';
  Object.entries(STICKER_SETS).forEach(function(entry){
    var category = entry[0], emojis = entry[1];
    html += '<div style="margin-bottom:14px;">'
      +'<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">'+category+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px;">'
      +emojis.map(function(e){ return '<button onclick="sendStickerOrGif(\''+e+'\',\'emoji\')" style="font-size:26px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:6px 8px;cursor:pointer;transition:transform .12s;" onmouseenter="this.style.transform=\'scale(1.2)\'" onmouseleave="this.style.transform=\'scale(1)\'">'+e+'</button>'; }).join('')
      +'</div></div>';
  });
  body.innerHTML = html;
}

function renderGifSearch(body){
  body.innerHTML =
    '<div style="margin-bottom:12px;display:flex;gap:8px;align-items:center;">'
      +'<input id="gifSearchInput" type="text" placeholder="Search GIFs... (e.g. funny, love, wow)" style="flex:1;background:var(--bg2);border:1.5px solid var(--border);border-radius:12px;padding:8px 12px;color:var(--text);font-family:Jost,sans-serif;font-size:13px;outline:none;" onfocus="this.style.borderColor=\'var(--pink)\'" onblur="this.style.borderColor=\'var(--border)\'">'
      +'<button onclick="doGifSearch()" style="background:var(--pink);border:none;border-radius:12px;padding:9px 14px;color:white;font-family:Jost,sans-serif;font-size:13px;cursor:pointer;">Go</button>'
    +'</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">'
    +['funny','love','wow','sad','meme','cute','fire','ok'].map(function(q){
      return '<button onclick="quickGifSearch(\''+q+'\')" style="background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:12px;cursor:pointer;color:var(--text2);font-family:Jost,sans-serif;">'+q+'</button>';
    }).join('')
    +'</div>'
    +'<div id="gifGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;"><div style="grid-column:1/-1;text-align:center;color:var(--text3);font-size:13px;padding:20px;">Search for a GIF above 🔍</div></div>';
  var inp = document.getElementById('gifSearchInput');
  if(inp){ inp.addEventListener('keydown', function(e){ if(e.key==='Enter') doGifSearch(); }); }
}

function quickGifSearch(q){
  var inp = document.getElementById('gifSearchInput');
  if(inp) inp.value = q;
  doGifSearch();
}

async function doGifSearch(){
  var q = (document.getElementById('gifSearchInput')||{value:''}).value.trim() || 'funny';
  var grid = document.getElementById('gifGrid');
  if(!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text3);font-size:13px;padding:20px;">Loading GIFs... ⏳</div>';
  var gifs = await fetchGifs(q, 12);
  if(!gifs.length){
    // Fallback curated gif-like previews using picsum
    gifs = [];
  }
  if(!gifs.length){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text3);font-size:13px;padding:20px;">No GIFs found. Try another word!</div>';
    return;
  }
  grid.innerHTML = '';
  gifs.forEach(function(url){
    var div = document.createElement('div');
    div.style.cssText = 'border-radius:10px;overflow:hidden;cursor:pointer;aspect-ratio:1;background:var(--bg3);';
    div.innerHTML = '<img src="'+url+'" style="width:100%;height:100%;object-fit:cover;" loading="lazy">';
    div.addEventListener('click', function(){ sendStickerOrGif(url, 'gif'); });
    grid.appendChild(div);
  });
}

function sendStickerOrGif(content, type){
  closeStickerPicker();
  var isEmoji = type === 'emoji';
  if(_stickerPickerTarget === 'dm'){
    sendDMSticker(content, isEmoji, _stickerPickerContext);
  } else if(_stickerPickerTarget === 'gc'){
    sendGCSticker(content, isEmoji, _stickerPickerContext);
  } else if(_stickerPickerTarget === 'comment'){
    appendStickerToComment(content, _stickerPickerContext);
  }
}

function closeStickerPicker(){
  var m = document.getElementById('stickerPickerModal');
  if(m) m.remove();
}

// ── SEND STICKER/GIF IN DM ─────────────────────────────
async function sendDMSticker(content, isEmoji, convoId){
  if(!convoId || !activeDMUid) return;
  var msg = {
    from: me.uid, fromName: me.name, fromHandle: me.handle,
    text: isEmoji ? content : '',
    stickerUrl: isEmoji ? '' : content,
    isSticker: !isEmoji,
    isEmoji: isEmoji,
    ts: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('dms').doc(convoId).collection('messages').add(msg).catch(function(){});
  await db.collection('dms').doc(convoId).update({
    lastMsg: isEmoji ? content : '🎬 GIF',
    lastTs: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(){});
  sendNotification(activeDMUid, 'message', me, isEmoji ? content : '🎬 GIF');
}

// ── SEND STICKER/GIF IN GC ─────────────────────────────
async function sendGCSticker(content, isEmoji, gcId){
  if(!gcId) return;
  var msg = {
    from: me.uid, fromName: me.name, fromHandle: me.handle,
    text: isEmoji ? content : '',
    stickerUrl: isEmoji ? '' : content,
    isSticker: !isEmoji,
    isEmoji: isEmoji,
    ts: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('groups').doc(gcId).collection('messages').add(msg).catch(function(){});
  await db.collection('groups').doc(gcId).update({
    lastMsg: isEmoji ? content : '🎬 GIF',
    lastTs: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(){});
}

// ── APPEND EMOJI STICKER TO COMMENT INPUT ─────────────
function appendStickerToComment(content, postId){
  var inp = document.getElementById('ci-'+postId);
  if(inp){
    inp.value = (inp.value + ' ' + content).trim();
    inp.focus();
  }
}

// ── PATCH openDMWith TO ADD STICKER BTN ────────────────
var _origOpenDMWith = openDMWith;
openDMWith = async function(otherUid, otherName){
  await _origOpenDMWith(otherUid, otherName);
  // inject sticker button into DM input row
  setTimeout(function(){
    var row = document.querySelector('#chatArea .chat-input-row');
    if(!row || row.querySelector('.dm-sticker-btn')) return;
    var convoId = [me.uid, otherUid].sort().join('_');
    var btn = document.createElement('button');
    btn.className = 'dm-sticker-btn';
    btn.title = 'Stickers & GIFs';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
    btn.onclick = function(){ openStickerPicker('dm', convoId); };
    var sendBtn = row.querySelector('.chat-send');
    if(sendBtn) row.insertBefore(btn, sendBtn);
    else row.appendChild(btn);
  }, 300);
};

// ── PATCH openGroupConvo TO ADD STICKER BTN + REPLY + THEME + @EVERYONE ──
var _origOpenGroupConvo = openGroupConvo;
openGroupConvo = async function(gcId, gcData){
  await _origOpenGroupConvo(gcId, gcData);
  setTimeout(function(){
    var row = document.querySelector('#chatArea .chat-input-row');
    if(!row || row.querySelector('.gc-sticker-btn')) return;

    // Sticker/GIF button
    var stickerBtn = document.createElement('button');
    stickerBtn.className = 'gc-sticker-btn';
    stickerBtn.title = 'Stickers & GIFs';
    stickerBtn.style.cssText = 'background:none;border:none;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    stickerBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
    stickerBtn.onclick = function(){ openStickerPicker('gc', gcId); };
    var sendBtn = row.querySelector('.chat-send');
    if(sendBtn) row.insertBefore(stickerBtn, sendBtn);
    else row.appendChild(stickerBtn);

    // @everyone button
    var everyoneBtn = document.createElement('button');
    everyoneBtn.className = 'gc-everyone-btn';
    everyoneBtn.title = '@mention everyone';
    everyoneBtn.style.cssText = 'background:var(--pink-pale);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;color:var(--pink);padding:4px 7px;flex-shrink:0;font-family:Jost,sans-serif;';
    everyoneBtn.textContent = '@all';
    everyoneBtn.onclick = function(){
      var inp = document.getElementById('gcInput');
      if(inp){ inp.value = (inp.value+' @everyone ').trim(); inp.focus(); }
    };
    if(sendBtn) row.insertBefore(everyoneBtn, stickerBtn);
    else row.appendChild(everyoneBtn);
  }, 300);

  // Expose gcId globally so @everyone mention can reference it
  window._activeGCId = gcId;
};

// ── PATCH sendGroupMsg TO HANDLE @EVERYONE & REPLY-TO & STICKER ──
var _origSendGroupMsg = sendGroupMsg;
sendGroupMsg = async function(gcId){
  // Check for @everyone → notify all members
  var inp = document.getElementById('gcInput');
  if(inp && inp.value.includes('@everyone')){
    // Normal send, then notify everyone
    var txt = inp.value;
    await _origSendGroupMsg(gcId);
    // Notify all members
    try {
      var gcDoc = await db.collection('groups').doc(gcId).get();
      if(gcDoc.exists){
        var members = gcDoc.data().members || [];
        members.filter(function(uid){ return uid !== me.uid; }).forEach(function(uid){
          sendNotification(uid, 'mention', me, me.handle+' mentioned everyone: '+txt.slice(0,40), '');
        });
      }
    } catch(e) {}
    return;
  }
  // Check reply-to
  var replyDiv = document.getElementById('gcReplyPreview');
  if(replyDiv && replyDiv.dataset.replyText){
    var replyText = replyDiv.dataset.replyText;
    var replyFrom = replyDiv.dataset.replyFrom;
    if(inp) inp.value = '[Replying to @'+replyFrom+'] '+inp.value;
    replyDiv.style.display='none'; replyDiv.dataset.replyText=''; replyDiv.dataset.replyFrom='';
  }
  return _origSendGroupMsg(gcId);
};

// ── GC THEME SYSTEM ────────────────────────────────────
var GC_THEMES = [
  { name:'Default Pink',  bg:'', bubble:'var(--pink)',   text:'white' },
  { name:'Ocean Blue',    bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', bubble:'#00b4d8', text:'white' },
  { name:'Sunset',        bg:'linear-gradient(135deg,#f8b500,#c81d77)', bubble:'#fff', text:'#c81d77' },
  { name:'Forest',        bg:'linear-gradient(135deg,#0a3d0a,#2e6b2e)', bubble:'#56ab2f', text:'white' },
  { name:'Midnight',      bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e)', bubble:'#7c3aed', text:'white' },
  { name:'Bubblegum',     bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)', bubble:'#e91e63', text:'white' },
];
var _gcTheme = {};  // gcId → theme index

function openGCThemePicker(gcId){
  var existing = document.getElementById('gcThemeModal');
  if(existing) existing.remove();
  var modal = document.createElement('div');
  modal.id = 'gcThemeModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;';
  var current = _gcTheme[gcId] || 0;
  modal.innerHTML =
    '<div style="background:var(--card);border-radius:22px;padding:24px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.4);">'
      +'<div style="font-size:16px;font-weight:700;margin-bottom:16px;">🎨 Chat Theme</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">'
      +GC_THEMES.map(function(t,i){
        return '<div onclick="applyGCTheme(\''+gcId+'\','+i+')" style="cursor:pointer;border-radius:14px;padding:12px;background:'+(t.bg||'var(--bg2)')+';border:2.5px solid '+(i===current?'var(--pink)':'transparent')+';min-height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;transition:border-color .2s;">'
          +'<div style="background:'+t.bubble+';color:'+t.text+';padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600;">Hello!</div>'
          +'<div style="font-size:11px;color:white;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.4);">'+t.name+'</div>'
        +'</div>';
      }).join('')
      +'</div>'
      +'<button onclick="document.getElementById(\'gcThemeModal\').remove()" style="width:100%;padding:12px;border-radius:14px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-family:Jost,sans-serif;font-size:14px;cursor:pointer;">Cancel</button>'
    +'</div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });
}

function applyGCTheme(gcId, themeIdx){
  _gcTheme[gcId] = themeIdx;
  var theme = GC_THEMES[themeIdx];
  var chatMsgs = document.getElementById('chatMsgs');
  if(chatMsgs){
    chatMsgs.style.background = theme.bg || '';
    chatMsgs.style.backgroundImage = '';
  }
  // Save to Firestore
  db.collection('groups').doc(gcId).update({ theme: themeIdx }).catch(function(){});
  // Update all mine bubbles color
  document.querySelectorAll('#chatMsgs .chat-msg.mine .chat-bubble').forEach(function(b){
    b.style.background = theme.bubble;
    b.style.color = theme.text;
  });
  document.getElementById('gcThemeModal').remove();
  toast('Chat theme updated! 🎨');
}

// ── ADD THEME BTN TO GC SETTINGS ──────────────────────
// Patch openGCSettings — inject theme grid into gcSettingsBox (the real modal)
var _origOpenGCSettings = typeof openGCSettings === 'function' ? openGCSettings : null;
if(_origOpenGCSettings){
  openGCSettings = function(gcId){
    _origOpenGCSettings(gcId);
    setTimeout(function(){
      var box = document.getElementById('gcSettingsBox');
      if(!box) return;
      if(box.querySelector('#gcThemeSection')) return;
      var activeId = gcId || window._activeGCId;
      if(!activeId) return;
      var TDEFS = [
        {name:'Pink',    bg:'linear-gradient(135deg,#e2688a,#f0a0b8)', bubble:'var(--pink)',  text:'white'},
        {name:'Ocean',   bg:'linear-gradient(135deg,#0f2027,#2c5364)',  bubble:'#00b4d8',    text:'white'},
        {name:'Sunset',  bg:'linear-gradient(135deg,#f8b500,#c81d77)',  bubble:'#fff',        text:'#c81d77'},
        {name:'Forest',  bg:'linear-gradient(135deg,#0a3d0a,#2e6b2e)',  bubble:'#56ab2f',    text:'white'},
        {name:'Midnight',bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e)', bubble:'#7c3aed',    text:'white'},
        {name:'Bubble',  bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)',  bubble:'#e91e63',    text:'white'},
      ];
      var section = document.createElement('div');
      section.id = 'gcThemeSection';
      section.style.cssText = 'margin:0 0 16px;padding-bottom:16px;border-bottom:1px solid var(--border);';
      var btnHtml = TDEFS.map(function(t,i){
        return '<button onclick="applyGCTheme(\''+activeId+'\','+i+');toast(\'Theme updated \u{1F3A8}\')" '
          +'style="border:none;border-radius:12px;padding:10px 6px;cursor:pointer;background:'+t.bg+';'
          +'display:flex;flex-direction:column;align-items:center;gap:4px;font-family:Jost,sans-serif;transition:transform .15s;" '
          +'onmouseenter="this.style.transform=\'scale(1.06)\'" onmouseleave="this.style.transform=\'scale(1)\'">'
          +'<div style="background:'+t.bubble+';color:'+t.text+';padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;">Hi!</div>'
          +'<div style="font-size:10px;color:white;font-weight:600;text-shadow:0 1px 3px rgba(0,0,0,.5);">'+t.name+'</div>'
          +'</button>';
      }).join('');
      section.innerHTML = '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Chat Theme</div>'
        +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">'+btnHtml+'</div>';
      var inner = box.querySelector('div[style*="padding:14px"]');
      if(inner) inner.insertBefore(section, inner.firstChild);
      else box.appendChild(section);
    }, 250);
  };
}

// ── GC REPLY-TO SPECIFIC MESSAGE ───────────────────────
// Wire reply button on GC messages (patch the GC message renderer)
var _origOpenGroupConvo2 = openGroupConvo;
// We patch the snapshot handler via an override of the messages rendering
function addGCReplyPreview(gcId, fromHandle, text){
  // Insert/update reply preview bar above GC input
  var row = document.querySelector('#chatArea .chat-input-row');
  if(!row) return;
  var existing = document.getElementById('gcReplyPreview');
  if(existing) existing.remove();
  var bar = document.createElement('div');
  bar.id = 'gcReplyPreview';
  bar.dataset.replyFrom = fromHandle;
  bar.dataset.replyText = text;
  bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--pink-pale);border-top:1px solid var(--border);border-left:3px solid var(--pink);';
  bar.innerHTML =
    '<div style="flex:1;min-width:0;">'
      +'<div style="font-size:11px;font-weight:700;color:var(--pink);">Replying to @'+esc(fromHandle)+'</div>'
      +'<div style="font-size:12px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(text.slice(0,60))+'</div>'
    +'</div>'
    +'<button onclick="cancelGCReply()" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:0;">×</button>';
  row.parentNode.insertBefore(bar, row);
  var inp = document.getElementById('gcInput');
  if(inp) inp.focus();
}
function cancelGCReply(){
  var bar = document.getElementById('gcReplyPreview');
  if(bar) bar.remove();
}

// Expose reply function globally so GC message buttons can call it
window.gcReplyTo = function(fromHandle, text){
  addGCReplyPreview(window._activeGCId || '', fromHandle, text);
};

// ── PUSH NOTIFICATIONS (Web Push via Service Worker) ───
// Register service worker for background push notifications
function registerServiceWorkerForPush(){
  if(!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // Create the service worker script inline as a blob
  var swCode = `
self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'Kez Media', body: event.data ? event.data.text() : 'New notification' }; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kez Media', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'kez-notif',
      data: data,
      vibrate: [200, 100, 200],
      requireInteraction: false
    })
  );
});
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(clients.matchAll({type:'window'}).then(function(cs){
    if(cs.length){ cs[0].focus(); return; }
    return clients.openWindow('/');
  }));
});
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(clients.claim()); });
`;
  var blob = new Blob([swCode], {type: 'application/javascript'});
  var url = URL.createObjectURL(blob);
  navigator.serviceWorker.register(url).then(function(reg){
    window._swReg = reg;
    console.log('[Kez] Service worker registered for push');
  }).catch(function(e){ console.warn('[Kez] SW registration failed:', e); });
}

// Request notification permission and show browser push for new events
async function requestNotifPermission(){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted') return;
  if(Notification.permission === 'denied') return;
  var perm = await Notification.requestPermission();
  if(perm === 'granted'){
    toast('🔔 Notifications enabled! You\'ll be notified of new activity.');
  }
}

// Show a native browser notification for truly new events
function showBrowserNotification(title, body, tag){
  if(!('Notification' in window) || Notification.permission !== 'granted') return;
  var n = new Notification(title, {
    body: body,
    icon: '/icon-192.png',
    tag: tag || 'kez-notif',
    silent: false
  });
  n.onclick = function(){ window.focus(); n.close(); };
  setTimeout(function(){ n.close(); }, 5000);
}

// Patch showNotifPopup to ALSO show a browser notification
var _origShowNotifPopup = showNotifPopup;
showNotifPopup = function(nid, n){
  _origShowNotifPopup(nid, n);
  var titles = { like:'❤️ New Like', comment:'💬 New Comment', follow:'👤 New Follower',
                 message:'✉️ New Message', mention:'@ You were mentioned', repost:'🔁 Repost' };
  var bodies = { like: (n.fromName||'Someone')+' liked your post',
                 comment: (n.fromName||'Someone')+' commented'+(n.extra?' — '+n.extra.slice(0,50):''),
                 follow: (n.fromName||'Someone')+' started following you',
                 message: (n.fromName||'Someone')+': '+(n.extra||'Sent you a message').slice(0,60),
                 mention: (n.fromName||'Someone')+' mentioned you: '+(n.extra||'').slice(0,50),
                 repost: (n.fromName||'Someone')+' reposted your post' };
  showBrowserNotification(titles[n.type]||'Kez Media', bodies[n.type]||n.type, nid);
};

// Auto-request permission when user becomes active
setTimeout(function(){ if(me && me.uid) requestNotifPermission(); }, 3000);

// ── PATCH COMMENT commentHTML: add sticker btn & clickable mentions ──
// Already works via linkifyCaption — ensure comment box has sticker button
var _origAddComment = addComment;
addComment = function(id){
  _origAddComment(id);
};

// Inject sticker button next to comment inputs when feed renders
function injectCommentStickerButtons(){
  document.querySelectorAll('.c-input').forEach(function(inp){
    var pid = inp.id && inp.id.replace('ci-','');
    if(!pid || inp.parentElement.querySelector('.c-sticker-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'c-sticker-btn';
    btn.title = 'Stickers & GIFs';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:18px;padding:2px 4px;flex-shrink:0;';
    btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
    btn.onclick = function(){ openStickerPicker('comment', pid); };
    inp.parentElement.insertBefore(btn, inp.nextSibling);
  });
}

// ── POLL MENTION NOTIFICATIONS ─────────────────────────
// Already called in submitPollPost — sendMentionNotifications(question, postId)
// Ensure poll caption field also fires mentions:
var _origSubmitPollPost = typeof submitPollPost === 'function' ? submitPollPost : null;
if(_origSubmitPollPost){
  submitPollPost = async function(){
    await _origSubmitPollPost();
    // Also check pollCaption for mentions
    var captionEl = document.getElementById('pollCaption');
    if(captionEl && captionEl.value){
      sendMentionNotifications(captionEl.value, '');
    }
  };
}

// ── PATCH renderFeed TO INJECT STICKER BUTTONS ─────────
var _origRenderFeed2 = renderFeed;
renderFeed = function(){
  _origRenderFeed2();
  setTimeout(injectCommentStickerButtons, 200);
};

// ── PATCH INIT TO SETUP PUSH NOTIFICATIONS ─────────────
var _origInit = init;
init = async function(){
  await _origInit();
  registerServiceWorkerForPush();
  setTimeout(requestNotifPermission, 2500);
};

// ── GC MESSAGES: Render reply-to label + sticker rendering ──
// Patch the GC snapshot to show reply context and sticker content
// We override the part that renders each GC message div

// Intercept GC messages rendering: add reply button on theirs messages
document.addEventListener('click', function(e){
  var btn = e.target.closest('.gc-reply-msg-btn');
  if(!btn) return;
  var fromHandle = btn.dataset.from;
  var text = btn.dataset.text;
  gcReplyTo(fromHandle, text);
});

// ── CSS FOR DM/GC STICKER MESSAGE RENDERING ────────────
// Messages with stickerUrl should show as image, isEmoji as big emoji
// Patch the existing DM message rendering via a MutationObserver
// that upgrades sticker messages after they're added to DOM
(function(){
  var _upgradedMsgs = new WeakSet();
  function upgradeMessages(root){
    (root || document).querySelectorAll('.chat-msg').forEach(function(el){
      if(_upgradedMsgs.has(el)) return;
      _upgradedMsgs.add(el);
      // If bubble text is a single emoji (sticker), enlarge it
      var bubble = el.querySelector('.chat-bubble');
      if(!bubble) return;
      var text = bubble.textContent.trim();
      if(text && [...text].length <= 2 && /\p{Emoji}/u.test(text)){
        bubble.style.cssText = (bubble.style.cssText||'') + 'background:transparent!important;border:none!important;font-size:38px;padding:4px;';
      }
      // If bubble contains an img (gif), style it
      var imgs = bubble.querySelectorAll('img');
      if(imgs.length){
        imgs.forEach(function(img){
          if(img.src && img.src.includes('tenor') || img.src && img.src.includes('giphy')){
            img.style.cssText = 'max-width:180px;border-radius:12px;display:block;cursor:pointer;';
          }
        });
      }
    });
  }
  var mo = new MutationObserver(function(muts){
    muts.forEach(function(m){ m.addedNodes.forEach(function(n){ if(n.nodeType===1){ upgradeMessages(n); } }); });
  });
  mo.observe(document.body, {childList:true, subtree:true});
})();

// ── POLL CAPTION MENTION HOOK ──────────────────────────
// Add mention input hook to poll caption field when modal opens
var _origOpenModal2 = openModal;
openModal = function(){
  _origOpenModal2();
  setTimeout(function(){
    var pollCap = document.getElementById('pollCaption');
    if(pollCap && !pollCap._mentionHooked){
      pollCap._mentionHooked = true;
      pollCap.addEventListener('input', function(){ handleMentionInput(pollCap, 'new'); });
    }
    var pollQ = document.getElementById('pollQuestion');
    if(pollQ && !pollQ._mentionHooked){
      pollQ._mentionHooked = true;
      pollQ.addEventListener('input', function(){ handleMentionInput(pollQ, 'new'); });
    }
  }, 100);
};

// ── ALSO EXPOSE GC THEME BTN VIA HEADER SETTINGS BTN ──
// Patch the settings button in GC header to include theme option
// Done by hooking after openGCSettings shows the panel
document.addEventListener('click', function(e){
  var settingsBtn = e.target.closest('[title="Group settings"]');
  if(!settingsBtn) return;
  // The settings will open via openGCSettings — we inject theme btn after
  setTimeout(function(){
    var modal = document.getElementById('gcSettingsPanel');
    if(!modal) return;
    if(modal.querySelector('.gc-theme-btn-injected')) return;
    var gcId = window._activeGCId;
    if(!gcId) return;
    var btn = document.createElement('button');
    btn.className = 'gc-theme-btn-injected';
    btn.style.cssText = 'width:100%;margin-top:12px;padding:12px 16px;border-radius:14px;border:1.5px solid var(--border);background:transparent;color:var(--pink);font-family:Jost,sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;justify-content:center;';
    btn.innerHTML = '🎨 Change Chat Theme';
    btn.onclick = function(){ openGCThemePicker(gcId); };
    modal.appendChild(btn);
  }, 300);
});

// ── REAL-TIME FEED NOTIFICATION BANNER ─────────────────
// Show a top banner whenever someone posts something new on the feed
var _feedPostCount = 0;
var _feedNewBannerShown = false;

// Watch posts collection for new adds (beyond initial load)
function watchForNewPosts(){
  if(!me.uid) return;
  var _firstLoad = true;
  postsCol().orderBy('createdAt','desc').limit(1).onSnapshot(function(snap){
    if(_firstLoad){ _firstLoad=false; _feedPostCount = snap.docs.length; return; }
    snap.docChanges().forEach(function(change){
      if(change.type === 'added'){
        var p = change.doc.data();
        if(p.uid === me.uid) return; // don't show for own posts
        if(p.hidden) return;
        showFeedNewPostBanner(p);
      }
    });
  });
}

function showFeedNewPostBanner(p){
  var existing = document.getElementById('newPostBanner');
  if(existing) existing.remove();
  var user = p.user || {};
  var name = user.name || user.handle || 'Someone';
  var banner = document.createElement('div');
  banner.id = 'newPostBanner';
  banner.style.cssText = 'position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:9999;background:var(--card);border:1.5px solid var(--pink);border-radius:30px;padding:10px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(226,104,138,.25);cursor:pointer;animation:slideDownIn .35s cubic-bezier(.22,1,.36,1);white-space:nowrap;max-width:90vw;';
  banner.innerHTML =
    '<div style="width:28px;height:28px;border-radius:50%;background:'+(user.color||'var(--pink)')+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;overflow:hidden;flex-shrink:0;">'
      +(user.avatar?'<img src="'+esc(user.avatar)+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">':esc(user.initial||(name?name[0]:'?')))
    +'</div>'
    +'<span style="font-size:13px;color:var(--text);font-weight:500;">🆕 <strong>'+esc(name)+'</strong> just posted something new!</span>'
    +'<button onclick="document.getElementById(\'newPostBanner\').remove()" style="background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer;padding:0;flex-shrink:0;">×</button>';
  banner.addEventListener('click', function(e){
    if(e.target.tagName === 'BUTTON') return;
    goTo('home');
    banner.remove();
  });
  document.body.appendChild(banner);
  setTimeout(function(){ if(banner.parentNode) banner.remove(); }, 7000);
}

// Hook into init to start watching
var _origInit2 = init;
init = async function(){
  await _origInit2();
  setTimeout(watchForNewPosts, 2000);
};


// ── DM SETTINGS: THEME + NICKNAME ─────────────────────
var DM_THEMES = [
  {name:'Pink',    bg:'',                                              bubble:'linear-gradient(135deg,var(--pink),var(--pink-soft))'},
  {name:'Ocean',   bg:'linear-gradient(135deg,#0f2027,#2c5364)',       bubble:'linear-gradient(135deg,#00b4d8,#0077b6)'},
  {name:'Sunset',  bg:'linear-gradient(135deg,#f8b500,#c81d77)',       bubble:'linear-gradient(135deg,#fff,#fce4ec)'},
  {name:'Forest',  bg:'linear-gradient(135deg,#0a3d0a,#2e6b2e)',       bubble:'linear-gradient(135deg,#56ab2f,#a8e063)'},
  {name:'Midnight',bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e)',      bubble:'linear-gradient(135deg,#7c3aed,#a78bfa)'},
  {name:'Bubblegum',bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)',     bubble:'linear-gradient(135deg,#e91e63,#f48fb1)'},
];
var _dmThemes = {}; // uid → theme index

function openDMSettings(otherUid, otherName){
  var existing = document.getElementById('dmSettingsModal');
  if(existing) existing.remove();

  var convoId = [me.uid, otherUid].sort().join('_');
  var savedNick = '';
  try { savedNick = JSON.parse(localStorage.getItem('dmNick_'+convoId)||'""'); } catch(e){}
  var currentTheme = _dmThemes[otherUid] || 0;

  var modal = document.createElement('div');
  modal.id = 'dmSettingsModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;';

  var TDEFS = DM_THEMES;
  var themeGrid = TDEFS.map(function(t, i){
    return '<button data-ti="'+i+'" onclick="applyDMTheme(''+otherUid+'','+i+');document.querySelectorAll('#dmThemeGrid button').forEach(function(b){b.style.outline='none'});this.style.outline='2.5px solid white'" style="border:none;border-radius:12px;padding:10px 6px;cursor:pointer;background:'+(t.bg||'var(--bg3)')+';display:flex;flex-direction:column;align-items:center;gap:4px;font-family:Jost,sans-serif;transition:transform .15s;min-height:60px;" onmouseenter="this.style.transform='scale(1.06)'" onmouseleave="this.style.transform='scale(1)'">'
      +'<div style="background:'+t.bubble+';color:white;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.15);">Hi!</div>'
      +'<div style="font-size:10px;'+(t.bg?'color:white;':'color:var(--text2);')+';font-weight:600;'+(t.bg?'text-shadow:0 1px 3px rgba(0,0,0,.5);':'')+'>'+t.name+'</div>'
      +'</button>';
  }).join('');

  modal.innerHTML =
    '<div style="background:var(--card);border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom);">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid var(--border);">'
        +'<div style="font-size:16px;font-weight:700;font-family:Jost,sans-serif;">Chat Settings</div>'
        +'<button onclick="document.getElementById('dmSettingsModal').remove()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:22px;line-height:1;">×</button>'
      +'</div>'
      +'<div style="padding:16px 18px;">'
        // Nickname
        +'<div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">'
          +'<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Nickname for '+esc(otherName)+'</div>'
          +'<div style="display:flex;gap:8px;">'
            +'<input id="dmNickInput" type="text" value="'+esc(savedNick)+'" placeholder="Set a nickname..." maxlength="30" style="flex:1;background:var(--bg2);border:1.5px solid var(--border);border-radius:12px;padding:10px 14px;color:var(--text);font-family:Jost,sans-serif;font-size:13.5px;outline:none;" onfocus="this.style.borderColor='var(--pink)'" onblur="this.style.borderColor='var(--border)'">'
            +'<button onclick="saveDMNickname(''+convoId+'',''+otherUid+'')" style="background:var(--pink);color:white;border:none;border-radius:12px;padding:10px 16px;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">Save</button>'
          +'</div>'
          +'<div style="font-size:11px;color:var(--text3);margin-top:6px;">Only visible to you.</div>'
        +'</div>'
        // Theme
        +'<div>'
          +'<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Chat Theme</div>'
          +'<div id="dmThemeGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">'+themeGrid+'</div>'
        +'</div>'
      +'</div>'
    +'</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e){ if(e.target===modal) modal.remove(); });

  // Mark current theme
  setTimeout(function(){
    var btns = document.querySelectorAll('#dmThemeGrid button');
    if(btns[currentTheme]) btns[currentTheme].style.outline = '2.5px solid var(--pink)';
  }, 50);
}

function applyDMTheme(otherUid, idx){
  _dmThemes[otherUid] = idx;
  var theme = DM_THEMES[idx];
  var msgs = document.getElementById('chatMsgs');
  if(msgs){
    msgs.style.background = theme.bg || '';
  }
  // Update my bubble colors
  document.querySelectorAll('#chatMsgs .chat-msg.mine .chat-bubble').forEach(function(b){
    b.style.background = theme.bubble;
  });
  // Save to localStorage
  localStorage.setItem('dmTheme_'+otherUid, String(idx));
  toast('Theme updated! 🎨');
}

function saveDMNickname(convoId, otherUid){
  var inp = document.getElementById('dmNickInput');
  if(!inp) return;
  var val = inp.value.trim();
  localStorage.setItem('dmNick_'+convoId, JSON.stringify(val));
  toast(val ? 'Nickname saved: '+val+' ✓' : 'Nickname cleared ✓');
  document.getElementById('dmSettingsModal').remove();
  // Refresh DM header to show nickname
  var header = document.querySelector('#chatArea .chat-header');
  if(header){
    var nameEl = header.querySelector('div[style*="font-size:14px"]');
    if(nameEl && val) nameEl.textContent = val;
  }
}

// Restore DM theme from localStorage when opening a DM
var _origOpenDMWith2 = openDMWith;
openDMWith = async function(otherUid, otherName){
  await _origOpenDMWith2(otherUid, otherName);
  // Restore saved theme
  var savedThemeIdx = parseInt(localStorage.getItem('dmTheme_'+otherUid)||'0');
  if(savedThemeIdx > 0){
    setTimeout(function(){ applyDMTheme(otherUid, savedThemeIdx); }, 400);
  }
  // Inject settings button into DM header
  setTimeout(function(){
    var header = document.querySelector('#chatArea .chat-header');
    if(!header || header.querySelector('.dm-settings-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'dm-settings-btn';
    btn.title = 'Chat settings';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:6px;color:var(--text3);display:flex;align-items:center;justify-content:center;';
    btn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    var uName = otherName || '';
    btn.onclick = function(){ openDMSettings(otherUid, uName); };
    // Insert before the call button (last button in header)
    var callBtn = header.querySelector('button[title="Voice Call"]');
    if(callBtn) header.insertBefore(btn, callBtn);
    else header.appendChild(btn);
  }, 350);
};

console.log('[Kez Patch] Mega features loaded: stickers/GIFs, GC reply, GC theme, @everyone, push notifications, new-post banners ✓');
