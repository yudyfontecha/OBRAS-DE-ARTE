/* ================================================
   LIZ MELLY FONTECHA — main.js
   ================================================ */

/* ── HERO ── */
const arts = ['Destello Azul', 'Flor Poderosa', 'Pura Vida'];
const nums  = ['01 / 03', '02 / 03', '03 / 03'];
let cur = 0;
function syncHero() {
  document.querySelectorAll('.hd').forEach((d,i) => d.classList.toggle('on', i===cur));
  document.getElementById('han').textContent  = arts[cur];
  document.getElementById('hnum').textContent = nums[cur];
}
setInterval(() => { cur = (cur+1)%3; syncHero(); }, 5000);

/* ── LIGHTBOX ── */
function openLB(src, cap) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-img').style.display = 'block';
  document.getElementById('lb-vid').style.display  = 'none';
  if (document.getElementById('lb-vid').pause) document.getElementById('lb-vid').pause();
  document.getElementById('lb-cap').textContent = cap || '';
  document.getElementById('lb').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function openVid(src, cap) {
  const v = document.getElementById('lb-vid');
  v.src = src; v.style.display = 'block';
  document.getElementById('lb-img').style.display = 'none';
  document.getElementById('lb-cap').textContent = cap || '';
  document.getElementById('lb').classList.add('on');
  document.body.style.overflow = 'hidden';
  v.play && v.play();
}
function closeLB() {
  const v = document.getElementById('lb-vid');
  if (v.pause) v.pause(); v.src = '';
  document.getElementById('lb').classList.remove('on');
  document.body.style.overflow = '';
}
document.getElementById('lb').addEventListener('click', e => {
  if (e.target === document.getElementById('lb')) closeLB();
});

