/* RemoteHub: YouTube ad blocking for the in-app YouTube page.
 * An updated copy is fetched from remotehub-releases data/yt-adblock.js, so a fix
 * reaches the app without a new APK. Keep the version line: the app reads it. */
// rh-adblock-version: 1
(function () {
  if (window.__rhAds) return;
  window.__rhAds = 1;

  // 1) Remove ads from the data the page loads (player responses, feeds).
  var AD_KEYS = ['adPlacements', 'playerAds', 'adSlots', 'adBreakHeartbeatParams', 'adSlotRenderer'];
  function strip(o, depth) {
    if (!o || typeof o !== 'object' || depth > 6) return o;
    for (var i = 0; i < AD_KEYS.length; i++) if (AD_KEYS[i] in o) { try { delete o[AD_KEYS[i]]; } catch (e) {} }
    if (Array.isArray(o)) {
      for (var j = o.length - 1; j >= 0; j--) {
        var it = o[j];
        if (it && typeof it === 'object' && (it.adSlotRenderer || it.promotedSparklesWebRenderer || it.promotedVideoRenderer || it.statementBannerRenderer)) o.splice(j, 1);
        else strip(it, depth + 1);
      }
    } else {
      for (var k in o) if (o[k] && typeof o[k] === 'object') strip(o[k], depth + 1);
    }
    return o;
  }
  try {
    var parse = JSON.parse;
    JSON.parse = function () { return strip(parse.apply(this, arguments), 0); };
  } catch (e) {}
  try {
    var rjson = Response.prototype.json;
    Response.prototype.json = function () { return rjson.apply(this, arguments).then(function (d) { return strip(d, 0); }); };
  } catch (e) {}
  ['ytInitialPlayerResponse', 'ytInitialData'].forEach(function (name) {
    var v;
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        get: function () { return v; },
        set: function (x) { v = strip(x, 0); }
      });
    } catch (e) {}
  });

  // 2) Hide ad boxes in the page.
  var css = 'ytm-promoted-sparkles-web-renderer,ytm-promoted-video-renderer,ytm-companion-ad-renderer,' +
    'ad-slot-renderer,ytm-ad-slot-renderer,ytm-promoted-sparkles-text-search-renderer,.ytp-ad-overlay-container,' +
    '.ytp-ad-image-overlay,ytm-statement-banner-renderer,.ytm-promoted-sparkles-web-renderer,#player-ads,' +
    '.masthead-ad,ytm-paid-content-overlay-renderer{display:none!important}';
  function addCss() {
    if (document.getElementById('rh-ads-css')) return;
    var s = document.createElement('style'); s.id = 'rh-ads-css'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }
  addCss();
  document.addEventListener('DOMContentLoaded', addCss);

  // 3) If a video ad still plays: mute it, jump to its end and press "Skip".
  setInterval(function () {
    addCss();
    var player = document.querySelector('.html5-video-player');
    var ad = player && (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting'));
    var skip = document.querySelector('.ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-skip-ad-button,button[class*="skip-ad"],.ytp-ad-skip-button-slot button');
    if (skip) { try { skip.click(); } catch (e) {} }
    var v = player && player.querySelector('video');
    if (!ad) {
      // The ad is over: give the real video its sound and normal speed back.
      if (v && v.__rhAd) { v.__rhAd = false; v.muted = !!v.__rhWasMuted; try { v.playbackRate = 1; } catch (e) {} }
      return;
    }
    if (v) {
      if (!v.__rhAd) { v.__rhAd = true; v.__rhWasMuted = v.muted; }
      v.muted = true;
      if (isFinite(v.duration) && v.duration > 0) v.currentTime = v.duration;
      try { v.playbackRate = 16; } catch (e) {}
    }
  }, 400);
})();
