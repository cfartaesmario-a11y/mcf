/* MCF Workspace · bloqueo de cuentas
   Si el administrador bloquea una cuenta en MCF Calendar (expulsados/{uid}.bloqueado),
   esa persona pierde el acceso a todas las apps de MCF Workspace:
   se le cierra la sesión y este dispositivo queda bloqueado hasta que entre con una cuenta no bloqueada. */
(function () {
  var K = 'mcf.bloqueo', S = document.currentScript, EXEMPT = !!(S && S.getAttribute('data-exempt'));
  function flag() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function overlay() {
    if (EXEMPT || document.getElementById('mcfBlock')) return;
    var o = document.createElement('div'); o.id = 'mcfBlock';
    o.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#0a0a0b;color:#f2f2f3;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center');
    o.innerHTML = '<div style="max-width:420px"><div style="font-size:54px;margin-bottom:12px">⛔</div>' +
      '<h1 style="margin:0 0 10px;font-size:26px;font-weight:800">Cuenta bloqueada</h1>' +
      '<p style="margin:0 0 22px;color:#a1a1aa;font-size:15px;line-height:1.5">El administrador ha bloqueado esta cuenta en MCF Workspace. No puedes usar ninguna de sus apps. Si crees que es un error, habla con él.</p>' +
      '<a href="/2batx/" style="display:inline-block;padding:12px 20px;border-radius:12px;background:#fff;color:#0a0a0b;font-weight:800;text-decoration:none">Entrar con otra cuenta</a></div>';
    (document.body || document.documentElement).appendChild(o);
    try { document.documentElement.style.overflow = 'hidden'; } catch (e) {}
    try { document.querySelectorAll('audio,video').forEach(function (m) { m.pause(); }); } catch (e) {}
    if (document.pointerLockElement) document.exitPointerLock();
  }
  function blocked(uid) {
    try { localStorage.setItem(K, JSON.stringify({ uid: uid, t: Date.now() })); } catch (e) {}
    if (EXEMPT) return; // MCF Calendar ya muestra su propio aviso
    overlay(); try { firebase.auth().signOut(); } catch (e) {}
  }
  function clear() { try { localStorage.removeItem(K); } catch (e) {} var o = document.getElementById('mcfBlock'); if (o) o.remove(); document.documentElement.style.overflow = ''; }
  // dispositivo marcado: bloqueado aunque no haya sesión
  if (flag() && !EXEMPT) { if (document.body) overlay(); else document.addEventListener('DOMContentLoaded', overlay); }
  // que nadie lo quite a mano
  setInterval(function () { if (flag() && !EXEMPT && !document.getElementById('mcfBlock')) overlay(); }, 1500);
  // comprobación en directo con la cuenta
  var tries = 0;
  (function wait() {
    if (window.firebase && firebase.apps && firebase.apps.length && firebase.auth && firebase.database) return attach();
    if (++tries < 120) setTimeout(wait, 250);
  })();
  function attach() {
    var off = null;
    firebase.auth().onAuthStateChanged(function (u) {
      if (off) { off(); off = null; }
      if (!u || u.isAnonymous) return;
      var ref = firebase.database().ref('expulsados/' + u.uid);
      var h = function (sn) { var v = sn.val(); if (v && v.bloqueado) blocked(u.uid); else if (flag()) clear(); };
      ref.on('value', h, function () {});
      off = function () { ref.off('value', h); };
    });
  }
})();
