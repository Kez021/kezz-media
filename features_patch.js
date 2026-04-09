// ══════════════════════════════════════════════════════
// KEZ MEDIA — FEATURES PATCH (Clean Rebuild)
// Stickers · GIFs (Giphy) · GC Theme · DM Theme · Nicknames
// GC Reply · @everyone · Push Notifications · Feed Banner
// ══════════════════════════════════════════════════════

// ── STICKER SETS ──────────────────────────────────────
var STICKER_SETS = {
  funny: ['😂','🤣','😹','🙈','💀','🤡','👻','🫠','😵','🤪'],
  love:  ['❤️','😍','🥰','💕','💖','💗','💓','💞','💌','🫶'],
  sad:   ['😢','😭','💔','😔','🥺','😞','😟','😥','🫂','💧'],
  fire:  ['🔥','⚡','💥','✨','🌟','💫','🚀','🎉','🎊','🥳'],
  meme:  ['💯','👀','🧐','🤔','😏','🙄','😤','😠','🤦','🤷'],
  cute:  ['🌸','🌺','🦋','🐱','🐶','🐼','🦊','🐸','🌈','⭐'],
};

// ── GIF SEARCH — Tenor API v2 + large curated fallback ──
var TENOR_KEY2 = 'AIzaSyAyimkuYQYF_FXVALexPzpnFRjFIr1RJZM';

// Large curated GIF library (always works regardless of API)
var CURATED_GIFS = {
  funny: [
    'https://i.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    'https://i.giphy.com/media/l41lISqMeRSQUQ2aY/giphy.gif',
    'https://i.giphy.com/media/4PT6v3PQKG6Yg/giphy.gif',
    'https://i.giphy.com/media/lszAB3TzFtRaU/giphy.gif',
    'https://i.giphy.com/media/Wn74RUT0vjnoU/giphy.gif',
    'https://i.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
    'https://i.giphy.com/media/JMV7IKoqzxlrW/giphy.gif',
    'https://i.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
    'https://i.giphy.com/media/zcVOyJBHYZvX2/giphy.gif',
  ],
  love: [
    'https://i.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    'https://i.giphy.com/media/l0MYJlyOwdlT0SeKk/giphy.gif',
    'https://i.giphy.com/media/3o7TKoXx6b4c9bTa9y/giphy.gif',
    'https://i.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif',
    'https://i.giphy.com/media/kHU8W94VS329y/giphy.gif',
    'https://i.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
    'https://i.giphy.com/media/lnlAifQdenMxW/giphy.gif',
    'https://i.giphy.com/media/dOl2LFzYEXSco/giphy.gif',
  ],
  sad: [
    'https://i.giphy.com/media/ISOckXUybVfQ4/giphy.gif',
    'https://i.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
    'https://i.giphy.com/media/7SF5scGB2AFrgsXxt0/giphy.gif',
    'https://i.giphy.com/media/d2lcHJTG5Tscg/giphy.gif',
    'https://i.giphy.com/media/jUwpNzg9IcyrK/giphy.gif',
    'https://i.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
    'https://i.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
  ],
  wow: [
    'https://i.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    'https://i.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif',
    'https://i.giphy.com/media/5VKbvrjxpVJCM/giphy.gif',
    'https://i.giphy.com/media/OK27wINdQS5YQ/giphy.gif',
    'https://i.giphy.com/media/3ohzdZMDMPVWGMaDNe/giphy.gif',
    'https://i.giphy.com/media/WRQBXSCnEFJIuxktnw/giphy.gif',
    'https://i.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
  ],
  meme: [
    'https://i.giphy.com/media/ely3apij36BJhoZ234/giphy.gif',
    'https://i.giphy.com/media/YQitE4YNQNahy/giphy.gif',
    'https://i.giphy.com/media/oNRZuFhOEDPby/giphy.gif',
    'https://i.giphy.com/media/26DN7fdyFGSfR25ao/giphy.gif',
    'https://i.giphy.com/media/3ohjV3KahwmqwMtcpy/giphy.gif',
    'https://i.giphy.com/media/26ufjV4fOXCjwblrC/giphy.gif',
    'https://i.giphy.com/media/TlK63EQERmiAVzMEgO4/giphy.gif',
    'https://i.giphy.com/media/l2JecLAolPDhm7f44/giphy.gif',
  ],
  cute: [
    'https://i.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif',
    'https://i.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
    'https://i.giphy.com/media/l2JdZoJQOjAkMEThu/giphy.gif',
    'https://i.giphy.com/media/sS2R5PW4WNpjq/giphy.gif',
    'https://i.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    'https://i.giphy.com/media/gFwZfXIqD0eNW/giphy.gif',
    'https://i.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif',
  ],
  fire: [
    'https://i.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif',
    'https://i.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
    'https://i.giphy.com/media/3o7TKABpm8GVBjKuDm/giphy.gif',
    'https://i.giphy.com/media/26gs8TP5RoKOBNZUA/giphy.gif',
    'https://i.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
    'https://i.giphy.com/media/5HZFOdE3YWGIM/giphy.gif',
  ],
  happy: [
    'https://i.giphy.com/media/blSTtZehjAZ8I/giphy.gif',
    'https://i.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
    'https://i.giphy.com/media/QBC5foQmoit33bFfkL/giphy.gif',
    'https://i.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
    'https://i.giphy.com/media/3oFzm0o2hNl5k7pHri/giphy.gif',
    'https://i.giphy.com/media/26gsvRLqhJpAFuLgQ/giphy.gif',
    'https://i.giphy.com/media/XreQmk7ETCak0/giphy.gif',
  ],
};

