// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null; // 'esp' o 'cus'
const enableDeleteButton = true;   // true = activo, false = desactivado
const storageKey = 'records';
let estados = { 1: '', 2: '', 3: '' }; // 👈 estados de semáforos
// ======================
// AUXILIARES
// ======================
function get(id){ return document.getElementById(id).value.trim(); }
function chk(id){ return document.getElementById(id).checked ? 'Sí' : 'No'; }

/**
 * Función auxiliar segura para obtener el dataURL de un elemento canvas.
 * Evita que el script falle si el elemento no se encuentra o no es un canvas.
 */
function getSignatureData(id) {
    const canvasElement = document.getElementById(id);
    // Verifica que el elemento exista y sea un CANVAS antes de llamar a toDataURL()
    if (canvasElement && canvasElement.tagName === 'CANVAS') {
        return canvasElement.toDataURL();
    }
    return ''; // Devuelve cadena vacía si falla
}

// ======================
// FOLIO AUTOMÁTICO
// ======================
function generateFolio(){
    const company = get('company') || 'SinEmpresa';
    const now = new Date();
    const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,'0'), d = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0'), min = String(now.getMinutes()).padStart(2,'0');
    return `MP_Report-${company}-${y}${m}${d}-${h}${min}`;
}

// ======================
// GUARDAR REGISTRO (CAMPOS SEPARADOS POR COLUMNA)
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
  const record = {
    folio: generateFolio(),
    OT: get('OT'),
    datetime: get('datetime'),
    company: get('company'),
    engineer: get('engineer'),
    phone: get('phone'),
    city: get('city'),
    description: get('description'),
    brand: get('brand'),
    model: get('model'),
    serial: get('serial'),
    controlnum: get('controlnum'),
    status: get('status'),
    ubication: get('ubication'),
    temperature: get('temperature'),
    humidity: get('humidity'),
    notes: get('notes'),
    name_esp: get('name_esp'),
    name_cus: get('name_cus'),
    signatureEsp: getSignatureData('signaturePreviewEsp'),
    signatureCus: getSignatureData('signaturePreviewCus'),
    // 🔴 SEMÁFOROS
    estado_ref: estados[1],
    estado_heat: estados[2],
    estado_elec: estados[3],
    // 🔹 Estáticas
    static_ls: get('static_ls'),
    static_hs: get('static_hs'),
    // 🔹 Resistencias
    resistance_hs_1: get('resistance_hs_1'),
    resistance_hs_2: get('resistance_hs_2'),
    resistance_hs_3: get('resistance_hs_3'),
    resistance_ls_1: get('resistance_ls_1'),
    resistance_ls_2: get('resistance_ls_2'),
    resistance_ls_3: get('resistance_ls_3'),
    resistance_circ_1: get('resistance_circ_1'),
    resistance_circ_2: get('resistance_circ_2'),
    resistance_circ_3: get('resistance_circ_3'),
    resistance_heat_1: get('resistance_heat_1'),
    resistance_heat_2: get('resistance_heat_2'),
    resistance_heat_3: get('resistance_heat_3'),
    resistance_hum_1: get('resistance_hum_1'),
    resistance_hum_2: get('resistance_hum_2'),
    resistance_hum_3: get('resistance_hum_3'),

    // 🔹 Voltajes
    voltaje_hs_1: get('voltaje_hs_1'),
    voltaje_hs_2: get('voltaje_hs_2'),
    voltaje_hs_3: get('voltaje_hs_3'),
    voltaje_ls_1: get('voltaje_ls_1'),
    voltaje_ls_2: get('voltaje_ls_2'),
    voltaje_ls_3: get('voltaje_ls_3'),
    to_ground: get('to_ground'),

    // 🔹 Corrientes
    current_hs_1: get('current_hs_1'),
    current_hs_2: get('current_hs_2'),
    current_hs_3: get('current_hs_3'),
    current_ls_1: get('current_ls_1'),
    current_ls_2: get('current_ls_2'),
    current_ls_3: get('current_ls_3'),
    current_circ_1: get('current_circ_1'),
    current_circ_2: get('current_circ_2'),
    current_circ_3: get('current_circ_3'),
    current_heat_1: get('current_heat_1'),
    current_heat_2: get('current_heat_2'),
    current_heat_3: get('current_heat_3'),
    current_hum_1: get('current_hum_1'),
    current_hum_2: get('current_hum_2'),
    current_hum_3: get('current_hum_3'),

    // 🔹 Presiones
    pressures_hs_1: get('pressures_hs_1'),
    pressures_hs_2: get('pressures_hs_2'),
    pressures_ls_1: get('pressures_ls_1'),
    pressures_ls_2: get('pressures_ls_2')
  };

  records.push(record);
  localStorage.setItem(storageKey, JSON.stringify(records));
  renderTable();
  alert('✅ Registro guardado correctamente');
});

// ======================
// LIMPIAR FORMULARIO
// ======================
document.getElementById('clearBtn').addEventListener('click', ()=>{
    document.getElementById('reportForm').reset();
    
    // Los clearRect deben estar dentro de un chequeo de existencia si los ID no son seguros
    const espCtx = document.getElementById('signaturePreviewEsp')?.getContext('2d');
    const cusCtx = document.getElementById('signaturePreviewCus')?.getContext('2d');
    if (espCtx) espCtx.clearRect(0,0,300,150);
    if (cusCtx) cusCtx.clearRect(0,0,300,150);
});
  // 🔄 Reset semáforos
  estados = { 1: '', 2: '', 3: '' };
  ['1','2','3'].forEach(num => {
    ['roja','amarilla','verde'].forEach(c => 
      document.getElementById(c + num)?.classList.remove('activa')
    );
  });
