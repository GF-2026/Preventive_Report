// ======================
// VARIABLES GLOBALES
// ======================
let records = JSON.parse(localStorage.getItem('records') || '[]');
let currentSignatureTarget = null;
const enableDeleteButton = false;
const storageKey = 'records';

// ======================
// FUNCIONES AUXILIARES
// ======================
function get(id){ 
    return document.getElementById(id)?.value.trim() || ''; 
}
function chk(id){ 
    return document.getElementById(id)?.checked ? 'Sí' : 'No'; 
}
function getSignatureData(id) {
    const canvasElement = document.getElementById(id);
    if (canvasElement && canvasElement.tagName === 'CANVAS') {
        return canvasElement.toDataURL();
    }
    return '';
}

// ======================
// FUNCIÓN ROBUSTA: DETECTA SI EL CANVAS ESTÁ VACÍO
// (compatible con Android, iPhone y PC)
// ======================
function isCanvasEmpty(canvas) {
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) return false; // hay píxel no transparente
        }
        return true;
    } catch (e) {
        // En ciertos Android getImageData falla -> método alternativo
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
}

// ======================
// FOLIO AUTOMÁTICO
// ======================
function generateFolio(){
    const company = get('company') || 'SinEmpresa';
    const now = new Date();
    const y = now.getFullYear(),
          m = String(now.getMonth()+1).padStart(2,'0'),
          d = String(now.getDate()).padStart(2,'0'),
          h = String(now.getHours()).padStart(2,'0'),
          min = String(now.getMinutes()).padStart(2,'0');
    return `MP_Report-${company}-${y}${m}${d}-${h}${min}`;
}

// ======================
// GUARDAR REGISTRO
// ======================
document.getElementById('saveBtn').addEventListener('click', () => {
    const signatureEsp = document.getElementById('signaturePreviewEsp');
    const signatureCus = document.getElementById('signaturePreviewCus');

    // ✅ Validación obligatoria de firmas
    if (isCanvasEmpty(signatureEsp) || isCanvasEmpty(signatureCus)) {
        alert('⚠️ Debes capturar ambas firmas antes de guardar el registro.');
        return;
    }

    // ✅ Crear objeto de registro
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
        signatureEsp: signatureEsp.toDataURL(),
        signatureCus: signatureCus.toDataURL(),
        static_ls: [get('static_ls')],
        static_hs: [get('static_hs')],
        resistance_hs: [get('resistance_hs_1'), get('resistance_hs_2'), get('resistance_hs_3')],
        resistance_ls: [get('resistance_ls_1'), get('resistance_ls_2'), get('resistance_ls_3')],
        resistance_circ: [get('resistance_circ_1'), get('resistance_circ_2']()_
