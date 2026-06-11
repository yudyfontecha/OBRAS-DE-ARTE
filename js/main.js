/* ================================================
   LIZ MELLY FONTECHA — main.js
   Fontana, California
   ================================================ */

/* ── FIREBASE ── */
let db;
try {
  const firebaseConfig = {
    apiKey: "AIzaSyCtzBABHqZHqR_cndsJj22pREyorQ_qJXU",
    authDomain: "liz-melly-arte-f8650.firebaseapp.com",
    projectId: "liz-melly-arte-f8650",
    storageBucket: "liz-melly-arte-f8650.appspot.com",
    messagingSenderId: "678962654760",
    appId: "1:678962654760:web:299079577d651893398f1d"
  };
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.firestore();
} catch(e) {
  console.warn('Firebase no disponible:', e.message);
}

/* ── HERO ── */
const arts = ['Destello Azul','Flor Poderosa','Pura Vida'];
const nums  = ['01 / 03','02 / 03','03 / 03'];
let cur = 0;
function syncHero(){
  document.querySelectorAll('.hd').forEach((d,i)=>d.classList.toggle('on',i===cur));
  document.getElementById('han').textContent  = arts[cur];
  document.getElementById('hnum').textContent = nums[cur];
}
setInterval(()=>{ cur=(cur+1)%3; syncHero(); }, 5000);

/* ── LIGHTBOX ── */
function openLB(src,cap){
  document.getElementById('lb-img').src=src;
  document.getElementById('lb-img').style.display='block';
  document.getElementById('lb-vid').style.display='none';
  const v=document.getElementById('lb-vid');
  if(v.pause) v.pause();
  document.getElementById('lb-cap').textContent=cap||'';
  document.getElementById('lb').classList.add('on');
  document.body.style.overflow='hidden';
}
function openVid(src,cap){
  const v=document.getElementById('lb-vid');
  v.src=src; v.style.display='block';
  document.getElementById('lb-img').style.display='none';
  document.getElementById('lb-cap').textContent=cap||'';
  document.getElementById('lb').classList.add('on');
  document.body.style.overflow='hidden';
  v.play&&v.play();
}
function closeLB(){
  const v=document.getElementById('lb-vid');
  if(v.pause) v.pause(); v.src='';
  document.getElementById('lb').classList.remove('on');
  document.body.style.overflow='';
}
document.getElementById('lb').addEventListener('click',e=>{
  if(e.target===document.getElementById('lb')) closeLB();
});

/* ── IDIOMA ── */
let lang='es';
function togLang(){
  const d=document.getElementById('ld'),a=document.getElementById('la');
  d.classList.toggle('on'); a.classList.toggle('on');
  if(d.classList.contains('on'))
    setTimeout(()=>document.addEventListener('click',closeLO,{once:true}),50);
}
function closeLO(e){
  if(!document.getElementById('lw').contains(e.target)){
    document.getElementById('ld').classList.remove('on');
    document.getElementById('la').classList.remove('on');
  }
}
function setL(l){
  lang=l;
  document.getElementById('ll').textContent=l==='es'?'🇨🇴 ES':'🇺🇸 EN';
  document.getElementById('ld').classList.remove('on');
  document.getElementById('la').classList.remove('on');
  document.getElementById('oes').classList.toggle('on',l==='es');
  document.getElementById('oen').classList.toggle('on',l==='en');
  document.documentElement.lang=l;
  document.querySelectorAll('[data-'+l+']').forEach(el=>{
    const v=el.getAttribute('data-'+l);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=v;
    else el.innerHTML=v;
  });
}

