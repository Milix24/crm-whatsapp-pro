let editIndex = null;

function addClient() {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const status = document.getElementById('status').value;
    const btn = document.getElementById('mainBtn');

    if(!name || !phone) return alert("Por favor, completa los campos.");

    const d = new Date();
    // Formato de año corto (26)
    const yearShort = d.getFullYear().toString().slice(-2);
    const dateStr = `${d.getDate()}/${d.getMonth()+1}/${yearShort}`;
    
    let clients = JSON.parse(localStorage.getItem('whatsLITE_v1')) || [];

    if(editIndex !== null) {
        clients[editIndex] = { ...clients[editIndex], name, phone, status };
        editIndex = null;
        btn.innerText = "Añadir Cliente";
    } else {
        clients.push({ name, phone, status, date: dateStr });
    }

    localStorage.setItem('whatsLITE_v1', JSON.stringify(clients));
    btn.innerText = "¡Guardado! ✅";
    setTimeout(() => { btn.innerText = "Añadir Cliente"; }, 1500);

    document.getElementById('clientName').value = "";
    document.getElementById('clientPhone').value = "";
    render();
}

function render() {
    const list = document.getElementById('clientList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let clients = JSON.parse(localStorage.getItem('whatsLITE_v1')) || [];

    list.innerHTML = "";
    clients.forEach((c, i) => {
        if(c.name.toLowerCase().includes(searchTerm)) {
            const card = document.createElement('div');
            card.className = "client-card";
            card.innerHTML = `
                <div class="client-info">
                    <strong>${c.name}</strong>
                    <span>${c.status} | ${c.date}</span>
                    <span style="color:#005e54; font-size:10px; font-weight:bold;">+${c.phone}</span>
                </div>
                <div class="actions">
                    <button class="btn-action" onclick="window.open('https://wa.me/${c.phone}')" title="WhatsApp">💬</button>
                    <button class="btn-action" onclick="editClient(${i})" title="Editar">✏️</button>
                    <button class="btn-action" onclick="deleteClient(${i})" title="Borrar">🗑️</button>
                </div>`;
            list.appendChild(card);
        }
    });
}

function deleteClient(i) {
    if(confirm("¿Eliminar este cliente?")) {
        let clients = JSON.parse(localStorage.getItem('whatsLITE_v1'));
        clients.splice(i, 1);
        localStorage.setItem('whatsLITE_v1', JSON.stringify(clients));
        render();
    }
}

function editClient(i) {
    let clients = JSON.parse(localStorage.getItem('whatsLITE_v1'));
    const c = clients[i];
    document.getElementById('clientName').value = c.name;
    document.getElementById('clientPhone').value = c.phone;
    document.getElementById('status').value = c.status;
    editIndex = i;
    document.getElementById('mainBtn').innerText = "Actualizar Cliente";
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function exportToExcel() {
    let clients = JSON.parse(localStorage.getItem('whatsLITE_v1')) || [];
    if(clients.length === 0) return alert("No hay datos.");
    let csv = "\uFEFFNombre;WhatsApp;Estado;Fecha\n";
    clients.forEach(c => { csv += `${c.name};${c.phone};${c.status};${c.date}\n`; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_LITE.csv`;
    link.click();
}

window.onload = render;