// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null;
const enableDeleteButton = false;
const storageKey = 'records';
// ======================
// AUXILIARES
// ======================
function get(id){ return document.getElementById(id).value.trim(); }
function chk(id){ return document.getElementById(id).checked ? 'Sí' : 'No'; }
function getSignatureData(id) {
    const canvasElement = document.getElementById(id);
    if (canvasElement && canvasElement.tagName === 'CANVAS') {
        return canvasElement.toDataURL();
    }
    return '';
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
/// ======================
// GUARDAR REGISTRO (¡CORRECCIÓN FINAL!)
// ======================
document.getElementById('saveBtn').addEventListener('click', ()=>{
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
        marking: chk('marking'),
        voltage_plate: chk('voltage_plate'),
        shock_free: chk('shock_free'),
        pallets: chk('pallets'),
        unpack: chk('unpack'),
        supplies_installed: chk('supplies_installed'),
        specs_available: chk('specs_available'),
        refrigerant: chk('refrigerant'),
        manuals: chk('manuals'),
        notes: get('notes'),
        name_esp: get('name_esp'),
        name_cus: get('name_cus'),
        signatureEsp: document.getElementById('signaturePreviewEsp').toDataURL(),
        signatureCus: document.getElementById('signaturePreviewCus').toDataURL(),
        static_ls: [get('static_ls')],
        static_hs: [get('static_hs')],
        resistance_hs: [get('resistance_hs_1'), get('resistance_hs_2'), get('resistance_hs_3')],
        resistance_ls: [get('resistance_ls_1'), get('resistance_ls_2'), get('resistance_ls_3')],
        resistance_circ: [get('resistance_circ_1'), get('resistance_circ_2'), get('resistance_circ_3')],
        resistance_heat: [get('resistance_heat_1'), get('resistance_heat_2'), get('resistance_heat_3')],
        resistance_hum: [get('resistance_hum_1'), get('resistance_hum_2'), get('resistance_hum_3')],
        voltaje_hs: [get('voltaje_hs_1'), get('voltaje_hs_2'), get('voltaje_hs_3')],
        voltaje_ls: [get('voltaje_ls_1'), get('voltaje_ls_2'), get('voltaje_ls_3')],
        to_ground: [get('to_ground')],
        current_hs: [get('current_hs_1'), get('current_hs_2'), get('current_hs_3')],
        current_ls: [get('current_ls_1'), get('current_ls_2'), get('current_ls_3')],
        current_circ: [get('current_circ_1'), get('current_circ_2'), get('current_circ_3')],
        current_heat: [get('current_heat_1'), get('current_heat_2'), get('current_heat_3')],
        current_hum: [get('current_hum_1'), get('current_hum_2'), get('current_hum_3')],
        pressures_hs: [get('pressures_hs_1'), get('pressures_hs_2')], 
        pressures_ls: [get('pressures_ls_1'), get('pressures_ls_2')]
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
    const espCtx = document.getElementById('signaturePreviewEsp')?.getContext('2d');
    const cusCtx = document.getElementById('signaturePreviewCus')?.getContext('2d');
    if (espCtx) espCtx.clearRect(0,0,300,150);
    if (cusCtx) cusCtx.clearRect(0,0,300,150);
});
// ======================
// RENDER TABLA
// ======================
function renderTable(){
    const head = document.getElementById('tableHead');
    const body = document.getElementById('tableBody');
    body.innerHTML = '';    
    const columns = [
        'folio', 'OT', 'datetime', 'company', 'engineer', 'city', 'description', 
        'status', 'temperature', 'humidity', 'static_ls', 'static_hs', 'resistance_hs',
        'resistance_ls', 'resistance_circ', 'resistance_heat', 'resistance_hum',
        'voltaje_hs', 'voltaje_ls', 'to_ground', 'current_hs', 'current_ls', 
        'current_circ', 'current_heat', 'current_hum', 'pressures_hs', 'pressures_ls'
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
    XLSX.writeFile(wb, 'Registro_de_arranques.xlsx');
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
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
};
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
if (seccion) {
  seccion.style.display = 'none';
}