/* ── CARRITO DROPDOWN ── */
let cart=[];
const artImg={
  'Destello Azul':'images/obra-destello-azul.jpg',
  'Flor Poderosa':'images/obra-flor-poderosa.jpg',
  'Instinto en Calma':'images/obra-instinto-en-calma.jpg',
  'El secreto de tu mirada':'images/obra-secreto-mirada.jpg',
  'El amor es conexión':'images/obra-amor-conexion.jpg',
  'Pura Vida':'images/obra-pura-vida.jpg',
  'Presencia':'images/obra-amor-conexion.jpg',
};
function getThumb(name){
  for(const key in artImg)
    if(name.toLowerCase().includes(key.toLowerCase())) return artImg[key];
  return 'images/logo-signature.png';
}
function addC(name,price){
  cart.push({name,price});
  document.getElementById('cc').textContent=cart.length;
  openCart(); renderCart();
}
function renderCart(){
  const items=document.getElementById('cdItems');
  const footer=document.getElementById('cdFooter');
  if(!cart.length){
    items.innerHTML=`<div class="cd-empty">${lang==='es'?'El carrito está vacío':'Cart is empty'}</div>`;
    footer.style.display='none'; return;
  }
  items.innerHTML=cart.map((item,idx)=>`
    <div class="cd-item">
      <div class="cd-ithumb"><img src="${getThumb(item.name)}" alt="${item.name}"/></div>
      <span class="cd-itname">${item.name}</span>
      <span class="cd-itprice">$${item.price}</span>
      <button class="cd-itrm" onclick="rmC(${idx})">×</button>
    </div>`).join('');
  document.getElementById('cdTotal').textContent='$'+cart.reduce((s,i)=>s+i.price,0);
  footer.style.display='block';
}
function rmC(i){ cart.splice(i,1); document.getElementById('cc').textContent=cart.length; renderCart(); }
function clearC(){ cart=[]; document.getElementById('cc').textContent=0; renderCart(); }
function openCart(){ document.getElementById('cartDrop').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); renderCart(); }
function closeCart(){ document.getElementById('cartDrop').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
function togCart(){ document.getElementById('cartDrop').classList.contains('open')?closeCart():openCart(); }
function sendWA(){
  if(!cart.length){ alert(lang==='es'?'Agrega al menos una obra.':'Add at least one item.'); return; }
  const lines=cart.map(i=>`• ${i.name}: $${i.price}`).join('\n');
  const total=cart.reduce((s,i)=>s+i.price,0);
  const msg=lang==='es'
    ?`Hola Liz Melly! Me interesa comprar:\n\n${lines}\n\nTotal: $${total}\n\n¿Cómo coordinamos el pago?`
    :`Hi Liz Melly! I'd like to buy:\n\n${lines}\n\nTotal: $${total}\n\nHow do we proceed?`;
  window.open(`https://wa.me/19093297810?text=${encodeURIComponent(msg)}`,'_blank');
}

/* ── TABS ── */
function showT(id,btn){
  document.querySelectorAll('.tpane').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.vtab').forEach(t=>t.classList.remove('on'));
  document.getElementById('tp-'+id).classList.add('on');
  btn.classList.add('on');
}

/* ── CONTACTO ── */
function sendCon(){
  const n=document.getElementById('fn').value.trim();
  const e=document.getElementById('fe').value.trim();
  const m=document.getElementById('fm').value.trim();
  if(!n||!m){ alert(lang==='es'?'Completa nombre y mensaje.':'Fill in name and message.'); return; }
  const msg=lang==='es'
    ?`Hola Liz Melly!\n\nNombre: ${n}\nCorreo: ${e||'(no indicado)'}\n\nMensaje:\n${m}`
    :`Hi Liz Melly!\n\nName: ${n}\nEmail: ${e||'(not provided)'}\n\nMessage:\n${m}`;
  window.open(`https://wa.me/19093297810?text=${encodeURIComponent(msg)}`,'_blank');
}

/* ── ADMIN ── */
function openAd(){
  document.getElementById('adov').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeAd(){
  document.getElementById('adov').classList.remove('on');
  document.body.style.overflow='';
}
function doLogin(){
  if(document.getElementById('adpw').value==='lizmelly2025'){
    document.getElementById('adlk').style.display='none';
    document.getElementById('adpn').style.display='block';
  } else {
    document.getElementById('ader').textContent=lang==='es'?'Contraseña incorrecta.':'Incorrect password.';
  }
}
function lockAd(){
  document.getElementById('adlk').style.display='block';
  document.getElementById('adpn').style.display='none';
  document.getElementById('adpw').value='';
  document.getElementById('ader').textContent='';
}
document.getElementById('adpw').addEventListener('keydown',e=>{ if(e.key==='Enter') doLogin(); });

/* ══════════════════════════════════════════════════
   ADMIN + FIREBASE — Capa de gestión (v2026-06)
   Estados, fotos, obras nuevas, personalizados, videos
   ══════════════════════════════════════════════════ */

const ESTADO_TXT = {
  'Disponible': { es:'Disponible', en:'Available' },
  'Vendida':    { es:'Vendida',    en:'Sold' },
  'Reservada':  { es:'Reservada',  en:'Reserved' }
};
const ESTADO_DOT = { 'Disponible':'sdg', 'Vendida':'sdr', 'Reservada':'sdy' };

/* Registro de las 6 obras: nombre exacto + precio (para reconstruir el hover de la galería) */
const OBRAS = {
  'Destello Azul':            { precio:200, estado:'Disponible', oculta:false },
  'Flor Poderosa':            { precio:250, estado:'Disponible', oculta:false },
  'Instinto en Calma':        { precio:180, estado:'Disponible', oculta:false },
  'El secreto de tu mirada':  { precio:130, estado:'Disponible', oculta:false },
  'El amor es conexión':      { precio:100, estado:'Disponible', oculta:false },
  'Pura Vida':                { precio:200, estado:'Disponible', oculta:false }
};
const NUEVAS = {}; // obras nuevas en memoria: id → datos

function tEstado(estado){ return (ESTADO_TXT[estado]||ESTADO_TXT['Disponible'])[lang]; }

/* ── Aplica un estado en TODA la página: galería, tienda y admin ── */
function aplicarEstadoUI(nombre, estado){
  if(!OBRAS[nombre]) return;
  OBRAS[nombre].estado = estado;
  const et = ESTADO_TXT[estado] || ESTADO_TXT['Disponible'];
  const precio = OBRAS[nombre].precio;

  /* 1. Galería */
  document.querySelectorAll('.am .ac').forEach(card=>{
    const n = card.querySelector('.acn');
    if(!n || n.textContent.trim()!==nombre) return;
    // Punto de color
    const dot = card.querySelector('.acs .sd');
    if(dot) dot.className = 'sd ' + (ESTADO_DOT[estado]||'sdg');
    // Texto de estado (primera palabra antes del ·)
    const txt = card.querySelector('.acs span:last-child');
    if(txt){
      const es0 = txt.getAttribute('data-es')||txt.textContent;
      const en0 = txt.getAttribute('data-en')||txt.textContent;
      const restoEs = es0.includes('·') ? es0.substring(es0.indexOf('·')) : '';
      const restoEn = en0.includes('·') ? en0.substring(en0.indexOf('·')) : '';
      txt.setAttribute('data-es', et.es+' '+restoEs);
      txt.setAttribute('data-en', et.en+' '+restoEn);
      txt.textContent = (lang==='es'?et.es+' '+restoEs:et.en+' '+restoEn);
    }
    // Hover + clic
    const hov = card.querySelector('.achov');
    if(estado==='Disponible'){
      if(hov) hov.innerHTML = `<div class="ahlb" data-es="Precio original" data-en="Original price">${lang==='es'?'Precio original':'Original price'}</div><div class="ahp">$${precio}</div><button class="ahct">+ Carrito</button>`;
      card.onclick = ()=>addC(nombre+' (original)', precio);
    } else {
      if(hov) hov.innerHTML = `<div class="ahlb" data-es="Estado" data-en="Status">${lang==='es'?'Estado':'Status'}</div><div class="ahp" style="font-size:22px" data-es="${et.es}" data-en="${et.en}">${lang==='es'?et.es:et.en}</div>`;
      const img = card.querySelector('.acb img');
      card.onclick = ()=>openLB(img?img.src:'', nombre);
    }
  });

  /* 2. Tienda (Originales) */
  document.querySelectorAll('#tp-ori .sk').forEach(sk=>{
    const n = sk.querySelector('.sn');
    if(!n || !n.textContent.trim().toLowerCase().includes(nombre.toLowerCase().split(' (')[0].toLowerCase())) return;
    // coincidencia estricta: el nombre de la obra debe estar contenido
    if(!n.textContent.trim().toLowerCase().startsWith(nombre.toLowerCase().substring(0,10))) return;
    const pr = sk.querySelector('.spr');
    if(pr) pr.textContent = '$'+precio;
    const btn = sk.querySelector('.sadd');
    if(!btn) return;
    if(estado==='Disponible'){
      btn.disabled = false;
      btn.classList.remove('soff');
      btn.setAttribute('data-es','+ Agregar al carrito');
      btn.setAttribute('data-en','+ Add to cart');
      btn.textContent = lang==='es'?'+ Agregar al carrito':'+ Add to cart';
      btn.onclick = ()=>addC(nombre+' (original)', precio);
    } else {
      btn.disabled = true;
      btn.classList.add('soff');
      btn.setAttribute('data-es', et.es);
      btn.setAttribute('data-en', et.en);
      btn.textContent = lang==='es'?et.es:et.en;
      btn.onclick = null;
    }
  });

  /* 3. Select y precio del admin */
  document.querySelectorAll('#adpn .adm-o').forEach(card=>{
    const n = card.querySelector('.adm-on');
    if(n && n.textContent.trim()===nombre){
      const sel = card.querySelector('.adm-sl');
      if(sel) sel.value = estado;
      const pr = card.querySelector('.adm-pr');
      if(pr) pr.value = precio;
    }
  });
}

/* ── Ocultar / mostrar una obra fija en galería y tienda ── */
function aplicarOcultaUI(nombre, oculta){
  if(!OBRAS[nombre]) return;
  OBRAS[nombre].oculta = !!oculta;
  document.querySelectorAll('.am .ac').forEach(card=>{
    const n = card.querySelector('.acn');
    if(n && n.textContent.trim()===nombre) card.style.display = oculta?'none':'';
  });
  document.querySelectorAll('#tp-ori .sk').forEach(sk=>{
    const n = sk.querySelector('.sn');
    if(n && n.textContent.trim().toLowerCase().startsWith(nombre.toLowerCase().substring(0,10))) sk.style.display = oculta?'none':'';
  });
  // Botón del admin refleja el estado
  document.querySelectorAll('#adpn .adm-o').forEach(card=>{
    const n = card.querySelector('.adm-on');
    if(n && n.textContent.trim()===nombre){
      const b = card.querySelector('.adm-oc');
      if(b){
        b.textContent = oculta ? '👁 Mostrar en la página' : 'Ocultar de la página';
        b.classList.toggle('on', !!oculta);
      }
    }
  });
}

async function toggleOcultar(btn){
  const nombre = btn.closest('.adm-o').querySelector('.adm-on').textContent.trim();
  if(!OBRAS[nombre]) return;
  const oculta = !OBRAS[nombre].oculta;
  if(oculta && !confirm('¿Ocultar "'+nombre+'" de la galería y la tienda? Podrá volver a mostrarla cuando quiera. Los prints de esta obra seguirán a la venta.')) return;
  try{
    if(db) await db.collection('obras').doc(nombre).set({ nombre, oculta }, { merge:true });
    aplicarOcultaUI(nombre, oculta);
  } catch(e){ alert('Error: '+e.message); }
}

/* ── Aplica una foto nueva (URL de Cloudinary) a todas las imágenes de esa obra ── */
function aplicarFotoUI(nombre, url){
  if(!url) return;
  document.querySelectorAll('img[alt]').forEach(img=>{
    if(img.alt.trim().toLowerCase()===nombre.trim().toLowerCase()) img.src = url;
  });
  // Galería y tienda usan alt exacto; lightbox onclick de tienda
  document.querySelectorAll('#tp-ori .sk').forEach(sk=>{
    const n = sk.querySelector('.sn');
    if(n && n.textContent.trim().toLowerCase().startsWith(nombre.toLowerCase().substring(0,10))){
      const img = sk.querySelector('.ski img'); if(img) img.src = url;
      const ski = sk.querySelector('.ski'); if(ski) ski.onclick = ()=>openLB(url, nombre);
    }
  });
}

/* ── GUARDAR CAMBIOS (estados de las 6 obras + obras nuevas) ── */
async function guardarCambios(btn){
  if(!db){ alert('Sin conexión a la base de datos. Revise su internet y recargue la página.'); return; }
  const original = btn.textContent;
  btn.textContent = 'Guardando...'; btn.disabled = true;
  try{
    // Obras fijas
    const cards = document.querySelectorAll('#adpn .adm-gr .adm-o');
    for(const card of cards){
      const nombre = card.querySelector('.adm-on').textContent.trim();
      const estado = card.querySelector('.adm-sl').value;
      const prIn = card.querySelector('.adm-pr');
      const precio = prIn && prIn.value!=='' ? Number(prIn.value) : OBRAS[nombre]?.precio;
      if(OBRAS[nombre] && precio>=0) OBRAS[nombre].precio = precio;
      await db.collection('obras').doc(nombre).set({ nombre, estado, precio }, { merge:true });
      aplicarEstadoUI(nombre, estado);
    }
    // Obras nuevas: estado + precio editables
    const nuevas = document.querySelectorAll('#admNuevas .adm-o[data-id]');
    for(const card of nuevas){
      const id = card.getAttribute('data-id');
      const estado = card.querySelector('.adm-sl').value;
      const prIn = card.querySelector('.adm-pr');
      const precio = prIn && prIn.value!=='' ? Number(prIn.value) : (NUEVAS[id]?.precio||0);
      await db.collection('obras_nuevas').doc(id).set({ estado, precio }, { merge:true });
      if(NUEVAS[id]){ NUEVAS[id].estado=estado; NUEVAS[id].precio=precio; aplicarNuevaUI(id); }
    }
    btn.textContent = '✅ Guardado';
    setTimeout(()=>{ btn.textContent = original; btn.disabled = false; }, 2500);
  } catch(e){
    btn.textContent = original; btn.disabled = false;
    if(e.code==='permission-denied'){
      alert('Firebase rechazó el cambio: las reglas de la base de datos expiraron. Hay que actualizarlas en la consola de Firebase (Firestore → Reglas).');
    } else {
      alert('Error al guardar: '+e.message);
    }
  }
}

/* ── Selector de archivos robusto (funciona en celular y todos los navegadores) ── */
function pickFile(accept, multiple, callback){
  const input = document.createElement('input');
  input.type = 'file'; input.accept = accept;
  if(multiple) input.multiple = true;
  input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(input);
  input.addEventListener('change', e=>{
    callback(e.target.files);
    setTimeout(()=>input.remove(), 1000);
  });
  input.click();
}

async function subirACloudinary(file, tipo, folder){
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', 'lizmelly_arte');
  if(folder) fd.append('folder', folder);
  const res = await fetch('https://api.cloudinary.com/v1_1/dpdrjdv4n/'+(tipo||'image')+'/upload', { method:'POST', body:fd });
  const data = await res.json();
  if(data.error) throw new Error(data.error.message);
  return data.secure_url;
}

/* ── SUBIR / CAMBIAR FOTO de una obra existente ── */
function subirFotoAdmin(btn, nombreObra){
  nombreObra = nombreObra.trim();
  pickFile('image/*', false, async(files)=>{
    const file = files[0];
    if(!file) return;
    const original = btn.textContent;
    btn.textContent = 'Subiendo...'; btn.disabled = true;
    try{
      const url = await subirACloudinary(file, 'image');
      if(db) await db.collection('obras').doc(nombreObra).set({ nombre:nombreObra, fotoUrl:url }, { merge:true });
      aplicarFotoUI(nombreObra, url);
      btn.textContent = '✅ Foto actualizada';
      setTimeout(()=>{ btn.textContent = original; btn.disabled = false; }, 3000);
    } catch(err){
      btn.textContent = original; btn.disabled = false;
      alert('Error al subir la foto: '+err.message);
    }
  });
}

/* ── NUEVA OBRA ── */
function nuevaObraAdmin(){
  const modal = document.createElement('div');
  modal.id = 'noModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:4px;padding:28px;width:100%;max-width:480px;font-family:var(--fn)">
      <h3 style="font-family:var(--fd);font-style:italic;color:var(--b);font-size:22px;margin-bottom:20px">Nueva obra</h3>
      <label style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);display:block;margin-bottom:4px">Foto de la obra *</label>
      <input id="no-foto" type="file" accept="image/*" style="width:100%;margin-bottom:14px;font-size:13px"/>
      <label style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);display:block;margin-bottom:4px">Nombre de la obra *</label>
      <input id="no-nombre" type="text" placeholder="Ej: Amanecer" style="width:100%;padding:10px 12px;border:1px solid rgba(110,31,43,.2);font-size:14px;margin-bottom:12px;border-radius:1px;font-family:var(--fn)"/>
      <label style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);display:block;margin-bottom:4px">Técnica</label>
      <input id="no-tecnica" type="text" placeholder="Ej: Acrílico sobre lienzo" style="width:100%;padding:10px 12px;border:1px solid rgba(110,31,43,.2);font-size:14px;margin-bottom:12px;border-radius:1px;font-family:var(--fn)"/>
      <label style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);display:block;margin-bottom:4px">Tamaño</label>
      <input id="no-tamano" type="text" placeholder='Ej: 20"×24"' style="width:100%;padding:10px 12px;border:1px solid rgba(110,31,43,.2);font-size:14px;margin-bottom:12px;border-radius:1px;font-family:var(--fn)"/>
      <label style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);display:block;margin-bottom:4px">Precio ($) *</label>
      <input id="no-precio" type="number" placeholder="Ej: 200" style="width:100%;padding:10px 12px;border:1px solid rgba(110,31,43,.2);font-size:14px;margin-bottom:20px;border-radius:1px;font-family:var(--fn)"/>
      <div style="display:flex;gap:10px">
        <button id="no-guardar" onclick="guardarNuevaObra(this)" style="flex:1;background:var(--b);color:#fff;padding:11px;font-family:var(--fn);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;border:none;border-radius:1px;cursor:pointer">Guardar obra</button>
        <button onclick="document.getElementById('noModal').remove()" style="flex:1;background:transparent;color:var(--b);padding:11px;font-family:var(--fn);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;border:1px solid rgba(110,31,43,.2);border-radius:1px;cursor:pointer">Cancelar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function guardarNuevaObra(btn){
  const nombre  = document.getElementById('no-nombre').value.trim();
  const tecnica = document.getElementById('no-tecnica').value.trim();
  const tamano  = document.getElementById('no-tamano').value.trim();
  const precio  = document.getElementById('no-precio').value;
  const foto    = document.getElementById('no-foto').files[0];
  if(!nombre || !precio || !foto){ alert('La foto, el nombre y el precio son obligatorios.'); return; }
  if(!db){ alert('Sin conexión a la base de datos. Revise su internet.'); return; }
  btn.textContent = 'Subiendo...'; btn.disabled = true;
  try{
    const fotoUrl = await subirACloudinary(foto, 'image');
    const datos = { nombre, tecnica, tamano, precio:Number(precio), fotoUrl, estado:'Disponible', fecha:new Date().toISOString() };
    const ref = await db.collection('obras_nuevas').add(datos);
    renderObraNueva(ref.id, datos);
    document.getElementById('noModal').remove();
    alert('✅ Obra "'+nombre+'" agregada. Ya aparece en la tienda.');
  } catch(e){
    btn.textContent = 'Guardar obra'; btn.disabled = false;
    alert('Error: '+e.message);
  }
}