async function fetchGifs(query, limit) {
  limit = limit || 9;
  var q = (query || 'funny').toLowerCase().trim();

  // Try Tenor v2 API first (most up-to-date GIFs)
  try {
    var url = 'https://tenor.googleapis.com/v2/search'
      + '?q=' + encodeURIComponent(q)
      + '&key=' + TENOR_KEY2
      + '&limit=' + limit
      + '&media_filter=gif'
      + '&contentfilter=medium'
      + '&locale=en_US';
    var res = await fetch(url);
    if (res.ok) {
      var data = await res.json();
      if (data.results && data.results.length) {
        var urls = [];
        data.results.forEach(function(r) {
          var f = r.media_formats;
          var u = (f && f.tinygif && f.tinygif.url) || (f && f.gif && f.gif.url) || '';
          if (u) urls.push(u);
        });
        if (urls.length >= 3) return urls;
      }
    }
  } catch (e) {}

  // Fall back to curated GIFs — always works, no network needed
  var cat = q;
  // Try to match query to a category
  if (!CURATED_GIFS[cat]) {
    var keys = Object.keys(CURATED_GIFS);
    cat = keys.find(function(k){ return q.includes(k) || k.includes(q); }) || 'funny';
  }
  return CURATED_GIFS[cat] || CURATED_GIFS['funny'];
}

// ── MINIMALIST SMILEY SVG ICON ────────────────────────
var STICKER_ICON = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';

// ── STICKER / GIF PICKER ──────────────────────────────
var _stickerTarget = null;
var _stickerContext = null;

