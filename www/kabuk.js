/* ================= Demir Kağnı — Mr. Anduv! ortak kabuk =================
   Bütün oyunlarımızdaki standart (CLAUDE.md "Test geri bildirim standardı"):
   rehber kartları, Nasıl Oynanır, Ayarlar (dil, müzik, ★ Puan ver, Bize yaz, Verilerimi sil),
   Arkadaşına öner / zafer paylaş, uygulama içi puan (en çok 2 kez, yalnız başarıdan sonra),
   Tam Sürüm (G70: 1. görev ücretsiz, devamı uygulama içi tek seferlik), ekran uyanık (G75), Esc/P mola.
   Oyunun kendi değişkenlerine (state, lang, mi, P, V, prisoners, bossOn, cam) aynı sayfadaki betikten ulaşır.
   Destek adresi derlemede GitHub değişkeni DESTEK_EPOSTA'dan yazılır (__DESTEK_EPOSTA__ yer tutucusu). */
(function () {
  'use strict';
  const CAP = window.Capacitor;
  const native = !!(CAP && CAP.isNativePlatform && CAP.isNativePlatform());
  const plat = native ? CAP.getPlatform() : (/Electron/i.test(navigator.userAgent) ? 'steam' : /OculusBrowser|Quest/i.test(navigator.userAgent) ? 'quest' : 'web');
  const APP_VER = '0.4.0';
  const DESTEK = '__DESTEK_EPOSTA__';
  const SHARE_URL = 'https://emreanduv.github.io/demir-kagni/';
  const TAM_URUN = 'com.anduv.demirkagni.tamsurum';
  const KEY = 'demirkagni_v1';

  /* ---------- kayıt ---------- */
  let save = { rh: [], rated: false, rateAsked: 0, tam: false };
  try { Object.assign(save, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
  const seen = k => save.rh.includes(k);
  const markSeen = k => { if (!seen(k)) { save.rh.push(k); persist(); } };

  /* ---------- metinler ---------- */
  const TX = {
    tr: {
      set: 'Ayarlar', pause: 'Mola', resume: 'Devam', lang: 'Dil: Türkçe', music: 'Müzik', on: 'açık', off: 'kapalı',
      help: 'Nasıl Oynanır', rate: '★ Puan ver', feed: 'Bize yaz', erase: 'Verilerimi sil', eraseSure: 'Emin misin? Bir daha dokun',
      home: 'Ana menü', ok: 'Tamam', share: 'Arkadaşına öner', winShare: 'Zaferi paylaş', copied: 'Bağlantı kopyalandı',
      shareText: 'Demir Kağnı: kağnıyla bozkırda aksiyon! Bir Mr. Anduv! yapımı.', guideReset: 'Rehber baştan gösterilecek',
      guideAgain: 'Rehberi baştan göster', tam: '★ Tam Sürüm', restore: 'Satın alımı geri yükle', later: 'Sonra',
      tamTtl: 'Tam Sürüm', tamTxt: 'İlk görevi bitirdin! Sonraki görevler Tam Sürüm ile açılır. Tek sefer öde, hepsi senin.',
      tamBuy: 'Tam Sürümü al', tamOk: 'Tam Sürüm açıldı, teşekkürler!', tamNone: 'Satın alım bulunamadı', tamFail: 'Satın alım tamamlanmadı',
      rateTtl: 'Beğendin mi?', rateTxt: 'Demir Kağnı hoşuna gittiyse bir puan verir misin? Çok işimize yarar.', rateYes: '★ Puan ver', rateIdea: 'Önerim var', rateLater: 'Sonra',
      helpBody: `<h3>Amaç</h3><p>Kahramanını seç, kağnıyla ilerle, esirleri kurtar ve bölümün sonundaki büyük düşmanı yen.</p>
<h3>Dokunmatik</h3><p>Sol alttaki yön tuşlarıyla yürü ve nişan al (yukarı: yukarıya ateş, aşağı: çömel). Sağdaki tuşlar: <b>Ateş</b>, <b>Zıpla</b>, <b>Bomba</b>.</p>
<h3>Klavye</h3><p><b>WASD</b> ya da <b>oklar</b>: yürü / nişan · <b>J</b> ya da <b>Z</b>: ateş · <b>K</b>, <b>X</b> ya da <b>Boşluk</b>: zıpla · <b>L</b> ya da <b>C</b>: bomba · <b>Enter</b>: onay · <b>Esc</b> ya da <b>P</b>: mola</p>
<h3>Oyun kolu</h3><p>Bluetooth kolla da oynanır.</p>
<h3>İpuçları</h3><p>Kağnıya yaklaşıp <b>aşağı</b> bas: içine binersin; kağnının topu ağır vurur. Esirleri kurtarınca sana silah ya da bomba bırakırlar. Büyük düşmanın zayıf anını kolla.</p>`,
      tips: {
        kontrol: 'Sağa doğru yürü! Ateş ile vur, Zıpla ile engelleri aş.',
        esir: 'Bağlı bir esir! Yanına gidip ipini kes; sana bir armağan bırakır.',
        arac: 'Kağnı! Yanına git ve <b>aşağı</b> bas, içine bin. Topu ağır vurur.',
        boss: 'Büyük düşman geliyor! Saldırısını izle, açık verince vur.',
      },
    },
    en: {
      set: 'Settings', pause: 'Paused', resume: 'Resume', lang: 'Language: English', music: 'Music', on: 'on', off: 'off',
      help: 'How to Play', rate: '★ Rate', feed: 'Send feedback', erase: 'Delete my data', eraseSure: 'Sure? Tap again',
      home: 'Main menu', ok: 'OK', share: 'Tell a friend', winShare: 'Share victory', copied: 'Link copied',
      shareText: 'Demir Kağnı: steppe action with a war cart! Made by Mr. Anduv!.', guideReset: 'Tips will show again',
      guideAgain: 'Show tips again', tam: '★ Full Version', restore: 'Restore purchase', later: 'Later',
      tamTtl: 'Full Version', tamTxt: 'You finished the first mission! The next missions come with the Full Version. Pay once, keep it all.',
      tamBuy: 'Get Full Version', tamOk: 'Full Version unlocked, thank you!', tamNone: 'No purchase found', tamFail: 'Purchase not completed',
      rateTtl: 'Enjoying it?', rateTxt: 'If you like Demir Kağnı, would you rate it? It helps us a lot.', rateYes: '★ Rate', rateIdea: 'I have an idea', rateLater: 'Later',
      helpBody: `<h3>Goal</h3><p>Pick your hero, push forward with the war cart, free the prisoners and beat the big enemy at the end.</p>
<h3>Touch</h3><p>Walk and aim with the pad at bottom left (up: shoot up, down: crouch). Right buttons: <b>Fire</b>, <b>Jump</b>, <b>Bomb</b>.</p>
<h3>Keyboard</h3><p><b>WASD</b> or <b>arrows</b>: walk / aim · <b>J</b> or <b>Z</b>: fire · <b>K</b>, <b>X</b> or <b>Space</b>: jump · <b>L</b> or <b>C</b>: bomb · <b>Enter</b>: confirm · <b>Esc</b> or <b>P</b>: pause</p>
<h3>Gamepad</h3><p>Bluetooth controllers work too.</p>
<h3>Tips</h3><p>Walk up to the cart and press <b>down</b> to climb in; its cannon hits hard. Freed prisoners drop weapons or bombs. Watch the boss for an opening.</p>`,
      tips: {
        kontrol: 'Walk to the right! Fire to shoot, Jump to clear obstacles.',
        esir: 'A captive! Walk up and cut the rope; they will leave you a gift.',
        arac: 'A war cart! Walk up and press <b>down</b> to climb in. Its cannon hits hard.',
        boss: 'The big enemy is coming! Watch its attack and strike when it opens up.',
      },
    },
  };
  const t = k => (TX[lang] || TX.tr)[k];

  /* ---------- görünüm ---------- */
  const css = document.createElement('style');
  css.textContent = `
.dk-b{position:absolute;z-index:6;font:800 13px Rubik,sans-serif;color:#f3d58a;background:rgba(40,20,8,.72);border:1.5px solid rgba(243,213,138,.7);border-radius:999px;padding:7px 13px;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.dk-b:active{transform:scale(.96)}
#dkSet{top:max(6px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));width:34px;height:34px;padding:0;font-size:17px;display:flex;align-items:center;justify-content:center}
#dkShare{top:max(6px,env(safe-area-inset-top));left:max(8px,env(safe-area-inset-left))}
#dkWin{bottom:max(10px,env(safe-area-inset-bottom));right:max(10px,env(safe-area-inset-right))}
.dk-ov{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(12,6,2,.62);backdrop-filter:blur(2px)}
.dk-ov[hidden],.dk-b[hidden],.dk-g button[hidden]{display:none}
.dk-p{max-width:min(520px,92vw);max-height:88vh;overflow:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(#3a2210,#22130a);border:2px solid #c9932e;border-radius:16px;box-shadow:0 0 0 1px #6b4423 inset,0 12px 40px rgba(0,0,0,.6);padding:16px 18px;color:#f6e8c8;font:500 14px/1.45 Rubik,sans-serif}
.dk-p h2{margin:0 0 10px;font:400 22px Bungee,Rubik,sans-serif;color:#f3d58a;text-align:center;text-shadow:0 2px 0 #2a1006}
.dk-p h3{margin:10px 0 2px;font:800 14px Rubik,sans-serif;color:#f3d58a}
.dk-p p{margin:0 0 4px}
.dk-g{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
.dk-g button,.dk-row button{font:800 14px Rubik,sans-serif;color:#2a1006;background:linear-gradient(#f6d37a,#c9932e);border:1.5px solid #6b4423;border-radius:10px;padding:10px 8px;cursor:pointer}
.dk-g button.ikinci,.dk-row button.ikinci{color:#f3d58a;background:rgba(40,20,8,.6);border-color:#c9932e}
.dk-g button.tehlike{color:#fff;background:linear-gradient(#c9483a,#8a2a20)}
.dk-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.dk-ver{text-align:center;opacity:.6;font-size:11px;margin-top:10px}
#dkCoach{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:15;max-width:min(460px,80vw);background:rgba(34,19,10,.92);border:2px solid #c9932e;border-radius:14px;padding:10px 14px;color:#f6e8c8;font:600 14px/1.4 Rubik,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);text-align:center}
#dkCoach.soft{pointer-events:none;bottom:auto;top:max(48px,calc(env(safe-area-inset-top) + 44px));opacity:.95}
#dkCoach button{margin-top:8px;font:800 14px Rubik,sans-serif;color:#2a1006;background:linear-gradient(#f6d37a,#c9932e);border:1.5px solid #6b4423;border-radius:10px;padding:7px 18px}
#dkCoach[hidden],#dkCoach button[hidden]{display:none}
#dkToast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:30;background:rgba(20,10,4,.9);color:#f3d58a;border:1px solid #c9932e;border-radius:10px;padding:8px 14px;font:700 14px Rubik,sans-serif}
#dkToast[hidden]{display:none}`;
  document.head.appendChild(css);

  const html = `
<button class="dk-b" id="dkSet" type="button" aria-label="Ayarlar">⚙&#xFE0E;</button>
<button class="dk-b" id="dkShare" type="button" hidden></button>
<button class="dk-b" id="dkWin" type="button" hidden></button>
<div class="dk-ov" id="dkOvSet" hidden><div class="dk-p"><h2 id="dkSetTtl"></h2>
 <div class="dk-g">
  <button id="dkResume" type="button"></button><button id="dkHome" type="button" class="ikinci"></button>
  <button id="setLang" type="button" class="ikinci"></button><button id="setMusic" type="button" class="ikinci"></button>
  <button id="setHelp" type="button" class="ikinci"></button><button id="setRate" type="button" class="ikinci"></button>
  <button id="setTam" type="button"></button><button id="setRestore" type="button" class="ikinci"></button>
  <button id="setFeed" type="button" class="ikinci"></button><button id="setErase" type="button" class="tehlike"></button>
 </div>
 <div class="dk-row"><button id="setOk" type="button"></button></div>
 <div class="dk-ver">Demir Kağnı <span id="dkVer"></span> · Bir Mr. Anduv! yapımıdır.</div>
</div></div>
<div class="dk-ov" id="dkOvHelp" hidden><div class="dk-p"><h2 id="dkHelpTtl"></h2><div id="dkHelpBody"></div>
 <div class="dk-row"><button id="hReset" type="button" class="ikinci"></button><button id="hOk" type="button"></button></div></div></div>
<div class="dk-ov" id="dkOvTam" hidden><div class="dk-p"><h2 id="dkTamTtl"></h2><p id="dkTamTxt"></p>
 <div class="dk-row"><button id="tBuy" type="button"></button></div>
 <div class="dk-row"><button id="tRestore" type="button" class="ikinci"></button><button id="tLater" type="button" class="ikinci"></button></div></div></div>
<div class="dk-ov" id="rateBox" hidden><div class="dk-p"><h2 id="dkRateTtl"></h2><p id="dkRateTxt"></p>
 <div class="dk-row"><button id="rYes" type="button"></button><button id="rIdea" type="button" class="ikinci"></button><button id="rLater" type="button" class="ikinci"></button></div></div></div>
<div id="dkCoach" hidden><div id="dkCoachTxt"></div><button id="dkCoachOk" type="button"></button></div>
<div id="dkToast" hidden></div>`;
  const wrap = document.createElement('div'); wrap.innerHTML = html; document.body.appendChild(wrap);
  const $ = id => document.getElementById(id);
  const vis = id => !$(id).hidden;
  const OVS = ['dkOvSet', 'dkOvHelp', 'dkOvTam', 'rateBox'];
  const ovOpen = () => OVS.some(vis);
  let coachOn = false, coachSoft = false, retSet = false, eraseArm = false;

  function toast(m) { const e = $('dkToast'); e.textContent = m; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => e.hidden = true, 2200); }

  /* ---------- Tam Sürüm (G70) ---------- */
  const NP = () => CAP && CAP.Plugins && CAP.Plugins.NativePurchases;
  const satisVar = () => (native && (plat === 'ios' || plat === 'android')) || !!window.__TAM_TEST;
  const tamMi = () => !satisVar() || !!save.tam;
  let tamSonra = null, tamFiyat = '';
  function tamAc() { save.tam = true; persist(); refresh(); }
  async function tamFiyatOku() { if (!NP()) return ''; try { const r = await NP().getProducts({ productIdentifiers: [TAM_URUN], productType: 'inapp' }); return (r && r.products && r.products[0] && r.products[0].priceString) || ''; } catch (e) { return ''; } }
  async function tamSatinAl() { if (!NP()) return false; try { const r = await NP().purchaseProduct({ productIdentifier: TAM_URUN, productType: 'inapp', quantity: 1 }); if (r && r.transactionId) { tamAc(); return true; } } catch (e) {} return false; }
  async function tamGeriYukle() { if (!NP()) return false; try { try { await NP().restorePurchases(); } catch (e) {} const r = await NP().getPurchases({ productType: 'inapp' }); if (((r && r.purchases) || []).some(p => p.productIdentifier === TAM_URUN)) { tamAc(); return true; } } catch (e) {} return false; }
  function tamEkrani(sonra) { tamSonra = sonra || null; refresh(); $('dkOvTam').hidden = false; tamFiyatOku().then(p => { if (p) { tamFiyat = p; refresh(); } }); }
  function tamKapat(acildi) { $('dkOvTam').hidden = true; const s = tamSonra; tamSonra = null; if (acildi && s) s(); }

  /* ---------- paylaş, puan, görüş ---------- */
  async function shareGame(extra) {
    const text = (extra ? extra + ' ' : '') + t('shareText');
    try { if (native && CAP.Plugins && CAP.Plugins.Share) { await CAP.Plugins.Share.share({ title: 'Demir Kağnı', text, url: SHARE_URL }); return; } } catch (e) {}
    try { if (navigator.share) { await navigator.share({ title: 'Demir Kağnı', text, url: SHARE_URL }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + ' ' + SHARE_URL); toast(t('copied')); } catch (e) { toast(SHARE_URL); }
  }
  const canRate = () => native && plat !== 'quest' && !!(CAP.Plugins && CAP.Plugins.InAppReview);
  function askRate() { try { CAP.Plugins.InAppReview.requestReview(); } catch (e) {} save.rated = true; persist(); }
  function feedback() {
    const adres = DESTEK.indexOf('@') > 0 ? DESTEK : '';
    const body = `Demir Kağnı ${APP_VER} · ${plat} · ${lang} · ${mi + 1}/${MISSIONS.length} · tam:${save.tam ? 1 : 0}\n\n`;
    location.href = 'mailto:' + adres + '?subject=' + encodeURIComponent('Demir Kağnı · ' + t('feed')) + '&body=' + encodeURIComponent(body);
  }

  /* ---------- rehber (ipucu kartları; kart açıkken oyun durur = ağır çekim) ---------- */
  let kontrolX = null;
  function showTip(k) { coachOn = true; coachSoft = false; $('dkCoachTxt').innerHTML = t('tips')[k]; $('dkCoachOk').hidden = false; $('dkCoach').classList.remove('soft'); $('dkCoach').dataset.k = k; $('dkCoach').hidden = false; }
  function coachHide() { $('dkCoach').hidden = true; coachOn = false; }
  const ekranda = x => cam && x > cam.x + 8 && x < cam.x + W - 8;
  function coachTick() {
    if (state !== 'play' || coachOn || ovOpen() || !P || P.dead) { if (state !== 'play' && coachSoft) { coachSoft = false; coachHide(); } return; }
    if (coachSoft) { if (P.x > kontrolX + 110) { coachSoft = false; coachHide(); markSeen('kontrol'); } return; }
    if (!seen('kontrol')) { coachSoft = true; kontrolX = P.x; $('dkCoachTxt').innerHTML = t('tips').kontrol; $('dkCoachOk').hidden = true; $('dkCoach').classList.add('soft'); $('dkCoach').hidden = false; return; }
    if (fr % 10) return;
    if (bossOn && !seen('boss')) return showTip('boss');
    if (V && !V.dead && !V.occ && !seen('arac') && ekranda(V.x)) return showTip('arac');
    if (!seen('esir') && prisoners && prisoners.some(p => !p.fr && ekranda(p.x))) return showTip('esir');
  }

  /* ---------- oyun döngüsüne kancalar ---------- */
  let kancaWin = false;
  const _update = update;
  update = function () {
    if (ovOpen() || coachOn) { for (const k of KEYS) KP[k] = 0; tap = null; gorunur(); return; }
    _update();
    coachTick();
    if (state === 'win' && !kancaWin) { kancaWin = true; if (canRate() && !save.rated && (save.rateAsked || 0) < 2) { save.rateAsked = (save.rateAsked || 0) + 1; persist(); refresh(); $('rateBox').hidden = false; } }
    if (state !== 'win') kancaWin = false;
    gorunur();
  };
  const _menuAct = menuAct;
  menuAct = function (id) {
    if (id === 'next' && !tamMi()) { btns = []; tamEkrani(() => _menuAct(id)); return; }
    return _menuAct(id);
  };
  addEventListener('keydown', e => {
    if (e.code !== 'Escape' && e.code !== 'KeyP') return;
    if (ovOpen()) { OVS.forEach(id => $(id).hidden = true); return; }
    if (state !== 'lang') ayarAc();
  });

  /* ---------- görünürlük ---------- */
  let sonDurum = '';
  function gorunur() {
    const d = state + '|' + ovOpen() + '|' + coachOn;
    if (d === sonDurum) return; sonDurum = d;
    $('dkSet').hidden = state === 'lang';
    $('dkShare').hidden = state !== 'title';
    $('dkWin').hidden = state !== 'win' || ovOpen();
  }
  function refresh() {
    const playing = state === 'play' || state === 'intro' || state === 'card';
    $('dkSetTtl').textContent = playing ? t('pause') : t('set');
    $('dkResume').textContent = t('resume'); $('dkResume').hidden = !playing;
    $('dkHome').textContent = t('home'); $('dkHome').hidden = !playing;
    $('setLang').textContent = t('lang');
    $('setMusic').textContent = t('music') + ': ' + (MUS.on ? t('on') : t('off'));
    $('setHelp').textContent = t('help');
    $('setRate').textContent = t('rate'); $('setRate').hidden = !canRate();
    $('setTam').textContent = t('tam'); $('setTam').hidden = !satisVar() || save.tam;
    $('setRestore').textContent = t('restore'); $('setRestore').hidden = !satisVar();
    $('setFeed').textContent = t('feed');
    $('setErase').textContent = eraseArm ? t('eraseSure') : t('erase');
    $('setOk').textContent = t('ok'); $('dkVer').textContent = APP_VER;
    $('dkHelpTtl').textContent = t('help'); $('dkHelpBody').innerHTML = t('helpBody');
    $('hReset').textContent = t('guideAgain'); $('hOk').textContent = t('ok');
    $('dkTamTtl').textContent = t('tamTtl'); $('dkTamTxt').textContent = t('tamTxt');
    $('tBuy').textContent = t('tamBuy') + (tamFiyat ? ' · ' + tamFiyat : '');
    $('tRestore').textContent = t('restore'); $('tLater').textContent = t('later');
    $('dkRateTtl').textContent = t('rateTtl'); $('dkRateTxt').textContent = t('rateTxt');
    $('rYes').textContent = t('rateYes'); $('rIdea').textContent = t('rateIdea'); $('rLater').textContent = t('rateLater');
    $('dkCoachOk').textContent = t('ok');
    $('dkShare').textContent = '📣 ' + t('share'); $('dkWin').textContent = '📣 ' + t('winShare');
  }
  function ayarAc() { eraseArm = false; refresh(); $('dkOvSet').hidden = false; gorunur(); }

  /* ---------- düğmeler ---------- */
  const on = (id, f) => $(id).addEventListener('click', e => { e.stopPropagation(); try { ensureAudio(); snd('sel'); } catch (er) {} f(); gorunur(); });
  for (const id of ['dkSet', 'dkShare', 'dkWin']) $(id).addEventListener('pointerdown', e => e.stopPropagation());
  on('dkSet', () => ayarAc());
  on('dkShare', () => shareGame());
  on('dkWin', () => shareGame(lang === 'tr' ? 'Görevi bitirdim!' : 'Mission complete!'));
  on('dkResume', () => { $('dkOvSet').hidden = true; });
  on('dkHome', () => { $('dkOvSet').hidden = true; coachHide(); coachSoft = false; state = 'title'; msel = 0; btns = []; });
  on('setLang', () => { lang = lang === 'tr' ? 'en' : 'tr'; try { applyLang(); HCS = {}; SIGN = null; } catch (e) {} refresh(); });
  on('setMusic', () => { toggleMusic(); refresh(); });
  on('setHelp', () => { retSet = true; $('dkOvSet').hidden = true; refresh(); $('dkOvHelp').hidden = false; });
  on('setRate', () => askRate());
  on('setTam', () => { $('dkOvSet').hidden = true; tamEkrani(null); });
  on('setRestore', async () => { const ok = await tamGeriYukle(); toast(ok ? t('tamOk') : t('tamNone')); refresh(); });
  on('setFeed', () => feedback());
  on('setErase', () => {
    if (!eraseArm) { eraseArm = true; refresh(); setTimeout(() => { eraseArm = false; refresh(); }, 4000); return; }
    try { localStorage.removeItem(KEY); } catch (e) {} location.reload();
  });
  on('setOk', () => { $('dkOvSet').hidden = true; });
  on('hReset', () => { save.rh = []; persist(); toast(t('guideReset')); });
  on('hOk', () => { $('dkOvHelp').hidden = true; if (retSet) { retSet = false; ayarAc(); } });
  on('tBuy', async () => { const ok = await tamSatinAl(); toast(ok ? t('tamOk') : t('tamFail')); if (ok) tamKapat(true); });
  on('tRestore', async () => { const ok = await tamGeriYukle(); toast(ok ? t('tamOk') : t('tamNone')); if (ok) tamKapat(true); });
  on('tLater', () => tamKapat(false));
  on('rYes', () => { askRate(); $('rateBox').hidden = true; });
  on('rIdea', () => { feedback(); $('rateBox').hidden = true; });
  on('rLater', () => { $('rateBox').hidden = true; });
  on('dkCoachOk', () => { markSeen($('dkCoach').dataset.k); coachHide(); });

  /* ---------- ekran uyanık kalsın (G75) ---------- */
  let wl = null;
  async function uyanik() { try { if (navigator.wakeLock && !wl) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => wl = null); } } catch (e) {} }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) uyanik(); });
  addEventListener('pointerdown', uyanik, { once: true, passive: true });

  window.__kabuk = { save, tamMi, showTip, ayarAc, tamEkrani, get coachOn() { return coachOn; } };
  refresh(); gorunur();
})();