/* Refleja estado y precio de una obra nueva en su tarjeta de tienda */
function aplicarNuevaUI(id){
  const d = NUEVAS[id]; if(!d) return;
  const sk = document.getElementById('sk-'+id); if(!sk) return;
  const pr = sk.querySelector('.spr'); if(pr) pr.textContent = '$'+d.precio;
  const btn = sk.querySelector('.sadd');
  if(btn){
    const dispo = d.estado==='Disponible';
    btn.disabled = !dispo;
    btn.classList.toggle('soff', !dispo);
    btn.textContent = dispo ? (lang==='es'?'+ Agregar al carrito':'+ Add to cart') : tEstado(d.estado);
    btn.onclick = dispo ? ()=>addC(d.nombre+' (original)', d.precio) : null;
  }
}

/* Pinta una obra nueva en la tienda + en el panel admin */
function renderObraNueva(id, d){
  NUEVAS[id] = d;
  // Tienda → tab Originales
  const grid = document.querySelector('#tp-ori .sgr');
  if(grid && !document.getElementById('sk-'+id)){
    const card = document.createElement('div');
    card.className = 'sk'; card.id = 'sk-'+id;
    const dispo = d.estado==='Disponible';
    card.innerHTML = `
      <div class="ski" style="cursor:pointer"><img src="${d.fotoUrl}" alt="${d.nombre}" style="object-position:center"/></div>
      <div class="si">
        <div class="sn">${d.nombre}</div>
        <div class="ssz">${[d.tamano,d.tecnica].filter(Boolean).join(' · ')}</div>
        <div class="spr">$${d.precio}</div>
        <button class="sadd${dispo?'':' soff'}" ${dispo?'':'disabled'}>${dispo?(lang==='es'?'+ Agregar al carrito':'+ Add to cart'):tEstado(d.estado)}</button>
      </div>`;
    card.querySelector('.ski').onclick = ()=>openLB(d.fotoUrl, d.nombre);
    if(dispo) card.querySelector('.sadd').onclick = ()=>addC(d.nombre+' (original)', d.precio);
    grid.appendChild(card);
    artImg[d.nombre] = d.fotoUrl; // thumbnail en el carrito
  }
  // Admin
  const adm = document.getElementById('admNuevas');
  if(adm && !document.getElementById('adm-'+id)){
    if(!adm.querySelector('.adm-nt')){
      const t = document.createElement('div');
      t.className = 'adm-nt';
      t.style.cssText = 'font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--b);margin:18px 0 10px;opacity:.7';
      t.textContent = 'Obras nuevas';
      adm.appendChild(t);
    }
    const row = document.createElement('div');
    row.className = 'adm-o'; row.id = 'adm-'+id;
    row.setAttribute('data-id', id);
    row.innerHTML = `
      <div class="adm-on">${d.nombre}</div>
      <select class="adm-sl">
        <option value="Disponible"${d.estado==='Disponible'?' selected':''}>Disponible</option>
        <option value="Vendida"${d.estado==='Vendida'?' selected':''}>Vendida</option>
        <option value="Reservada"${d.estado==='Reservada'?' selected':''}>Reservada</option>
      </select>
      <div class="adm-prw"><span class="adm-prl">Precio $</span><input class="adm-pr" type="number" value="${d.precio}" min="0"/></div>
      <button class="adm-up" onclick="eliminarObraNueva('${id}','${d.nombre.replace(/'/g,"\\'")}')" style="background:transparent;color:var(--b);border:1px solid rgba(110,31,43,.25)">Eliminar obra</button>`;
    adm.appendChild(row);
  }
}