function openStickerPicker(target, context) {
  _stickerTarget = target;
  _stickerContext = context;
  var old = document.getElementById('stickerPickerModal');
  if (old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'stickerPickerModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;font-family:Jost,sans-serif;';
  modal.innerHTML =
    '<div style="background:var(--card);border-radius:22px 22px 0 0;width:100%;max-width:520px;max-height:72vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -4px 30px rgba(0,0,0,.2);">'
      + '<div style="display:flex;align-items:center;padding:14px 18px 0;gap:8px;">'
        + '<button id="sp-tab-stickers" onclick="switchStickerTab(\'stickers\')" style="flex:1;padding:8px;border-radius:10px;border:none;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;background:var(--pink);color:white;">Stickers</button>'
        + '<button id="sp-tab-gif" onclick="switchStickerTab(\'gif\')" style="flex:1;padding:8px;border-radius:10px;border:none;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;background:var(--bg3);color:var(--text2);">GIF</button>'
        + '<button onclick="closeStickerPicker()" style="background:none;border:none;font-size:22px;cursor:pointer;color:var(--text3);padding:0 4px;line-height:1;">×</button>'
      + '</div>'
      + '<div id="stickerPickerBody" style="flex:1;overflow-y:auto;padding:14px 18px 28px;"></div>'
    + '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeStickerPicker(); });
  switchStickerTab('stickers');
}

function switchStickerTab(tab) {
  ['stickers', 'gif'].forEach(function(t) {
    var btn = document.getElementById('sp-tab-' + t);
    if (btn) {
      btn.style.background = t === tab ? 'var(--pink)' : 'var(--bg3)';
      btn.style.color = t === tab ? 'white' : 'var(--text2)';
    }
  });
  var body = document.getElementById('stickerPickerBody');
  if (!body) return;
  if (tab === 'stickers') renderStickerGrid(body);
  else renderGifPanel(body);
}

function renderStickerGrid(body) {
  var html = '';
  Object.entries(STICKER_SETS).forEach(function(kv) {
    var cat = kv[0], emojis = kv[1];
    html += '<div style="margin-bottom:14px;">'
      + '<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">' + cat + '</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
      + emojis.map(function(e) {
        return '<button onclick="sendStickerOrGif(\'' + e + '\',\'emoji\')" style="font-size:26px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:6px 8px;cursor:pointer;line-height:1;transition:transform .12s;" onmouseenter="this.style.transform=\'scale(1.2)\'" onmouseleave="this.style.transform=\'scale(1)\'">' + e + '</button>';
      }).join('')
      + '</div></div>';
  });
  body.innerHTML = html;
}

function renderGifPanel(body) {
  body.innerHTML =
    '<div style="margin-bottom:10px;display:flex;gap:8px;">'
      + '<input id="gifSearchInput" type="text" placeholder="Search GIFs..." style="flex:1;background:var(--bg2);border:1.5px solid var(--border);border-radius:12px;padding:8px 12px;color:var(--text);font-family:Jost,sans-serif;font-size:13px;outline:none;" onfocus="this.style.borderColor=\'var(--pink)\'" onblur="this.style.borderColor=\'var(--border)\'">'
      + '<button onclick="doGifSearch()" style="background:var(--pink);border:none;border-radius:12px;padding:9px 14px;color:white;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;">Go</button>'
    + '</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">'
    + ['funny','love','wow','sad','meme','cute','fire','happy'].map(function(q) {
        return '<button onclick="quickGifSearch(\'' + q + '\')" style="background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:4px 10px;font-size:12px;cursor:pointer;color:var(--text2);font-family:Jost,sans-serif;">' + q + '</button>';
      }).join('')
    + '</div>'
    + '<div id="gifGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;"></div>';

  var inp = document.getElementById('gifSearchInput');
  if (inp) {
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') doGifSearch(); });
  }
  // Auto-load funny GIFs immediately
  quickGifSearch('funny');
}

function quickGifSearch(q) {
  var inp = document.getElementById('gifSearchInput');
  if (inp) inp.value = q;
  // Highlight active category button
  document.querySelectorAll('[id^="gifcat-"]').forEach(function(b){
    b.style.background = 'var(--bg3)'; b.style.color = 'var(--text2)'; b.style.borderColor = 'var(--border)';
  });
  var activeBtn = document.getElementById('gifcat-' + q);
  if(activeBtn){ activeBtn.style.background = 'var(--pink)'; activeBtn.style.color = 'white'; activeBtn.style.borderColor = 'var(--pink)'; }
  doGifSearch(q);
}

async function doGifSearch(forceQuery) {
  var q = forceQuery || (document.getElementById('gifSearchInput') || {value:''}).value.trim() || 'funny';
  var grid = document.getElementById('gifGrid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text3);font-size:13px;padding:20px;">Loading GIFs... ✨</div>';
  var gifs = await fetchGifs(q, 12);
  if (!gifs.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text3);font-size:13px;padding:20px;">No GIFs found — try another word!</div>';
    return;
  }
  grid.innerHTML = '';
  gifs.forEach(function(url) {
    var div = document.createElement('div');
    div.style.cssText = 'border-radius:10px;overflow:hidden;cursor:pointer;aspect-ratio:1;background:var(--bg3);';
    div.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.parentElement.style.display=\'none\'">';
    div.addEventListener('click', function() { sendStickerOrGif(url, 'gif'); });
    grid.appendChild(div);
  });
}

function sendStickerOrGif(content, type) {
  closeStickerPicker();
  if (_stickerTarget === 'dm') sendDMSticker(content, type === 'emoji', _stickerContext);
  else if (_stickerTarget === 'gc') sendGCSticker(content, type === 'emoji', _stickerContext);
  else if (_stickerTarget === 'comment') appendEmojiToComment(content, _stickerContext);
}

function closeStickerPicker() {
  var m = document.getElementById('stickerPickerModal');
  if (m) m.remove();
}

// ── SEND STICKER IN DM ────────────────────────────────
async function sendDMSticker(content, isEmoji, convoId) {
  if (!convoId || !activeDMUid) return;
  var msg = {
    from: me.uid, fromName: me.name, fromHandle: me.handle,
    text: isEmoji ? content : '',
    stickerUrl: isEmoji ? '' : content,
    isSticker: !isEmoji, isEmoji: isEmoji,
    ts: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('dms').doc(convoId).collection('messages').add(msg).catch(function(){});
  await db.collection('dms').doc(convoId).update({
    lastMsg: isEmoji ? content : '🎬 GIF',
    lastTs: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(){});
  sendNotification(activeDMUid, 'message', me, isEmoji ? content : '🎬 GIF');
}

// ── SEND STICKER IN GC ────────────────────────────────
async function sendGCSticker(content, isEmoji, gcId) {
  if (!gcId) return;
  var msg = {
    from: me.uid, fromName: me.name, fromHandle: me.handle,
    text: isEmoji ? content : '',
    stickerUrl: isEmoji ? '' : content,
    isSticker: !isEmoji, isEmoji: isEmoji,
    ts: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('groups').doc(gcId).collection('messages').add(msg).catch(function(){});
  await db.collection('groups').doc(gcId).update({
    lastMsg: isEmoji ? content : '🎬 GIF',
    lastTs: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(){});
}

// ── EMOJI STICKER IN COMMENT ──────────────────────────
function appendEmojiToComment(content, postId) {
  var inp = document.getElementById('ci-' + postId);
  if (inp) { inp.value = (inp.value + ' ' + content).trim(); inp.focus(); }
}

// ── INJECT STICKER BUTTON INTO DM INPUT ───────────────
var _origOpenDMWith = openDMWith;
openDMWith = async function(otherUid, otherName) {
  await _origOpenDMWith(otherUid, otherName);
  setTimeout(function() {
    var row = document.querySelector('#chatArea .chat-input-row');
    if (!row || row.querySelector('.dm-sticker-btn')) return;
    var convoId = [me.uid, otherUid].sort().join('_');

    // Sticker button
    var sBtn = document.createElement('button');
    sBtn.className = 'dm-sticker-btn';
    sBtn.title = 'Stickers & GIFs';
    sBtn.style.cssText = 'background:none;border:none;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text2);transition:color .15s;';
    sBtn.innerHTML = STICKER_ICON;
    sBtn.onmouseenter = function() { this.style.color = 'var(--pink)'; };
    sBtn.onmouseleave = function() { this.style.color = 'var(--text2)'; };
    sBtn.onclick = function() { openStickerPicker('dm', convoId); };

    // Settings button (theme + nickname)
    var setBtn = document.createElement('button');
    setBtn.className = 'dm-settings-btn';
    setBtn.title = 'Chat settings';
    setBtn.style.cssText = 'background:none;border:none;cursor:pointer;width:34px;height:34px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text2);transition:color .15s;';
    setBtn.innerHTML = '<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    setBtn.onmouseenter = function() { this.style.color = 'var(--pink)'; };
    setBtn.onmouseleave = function() { this.style.color = 'var(--text2)'; };
    setBtn.onclick = function() { openDMSettings(otherUid, otherName || '', convoId); };

    var sendBtn = row.querySelector('.chat-send');
    if (sendBtn) { row.insertBefore(sBtn, sendBtn); row.insertBefore(setBtn, sBtn); }
    else { row.appendChild(setBtn); row.appendChild(sBtn); }

    // Restore saved theme
    var saved = parseInt(localStorage.getItem('dmTheme_' + otherUid) || '0');
    if (saved > 0) setTimeout(function() { applyDMTheme(otherUid, saved); }, 400);
  }, 300);
};

// ── DM SETTINGS MODAL (theme + nickname) ─────────────
var DM_THEMES = [
  {name:'Default', bg:'',                                         bubble:'linear-gradient(135deg,var(--pink),var(--pink-soft))'},
  {name:'Ocean',   bg:'linear-gradient(135deg,#0f2027,#2c5364)', bubble:'linear-gradient(135deg,#0099b4,#00d4ff)'},
  {name:'Sunset',  bg:'linear-gradient(135deg,#1a0005,#3d0010)', bubble:'linear-gradient(135deg,#f8b500,#ff6b6b)'},
  {name:'Forest',  bg:'linear-gradient(135deg,#071a07,#0d2e0d)', bubble:'linear-gradient(135deg,#56ab2f,#a8e063)'},
  {name:'Midnight',bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e)', bubble:'linear-gradient(135deg,#7c3aed,#a78bfa)'},
  {name:'Blush',   bg:'linear-gradient(135deg,#1a0010,#2d0018)', bubble:'linear-gradient(135deg,#e91e63,#f48fb1)'},
];
var _dmThemes = {};

function openDMSettings(otherUid, otherName, convoId) {
  var old = document.getElementById('dmSettingsModal');
  if (old) old.remove();

  var savedNick = '';
  try { savedNick = JSON.parse(localStorage.getItem('dmNick_' + convoId) || '""'); } catch(e) {}
  var curTheme = _dmThemes[otherUid] || 0;

  var modal = document.createElement('div');
  modal.id = 'dmSettingsModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;font-family:Jost,sans-serif;';

  var themeButtons = DM_THEMES.map(function(t, i) {
    var active = i === curTheme;
    return '<button onclick="applyDMTheme(\'' + otherUid + '\',' + i + ');document.querySelectorAll(\'#dmThemeGrid button\').forEach(function(b){b.style.outline=\'none\'});this.style.outline=\'2.5px solid var(--pink)\'" '
      + 'style="border:none;border-radius:12px;padding:10px 6px;cursor:pointer;background:' + (t.bg || 'var(--bg3)') + ';display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .15s;min-height:64px;outline:' + (active ? '2.5px solid var(--pink)' : 'none') + ';" '
      + 'onmouseenter="this.style.transform=\'scale(1.06)\'" onmouseleave="this.style.transform=\'scale(1)\'">'
      + '<div style="background:' + t.bubble + ';color:white;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.2);">Hi!</div>'
      + '<div style="font-size:10px;' + (t.bg ? 'color:white;text-shadow:0 1px 3px rgba(0,0,0,.5);' : 'color:var(--text2);') + 'font-weight:600;">' + t.name + '</div>'
      + '</button>';
  }).join('');

  modal.innerHTML =
    '<div style="background:var(--card);border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:85vh;overflow-y:auto;padding-bottom:env(safe-area-inset-bottom);">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid var(--border);">'
        + '<div style="font-size:16px;font-weight:700;">Chat Settings</div>'
        + '<button onclick="document.getElementById(\'dmSettingsModal\').remove()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:22px;line-height:1;">×</button>'
      + '</div>'
      + '<div style="padding:16px 18px;">'
        // Nickname
        + '<div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);">'
          + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Nickname for ' + (otherName || 'this person') + '</div>'
          + '<div style="display:flex;gap:8px;">'
            + '<input id="dmNickInput" type="text" value="' + (savedNick || '') + '" placeholder="Set a nickname..." maxlength="30" style="flex:1;background:var(--bg2);border:1.5px solid var(--border);border-radius:12px;padding:10px 14px;color:var(--text);font-family:Jost,sans-serif;font-size:13.5px;outline:none;" onfocus="this.style.borderColor=\'var(--pink)\'" onblur="this.style.borderColor=\'var(--border)\'">'
            + '<button onclick="saveDMNickname(\'' + convoId + '\',\'' + otherUid + '\')" style="background:var(--pink);color:white;border:none;border-radius:12px;padding:10px 16px;font-family:Jost,sans-serif;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">Save</button>'
          + '</div>'
          + '<div style="font-size:11px;color:var(--text3);margin-top:6px;">Only visible to you.</div>'
        + '</div>'
        // Theme
        + '<div>'
          + '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Chat Theme</div>'
          + '<div id="dmThemeGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' + themeButtons + '</div>'
        + '</div>'
      + '</div>'
    + '</div>';

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
}

function applyDMTheme(otherUid, idx) {
  _dmThemes[otherUid] = idx;
  var t = DM_THEMES[idx];
  var msgs = document.getElementById('chatMsgs');
  if (msgs) msgs.style.background = t.bg || '';
  document.querySelectorAll('#chatMsgs .chat-msg.mine .chat-bubble').forEach(function(b) {
    b.style.background = t.bubble;
  });
  localStorage.setItem('dmTheme_' + otherUid, String(idx));
  toast('Theme updated! 🎨');
}

function saveDMNickname(convoId, otherUid) {
  var inp = document.getElementById('dmNickInput');
  if (!inp) return;
  var val = inp.value.trim();
  localStorage.setItem('dmNick_' + convoId, JSON.stringify(val));
  toast(val ? 'Nickname saved ✓' : 'Nickname cleared ✓');
  document.getElementById('dmSettingsModal').remove();
  // Update header name if visible
  var header = document.querySelector('#chatArea .chat-header');
  if (header && val) {
    var nameEl = header.querySelector('[style*="font-size:14px"]');
    if (nameEl) nameEl.textContent = val;
  }
}

// ── GC: INJECT STICKER + @ALL + THEME BUTTON ─────────
var _origOpenGroupConvo = openGroupConvo;
openGroupConvo = async function(gcId, gcData) {
  await _origOpenGroupConvo(gcId, gcData);
  window._activeGCId = gcId;

  setTimeout(function() {
    var row = document.querySelector('#chatArea .chat-input-row');
    if (!row || row.querySelector('.gc-sticker-btn')) return;

    // Sticker button
    var sBtn = document.createElement('button');
    sBtn.className = 'gc-sticker-btn';
    sBtn.title = 'Stickers & GIFs';
    sBtn.style.cssText = 'background:none;border:none;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text2);transition:color .15s;';
    sBtn.innerHTML = STICKER_ICON;
    sBtn.onmouseenter = function() { this.style.color = 'var(--pink)'; };
    sBtn.onmouseleave = function() { this.style.color = 'var(--text2)'; };
    sBtn.onclick = function() { openStickerPicker('gc', gcId); };

    // @everyone button
    var evBtn = document.createElement('button');
    evBtn.className = 'gc-everyone-btn';
    evBtn.title = 'Mention everyone';
    evBtn.style.cssText = 'background:var(--pink-pale);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:11px;font-weight:700;color:var(--pink);padding:4px 7px;flex-shrink:0;font-family:Jost,sans-serif;transition:background .15s;';
    evBtn.textContent = '@all';
    evBtn.onmouseenter = function() { this.style.background = 'var(--pink)'; this.style.color = 'white'; };
    evBtn.onmouseleave = function() { this.style.background = 'var(--pink-pale)'; this.style.color = 'var(--pink)'; };
    evBtn.onclick = function() {
      var inp = document.getElementById('gcInput');
      if (inp) { inp.value = (inp.value + ' @everyone ').trim(); inp.focus(); }
    };

    var sendBtn = row.querySelector('.chat-send');
    if (sendBtn) { row.insertBefore(sBtn, sendBtn); row.insertBefore(evBtn, sBtn); }
    else { row.appendChild(evBtn); row.appendChild(sBtn); }

    // Restore saved GC theme
    var saved = parseInt(localStorage.getItem('gcTheme_' + gcId) || '0');
    if (saved > 0) applyGCTheme(gcId, saved);
  }, 300);
};

// ── GC THEME SYSTEM ───────────────────────────────────
var GC_THEMES = [
  {name:'Pink',    bg:'',                                          bubble:'linear-gradient(135deg,var(--pink),var(--pink-soft))'},
  {name:'Ocean',   bg:'linear-gradient(135deg,#0f2027,#2c5364)',   bubble:'#00b4d8'},
  {name:'Sunset',  bg:'linear-gradient(135deg,#1a0005,#3d0010)',   bubble:'#f8b500'},
  {name:'Forest',  bg:'linear-gradient(135deg,#071a07,#0d2e0d)',   bubble:'#56ab2f'},
  {name:'Midnight',bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e)',  bubble:'#7c3aed'},
  {name:'Blush',   bg:'linear-gradient(135deg,#fce4ec,#f8bbd0)',   bubble:'#e91e63'},
];

function applyGCTheme(gcId, idx) {
  var t = GC_THEMES[idx];
  var msgs = document.getElementById('chatMsgs');
  if (msgs) msgs.style.background = t.bg || '';
  document.querySelectorAll('#chatMsgs .chat-msg.mine .chat-bubble').forEach(function(b) {
    b.style.background = t.bubble;
  });
  localStorage.setItem('gcTheme_' + gcId, String(idx));
  db.collection('groups').doc(gcId).update({theme: idx}).catch(function(){});
}

// ── INJECT THEME GRID INTO GC SETTINGS MODAL ─────────
var _origOpenGCSettings = openGCSettings;
openGCSettings = function(gcId) {
  _origOpenGCSettings(gcId);
  setTimeout(function() {
    var box = document.getElementById('gcSettingsBox');
    if (!box || box.querySelector('#gcThemeSection')) return;
    var activeId = gcId || window._activeGCId;
    if (!activeId) return;

    var curTheme = parseInt(localStorage.getItem('gcTheme_' + activeId) || '0');
    var section = document.createElement('div');
    section.id = 'gcThemeSection';
    section.style.cssText = 'margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);';

    var btnHtml = GC_THEMES.map(function(t, i) {
      return '<button onclick="applyGCTheme(\'' + activeId + '\',' + i + ');document.querySelectorAll(\'#gcThemeSection button\').forEach(function(b){b.style.outline=\'none\'});this.style.outline=\'2.5px solid var(--pink)\'" '
        + 'style="border:none;border-radius:12px;padding:10px 6px;cursor:pointer;background:' + (t.bg || 'var(--bg3)') + ';display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .15s;min-height:64px;outline:' + (i === curTheme ? '2.5px solid var(--pink)' : 'none') + ';" '
        + 'onmouseenter="this.style.transform=\'scale(1.06)\'" onmouseleave="this.style.transform=\'scale(1)\'">'
        + '<div style="background:' + t.bubble + ';color:white;padding:2px 8px;border-radius:8px;font-size:10px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,.2);">Hi!</div>'
        + '<div style="font-size:10px;' + (t.bg ? 'color:white;text-shadow:0 1px 3px rgba(0,0,0,.5);' : 'color:var(--text2);') + 'font-weight:600;">' + t.name + '</div>'
        + '</button>';
    }).join('');

    section.innerHTML =
      '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">Chat Theme</div>'
      + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">' + btnHtml + '</div>';

    // Insert at the very top of the settings content
    var inner = box.querySelector('div[style*="padding:14px"]');
    if (inner) inner.insertBefore(section, inner.firstChild);
    else box.appendChild(section);
  }, 250);
};

// ── GC REPLY-TO SYSTEM ────────────────────────────────
function addGCReplyPreview(gcId, fromHandle, text) {
  var row = document.querySelector('#chatArea .chat-input-row');
  if (!row) return;
  var old = document.getElementById('gcReplyPreview');
  if (old) old.remove();
  var bar = document.createElement('div');
  bar.id = 'gcReplyPreview';
  bar.dataset.replyFrom = fromHandle;
  bar.dataset.replyText = text;
  bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 14px;background:var(--pink-pale);border-top:1px solid var(--border);border-left:3px solid var(--pink);font-family:Jost,sans-serif;';
  bar.innerHTML =
    '<div style="flex:1;min-width:0;">'
      + '<div style="font-size:11px;font-weight:700;color:var(--pink);">Replying to @' + (fromHandle || '') + '</div>'
      + '<div style="font-size:12px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (text || '').slice(0, 60) + '</div>'
    + '</div>'
    + '<button onclick="cancelGCReply()" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:0;line-height:1;">×</button>';
  row.parentNode.insertBefore(bar, row);
  var inp = document.getElementById('gcInput');
  if (inp) inp.focus();
}

function cancelGCReply() {
  var bar = document.getElementById('gcReplyPreview');
  if (bar) bar.remove();
}

window.gcReplyTo = function(fromHandle, text) {
  addGCReplyPreview(window._activeGCId || '', fromHandle, text);
};

// Wire reply on GC message click (delegated)
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.gc-reply-msg-btn');
  if (!btn) return;
  gcReplyTo(btn.dataset.from, btn.dataset.text);
});

// Patch sendGroupMsg to prepend reply context and handle @everyone
var _origSendGroupMsg = sendGroupMsg;
sendGroupMsg = async function(gcId) {
  var inp = document.getElementById('gcInput');
  var bar = document.getElementById('gcReplyPreview');
  if (bar && bar.dataset.replyFrom && inp) {
    inp.value = '[↩ @' + bar.dataset.replyFrom + '] ' + inp.value;
    bar.remove();
  }
  // Handle @everyone — notify all members
  var txt = inp ? inp.value : '';
  await _origSendGroupMsg(gcId);
  if (txt.includes('@everyone')) {
    try {
      var gcDoc = await db.collection('groups').doc(gcId).get();
      if (gcDoc.exists) {
        (gcDoc.data().members || []).filter(function(u) { return u !== me.uid; }).forEach(function(uid) {
          sendNotification(uid, 'mention', me, me.handle + ' mentioned everyone: ' + txt.slice(0, 40));
        });
      }
    } catch(e) {}
  }
};

// ── STICKER BUTTON INJECTION INTO COMMENT INPUTS ──────
function injectCommentStickerBtns() {
  document.querySelectorAll('.c-input').forEach(function(inp) {
    var pid = (inp.id || '').replace('ci-', '');
    if (!pid || inp.parentElement.querySelector('.c-sticker-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'c-sticker-btn';
    btn.title = 'Stickers';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;padding:2px 4px;flex-shrink:0;color:var(--text3);transition:color .15s;';
    btn.innerHTML = STICKER_ICON;
    btn.onmouseenter = function() { this.style.color = 'var(--pink)'; };
    btn.onmouseleave = function() { this.style.color = 'var(--text3)'; };
    btn.onclick = function() { openStickerPicker('comment', pid); };
    inp.parentElement.insertBefore(btn, inp.nextSibling);
  });
}

// Run after every feed render
var _origRenderFeed = renderFeed;
renderFeed = function() {
  _origRenderFeed();
  setTimeout(injectCommentStickerBtns, 300);
};

// ── PUSH NOTIFICATIONS ────────────────────────────────
function requestPushPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  Notification.requestPermission();
}

function showBrowserNotif(title, body, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  var n = new Notification(title, { body: body, icon: '/icon-192.png', tag: tag || 'kez' });
  n.onclick = function() { window.focus(); n.close(); };
  setTimeout(function() { n.close(); }, 6000);
}

var _origShowNotifPopup = showNotifPopup;
showNotifPopup = function(nid, n) {
  _origShowNotifPopup(nid, n);
  var titles = {like:'❤️ New Like', comment:'💬 New Comment', follow:'👤 New Follower', message:'✉️ New Message', mention:'@ Mentioned you', repost:'🔁 Repost'};
  var bodies  = {
    like:    (n.fromName || 'Someone') + ' liked your post',
    comment: (n.fromName || 'Someone') + ' commented' + (n.extra ? ': ' + n.extra.slice(0,50) : ''),
    follow:  (n.fromName || 'Someone') + ' started following you',
    message: (n.fromName || 'Someone') + ': ' + (n.extra || 'Sent you a message').slice(0,60),
    mention: (n.fromName || 'Someone') + ' mentioned you',
    repost:  (n.fromName || 'Someone') + ' reposted your post',
  };
  showBrowserNotif(titles[n.type] || 'Kez Media 🌸', bodies[n.type] || n.type, nid);
};

// ── REAL-TIME NEW POST BANNER ─────────────────────────
function watchForNewPosts() {
  if (!me.uid) return;
  var _first = true;
  postsCol().orderBy('createdAt', 'desc').limit(1).onSnapshot(function(snap) {
    if (_first) { _first = false; return; }
    snap.docChanges().forEach(function(change) {
      if (change.type !== 'added') return;
      var p = change.doc.data();
      if (p.uid === me.uid || p.hidden) return;
      var u = p.user || {};
      var old = document.getElementById('newPostBanner');
      if (old) old.remove();
      var banner = document.createElement('div');
      banner.id = 'newPostBanner';
      banner.style.cssText = 'position:fixed;top:68px;left:50%;transform:translateX(-50%);z-index:9999;background:var(--card);border:1.5px solid var(--pink);border-radius:30px;padding:10px 18px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(226,104,138,.25);cursor:pointer;animation:slideDownIn .35s cubic-bezier(.22,1,.36,1);white-space:nowrap;max-width:90vw;font-family:Jost,sans-serif;';
      banner.innerHTML =
        '<div style="width:26px;height:26px;border-radius:50%;background:' + (u.color || 'var(--pink)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0;">'
          + (u.avatar ? '<img src="' + u.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">' : (u.initial || '?'))
        + '</div>'
        + '<span style="font-size:13px;color:var(--text);">🆕 <strong>' + (u.name || u.handle || 'Someone') + '</strong> posted something new</span>'
        + '<button onclick="event.stopPropagation();document.getElementById(\'newPostBanner\').remove()" style="background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer;padding:0;flex-shrink:0;line-height:1;">×</button>';
      banner.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        goTo('home'); banner.remove();
      });
      document.body.appendChild(banner);
      setTimeout(function() { if (banner.parentNode) banner.remove(); }, 7000);
    });
  });
}

// ── STICKER/GIF RENDERING IN DM MESSAGES ─────────────
// Upgrade chat bubbles that contain big emojis or GIF urls
(function() {
  var _seen = new WeakSet();
  function upgrade(root) {
    (root || document).querySelectorAll('.chat-msg').forEach(function(el) {
      if (_seen.has(el)) return;
      _seen.add(el);
      var bubble = el.querySelector('.chat-bubble');
      if (!bubble) return;
      var txt = bubble.textContent.trim();
      // Single emoji → enlarge
      if (txt && [...txt].length <= 2 && /\p{Emoji}/u.test(txt)) {
        bubble.style.cssText = (bubble.style.cssText || '') + 'background:transparent!important;border:none!important;box-shadow:none!important;font-size:38px!important;padding:4px!important;line-height:1.2!important;';
      }
    });
  }
  new MutationObserver(function(muts) {
    muts.forEach(function(m) { m.addedNodes.forEach(function(n) { if (n.nodeType === 1) upgrade(n); }); });
  }).observe(document.body, {childList: true, subtree: true});
})();

// ── STARTUP ───────────────────────────────────────────
var _origInit = init;
init = async function() {
  await _origInit();
  setTimeout(requestPushPermission, 3000);
  setTimeout(watchForNewPosts, 2500);
};

console.log('[Kez Patch] All features loaded ✓');