/* ── IDIOMA ── */
let lang = 'es';
function togLang() {
  const d = document.getElementById('ld'), a = document.getElementById('la');
  d.classList.toggle('on'); a.classList.toggle('on');
  if (d.classList.contains('on'))
    setTimeout(() => document.addEventListener('click', closeLO, {once:true}), 50);
}
function closeLO(e) {
  if (!document.getElementById('lw').contains(e.target)) {
    document.getElementById('ld').classList.remove('on');
    document.getElementById('la').classList.remove('on');
  }
}
function setL(l) {
  lang = l;
  document.getElementById('ll').textContent = l==='es' ? '🇨🇴 ES' : '🇺🇸 EN';
  document.getElementById('ld').classList.remove('on');
  document.getElementById('la').classList.remove('on');
  document.getElementById('oes').classList.toggle('on', l==='es');
  document.getElementById('oen').classList.toggle('on', l==='en');
  document.documentElement.lang = l;
  document.querySelectorAll('[data-'+l+']').forEach(el => {
    const v = el.getAttribute('data-'+l);
    if (el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder = v;
    else el.innerHTML = v;
  });
}

/* ── CARRITO DROPDOWN ── */
let cart = [];

const artImg = {
  'Destello Azul':           'images/obra-destello-azul.jpg',
  'Flor Poderosa':           'images/obra-flor-poderosa.jpg',
  'Instinto en Calma':       'images/obra-instinto-en-calma.jpg',
  'El secreto de tu mirada': 'images/obra-secreto-mirada.jpg',
  'El amor es conexión':     'images/obra-amor-conexion.jpg',
  'Pura Vida':               'images/obra-pura-vida.jpg',
  'Presencia':               'images/obra-amor-conexion.jpg',
};
function getThumb(name) {
  for (const key in artImg)
    if (name.toLowerCase().includes(key.toLowerCase())) return artImg[key];
  return 'images/logo-signature.png';
}

function addC(name, price) {
  cart.push({ name, price });
  document.getElementById('cc').textContent = cart.length;
  openCart();
  renderCart();
}

function renderCart() {
  const items  = document.getElementById('cdItems');
  const footer = document.getElementById('cdFooter');
  if (!cart.length) {
    items.innerHTML = `<div class="cd-empty">${lang==='es'?'El carrito está vacío':'Cart is empty'}</div>`;
    footer.style.display = 'none';
    return;
  }
  items.innerHTML = cart.map((item, idx) => `
    <div class="cd-item">
      <div class="cd-ithumb"><img src="${getThumb(item.name)}" alt="${item.name}"/></div>
      <span class="cd-itname">${item.name}</span>
      <span class="cd-itprice">$${item.price}</span>
      <button class="cd-itrm" onclick="rmC(${idx})">×</button>
    </div>`).join('');
  document.getElementById('cdTotal').textContent = '$' + cart.reduce((s,i)=>s+i.price, 0);
  footer.style.display = 'block';
}

function rmC(i) {
  cart.splice(i, 1);
  document.getElementById('cc').textContent = cart.length;
  renderCart();
}

function clearC() {
  cart = [];
  document.getElementById('cc').textContent = 0;
  renderCart();
}

function openCart() {
  document.getElementById('cartDrop').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  renderCart();
}

function closeCart() {
  document.getElementById('cartDrop').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function togCart() {
  if (document.getElementById('cartDrop').classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

function sendWA() {
  if (!cart.length) {
    alert(lang==='es' ? 'Agrega al menos una obra al carrito.' : 'Add at least one item.');
    return;
  }
  const lines = cart.map(i=>`• ${i.name}: $${i.price}`).join('\n');
  const total = cart.reduce((s,i)=>s+i.price, 0);
  const msg = lang==='es'
    ? `Hola Liz Melly! Me interesa comprar:\n\n${lines}\n\nTotal: $${total}\n\n¿Cómo coordinamos el pago?`
    : `Hi Liz Melly! I'd like to buy:\n\n${lines}\n\nTotal: $${total}\n\nHow do we proceed?`;
  window.open(`https://wa.me/19093297810?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── TABS ── */
function showT(id, btn) {
  document.querySelectorAll('.tpane').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.vtab').forEach(t => t.classList.remove('on'));
  document.getElementById('tp-'+id).classList.add('on');
  btn.classList.add('on');
}

/* ── CONTACTO → WHATSAPP ── */
function sendCon() {
  const n = document.getElementById('fn').value.trim();
  const e = document.getElementById('fe').value.trim();
  const m = document.getElementById('fm').value.trim();
  if (!n || !m) {
    alert(lang==='es' ? 'Por favor completa nombre y mensaje.' : 'Please fill in name and message.');
    return;
  }
  const msg = lang==='es'
    ? `Hola Liz Melly!\n\nNombre: ${n}\nCorreo: ${e||'(no indicado)'}\n\nMensaje:\n${m}`
    : `Hi Liz Melly!\n\nName: ${n}\nEmail: ${e||'(not provided)'}\n\nMessage:\n${m}`;
  window.open(`https://wa.me/19093297810?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ── ADMIN ── */
function openAd() { document.getElementById('adov').classList.add('on'); document.body.style.overflow='hidden'; }
function closeAd() { document.getElementById('adov').classList.remove('on'); document.body.style.overflow=''; }
function doLogin() {
  if (document.getElementById('adpw').value==='lizmelly2025') {
    document.getElementById('adlk').style.display='none';
    document.getElementById('adpn').style.display='block';
  } else {
    document.getElementById('ader').textContent = lang==='es' ? 'Contraseña incorrecta.' : 'Incorrect password.';
  }
}
function lockAd() {
  document.getElementById('adlk').style.display='block';
  document.getElementById('adpn').style.display='none';
  document.getElementById('adpw').value='';
  document.getElementById('ader').textContent='';
}
function upFile(btn) {
  const input = document.createElement('input');
  input.type='file'; input.accept='image/*';
  input.onchange = e => {
    const f = e.target.files[0];
    if (f) alert(`Imagen para "${btn.previousElementSibling.previousElementSibling.textContent}": ${f.name}\nSube el archivo a la carpeta images/ del repositorio en GitHub.`);
  };
  input.click();
}
document.getElementById('adpw')?.addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

/* ── ANIMACIONES AL SCROLL ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('v'); });
}, {threshold:0.1});
document.querySelectorAll('.fu').forEach(el => obs.observe(el));