async function eliminarObraNueva(id, nombre){
  if(!confirm('¿Eliminar la obra "'+nombre+'"? Esta acción no se puede deshacer.')) return;
  try{
    if(db) await db.collection('obras_nuevas').doc(id).delete();
    document.getElementById('sk-'+id)?.remove();
    document.getElementById('adm-'+id)?.remove();
    delete NUEVAS[id];
  } catch(e){ alert('Error al eliminar: '+e.message); }
}

/* ── SUBIR PERSONALIZADOS (se muestran en la sección Personalizados) ── */
function subirPersonalizados(){
  pickFile('image/*', true, async(fileList)=>{
    const files = Array.from(fileList);
    if(!files.length) return;
    let ok = 0;
    for(const file of files){
      try{
        const url = await subirACloudinary(file, 'image', 'personalizados');
        const ref = await db.collection('personalizados').add({ url, nombre:file.name, fecha:new Date().toISOString() });
        renderPersonalizado(ref.id, url);
        ok++;
      } catch(err){ console.error(err); }
    }
    alert(ok ? '✅ '+ok+' foto(s) agregada(s) a Personalizados.' : 'No se pudo subir. Revise su internet.');
  });
}

function renderPersonalizado(id, url){
  const grid = document.querySelector('.pgr');
  if(!grid || document.getElementById('pz-'+id)) return;
  const base = grid.querySelector(':scope > *');
  const card = document.createElement(base ? base.tagName : 'div');
  if(base) card.className = base.className;
  card.id = 'pz-'+id;
  card.style.cursor = 'pointer';
  card.innerHTML = `<img src="${url}" alt="Personalizado" style="width:100%;height:100%;object-fit:cover;display:block"/>`;
  card.onclick = ()=>openLB(url, lang==='es'?'Personalizado':'Commission');
  card.classList.add('v');
  grid.appendChild(card);
}