// ======================
// RENDER TABLA
// ======================
function renderTable(){
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    const columns = [
  'folio',
  'OT',
  'datetime',
  'company',
  'engineer',
  'phone',
  'city',
  'description',
  'brand',
  'model',
  'serial',
  'controlnum',
  'status',
  'ubication',
  'temperature',
  'humidity',
  'notes',
  'name_esp',
  'name_cus',
  'signatureEsp',
  'signatureCus',
        
    'estado_ref',
    'estado_heat',
    'estado_elec',
        
  'static_ls',
  'static_hs',
        
  'resistance_hs_1',
  'resistance_hs_2',
  'resistance_hs_3',
  'resistance_ls_1',
  'resistance_ls_2',
  'resistance_ls_3',
  'resistance_circ_1',
  'resistance_circ_2',
  'resistance_circ_3',
  'resistance_heat_1',
  'resistance_heat_2',
  'resistance_heat_3',
  'resistance_hum_1',
  'resistance_hum_2',
  'resistance_hum_3',
        
  'voltaje_hs_1',
  'voltaje_hs_2',
  'voltaje_hs_3',
  'voltaje_ls_1',
  'voltaje_ls_2',
  'voltaje_ls_3',
  'to_ground',
        
  'current_hs_1',
  'current_hs_2',
  'current_hs_3',
  'current_ls_1',
  'current_ls_2',
  'current_ls_3',
  'current_circ_1',
  'current_circ_2',
  'current_circ_3',
  'current_heat_1',
  'current_heat_2',
  'current_heat_3',
  'current_hum_1',
  'current_hum_2',
  'current_hum_3',
        
  'pressures_hs_1',
  'pressures_hs_2',
  'pressures_ls_1',
  'pressures_ls_2'
];
    
    head.innerHTML = columns.map(c => `<th>${c.toUpperCase().replace(/_/g, ' ')}</th>`).join('');
    
    records.forEach(r => {
        const row = `<tr>${columns.map(c => {
            let data = r[c] || '';
            
            if (Array.isArray(data)) {
                data = data.filter(val => val !== null && val !== undefined).join('<br>');
            }
            
            return `<td>${data}</td>`;
        }).join('')}</tr>`;
        
        body.insertAdjacentHTML('beforeend', row);
    });
}

renderTable();

// ======================
// EXPORTAR EXCEL
// ======================
document.getElementById('exportBtn').addEventListener('click', ()=>{
    if(!records.length) return alert('No hay registros para exportar.');
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
    XLSX.writeFile(wb, 'Registro_de_preventivos.xlsx');
});

// ======================
// BORRAR REGISTROS
// ======================
const deleteBtn = document.getElementById('deleteAllBtn');
deleteBtn.style.display = enableDeleteButton?'inline-block':'none';
deleteBtn.onclick = ()=>{
    if(!enableDeleteButton) return;
    if(confirm('¿Borrar todos los registros guardados?')){
        localStorage.removeItem(storageKey);
        records=[];
        renderTable();
    }
}

// ======================
// FIRMA
// ======================
const modal = document.getElementById('signatureModal');
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function openSignature(target){
    currentSignatureTarget = target;
    modal.classList.add('active');
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

document.getElementById('openSignatureEsp').addEventListener('click',()=>openSignature('esp'));
document.getElementById('openSignatureCus').addEventListener('click',()=>openSignature('cus'));

document.getElementById('closeSignature').addEventListener('click',()=>modal.classList.remove('active'));
document.getElementById('clearSignature').addEventListener('click',()=>ctx.clearRect(0,0,canvas.width,canvas.height));
document.getElementById('saveSignature').addEventListener('click',()=>{
    const dataURL = canvas.toDataURL();
    let preview = currentSignatureTarget==='esp'?document.getElementById('signaturePreviewEsp'):document.getElementById('signaturePreviewCus');
    // Se agrega una verificación si 'preview' existe antes de obtener el contexto
    if (!preview) {
        console.error("No se encontró el canvas de vista previa para la firma.");
        modal.classList.remove('active');
        return;
    }
    
    const pctx = preview.getContext('2d');
    const img = new Image();
    img.onload = ()=>{pctx.clearRect(0,0,300,150); pctx.drawImage(img,0,0,300,150)};
    img.src = dataURL;
    modal.classList.remove('active');
});

// ======================
// DIBUJO CANVAS
// ======================
const getTouchPos = (canvasDom, touchEvent) => {
    const rect = canvasDom.getBoundingClientRect();
    // Obtiene la posición del primer toque (touch) y ajusta por el scroll y la posición del canvas
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
};

// Eventos del Mouse
canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    drawing = true; 
    ctx.beginPath(); 
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => { drawing = false; });
canvas.addEventListener('mouseout', () => { drawing = false; });
canvas.addEventListener('mousemove', e => {
    if (!drawing) return; 
    ctx.lineWidth = 2; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = '#000'; 
    ctx.lineTo(e.offsetX, e.offsetY); 
    ctx.stroke();
});

// Eventos Táctiles (para móviles)
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    drawing = true;
    const touch = getTouchPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(touch.x, touch.y);
}, false);

canvas.addEventListener('touchend', () => { drawing = false; });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!drawing) return;
    const touch = getTouchPos(canvas, e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();
}, false);
const seccion = document.getElementById('section-headerx');
// Sección de semáforos
function setEstado(num, color) {
  const colores = ['roja', 'amarilla', 'verde'];
  colores.forEach(c => {
    document.getElementById(c + num).classList.remove('activa');
  });
  document.getElementById(color + num).classList.add('activa');
}
