const CATEGORIES = [
  'Сантехник қызметі',
  'Электрик қызметі',
  'Жиһаз құрастыру',
  'Тазалық қызметі',
  'Ұзата жөндеу',
  'Тіс дәрігері'
];

let services = [
  { id: 1, name: 'Бексұлтан', service: 'Сантехник қызметі', price: '5000 ₸', phone: '+7 701 111 22 33', image: '' },
  { id: 2, name: 'Асқар', service: 'Электрик қызметі', price: '4500 ₸', phone: '+7 705 222 33 44', image: '' },
  { id: 3, name: 'Данияр', service: 'Жиһаз құрастыру', price: '8000 ₸', phone: '+7 777 333 44 55', image: '' }
];

let editingId = null;

// DOM Elements
const grid = document.getElementById('svc-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const modal = document.getElementById('crud-modal');
const form = document.getElementById('crud-form');
const addBtn = document.getElementById('svc-add-btn');

function render() {
  const term = searchInput.value.toLowerCase();
  const cat = categoryFilter.value;

  const filtered = services.filter(s => {
    const matchTerm = s.name.toLowerCase().includes(term);
    const matchCat = cat === 'All' || s.service === cat;
    return matchTerm && matchCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px;">Ешқандай маман табылмады...</div>';
    return;
  }

  grid.innerHTML = filtered.map(s => {
    const fallback = `https://ui-avatars.com/api/?background=0891B2&color=fff&size=300&bold=true&font-size=0.4&name=${encodeURIComponent(s.name)}`;
    const img = s.image ? s.image : fallback;
    return `
      <div class="svc-card">
        <div class="svc-img-wrap">
          <img src="${img}" alt="${s.name}" class="svc-img" onerror="this.src='${fallback}'">
          <span class="svc-badge">${s.service}</span>
        </div>
        <div class="svc-body">
          <h3 class="svc-name">${s.name}</h3>
          <div class="svc-meta">
            <span>💰 ${s.price}</span>
            <span>📞 ${s.phone}</span>
          </div>
        </div>
        <div class="svc-actions">
          <button class="svc-btn-edit" onclick="openEdit(${s.id})">Өңдеу</button>
          <button class="tw-del-btn" onclick="deleteService(${s.id})">
            <svg viewBox="0 0 448 512" class="tw-del-svg"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Logic
window.openAdd = () => {
  editingId = null;
  form.reset();
  document.getElementById('modal-title').innerText = '➕ Жаңа маман қосу';
  document.getElementById('modal-submit-btn').innerHTML = '✅ Қосу';
  document.getElementById('form-alert').className = 'alert error';
  modal.style.display = 'flex';
};

window.openEdit = (id) => {
  editingId = id;
  const s = services.find(x => x.id === id);
  form.name.value = s.name;
  form.service.value = s.service;
  form.price.value = s.price;
  form.phone.value = s.phone;
  form.image.value = s.image || '';
  
  document.getElementById('modal-title').innerText = '✏️ Маманды өңдеу';
  document.getElementById('modal-submit-btn').innerHTML = '💾 Сақтау';
  document.getElementById('form-alert').className = 'alert error';
  modal.style.display = 'flex';
};

window.closeModal = () => {
  modal.style.display = 'none';
};

// Click outside modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Form Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const alertEl = document.getElementById('form-alert');
  
  const payload = {
    name: form.name.value.trim(),
    service: form.service.value,
    price: form.price.value.trim(),
    phone: form.phone.value.trim(),
    image: form.image.value.trim()
  };

  if(!payload.name || !payload.service || !payload.price || !payload.phone) {
    alertEl.innerText = '❌ Барлық жолақтарды толтырыңыз!';
    alertEl.classList.add('show');
    return;
  }

  if (editingId) {
    const idx = services.findIndex(x => x.id === editingId);
    services[idx] = { ...services[idx], ...payload };
  } else {
    payload.id = Date.now();
    services.push(payload);
  }

  closeModal();
  render();
});

window.deleteService = (id) => {
  if(confirm('Бұл маманды өшіргіңіз келе ме?')) {
    services = services.filter(x => x.id !== id);
    render();
  }
};

searchInput.addEventListener('input', render);
categoryFilter.addEventListener('change', render);

// Make Category Options dynamically
const catSelect = document.getElementById('category-filter');
catSelect.innerHTML = '<option value="All">Барлық қызметтер</option>' + 
  CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');

const formCatSelect = form.service;
formCatSelect.innerHTML = '<option value="">Таңдаңыз...</option>' + 
  CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');

// Init
render();