/* ── SUBIR VIDEOS (se muestran en Proyectos Especiales) ── */
function subirVideos(){
  pickFile('video/*', true, async(fileList)=>{
    const files = Array.from(fileList);
    if(!files.length) return;
    alert('Subiendo '+files.length+' video(s)... No cierre la página. Esto puede tomar varios minutos.');
    let ok = 0;
    for(const file of files){
      try{
        const url = await subirACloudinary(file, 'video', 'videos');
        const ref = await db.collection('videos').add({ url, nombre:file.name, fecha:new Date().toISOString() });
        renderVideoNuevo(ref.id, url, file.name);
        ok++;
      } catch(err){ console.error(err); }
    }
    alert(ok ? '✅ '+ok+' video(s) agregado(s) a Proyectos Especiales.' : 'No se pudo subir. Revise su internet.');
  });
}

function renderVideoNuevo(id, url, nombre){
  const grid = document.querySelector('.vgr');
  if(!grid || document.getElementById('vz-'+id)) return;
  const titulo = (nombre||'Video').replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');
  const card = document.createElement('div');
  card.className = 'vc v'; card.id = 'vz-'+id;
  card.innerHTML = `
    <div class="vth"><video src="${url}#t=0.5" preload="metadata" muted playsinline style="width:100%;height:100%;object-fit:cover;display:block"></video><div class="vplay"><div class="vplaybtn">▶</div></div></div>
    <div class="vmeta"><div class="vmn">${titulo}</div><div class="vmd">video</div></div>`;
  card.onclick = ()=>openVid(url, titulo);
  grid.appendChild(card);
}

/* ── CARGA INICIAL DESDE FIREBASE ── */
async function cargarDesdeFirebase(){
  if(!db) return;
  try{
    // Estados y fotos de las 6 obras
    const snap = await db.collection('obras').get();
    snap.forEach(doc=>{
      const d = doc.data();
      if(OBRAS[doc.id] && typeof d.precio==='number') OBRAS[doc.id].precio = d.precio;
      aplicarEstadoUI(doc.id, d.estado || OBRAS[doc.id]?.estado || 'Disponible');
      if(d.fotoUrl) aplicarFotoUI(doc.id, d.fotoUrl);
      if(typeof d.oculta==='boolean') aplicarOcultaUI(doc.id, d.oculta);
    });
    // Obras nuevas
    const nuevas = await db.collection('obras_nuevas').orderBy('fecha').get().catch(()=>db.collection('obras_nuevas').get());
    nuevas.forEach(doc=>renderObraNueva(doc.id, doc.data()));
    // Personalizados
    const pers = await db.collection('personalizados').orderBy('fecha').get().catch(()=>db.collection('personalizados').get());
    pers.forEach(doc=>renderPersonalizado(doc.id, doc.data().url));
    // Videos
    const vids = await db.collection('videos').orderBy('fecha').get().catch(()=>db.collection('videos').get());
    vids.forEach(doc=>renderVideoNuevo(doc.id, doc.data().url, doc.data().nombre));
  } catch(e){ console.warn('Firebase carga:', e.message); }
}
document.addEventListener('DOMContentLoaded', cargarDesdeFirebase);
if(document.readyState!=='loading') cargarDesdeFirebase();


/* ── SCROLL ANIMATIONS ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('v'); });
},{threshold:0.1});
document.querySelectorAll('.fu').forEach(el=>obs.observe(el));
