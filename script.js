let editIndex = null;

function addClient() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const status = document.getElementById('status').value;

    if(!name || !phone) return alert("Por favor, completa los datos.");

    let clients = JSON.parse(localStorage.getItem('whatsControlData')) || [];

    if(editIndex !== null) {
        clients[editIndex] = { name, phone, status };
        editIndex = null;
        document.getElementById('mainBtn').innerText = "Añadir a mi lista";
    } else {
        clients.push({ name, phone, status });
    }

    localStorage.setItem('whatsControlData', JSON.stringify(clients));
    clearInputs();
    render();
}

function deleteClient(index) {
    if(confirm("¿Seguro que quieres eliminar este cliente?")) {
        let clients = JSON.parse(localStorage.getItem('whatsControlData'));
        clients.splice(index, 1);
        localStorage.setItem('whatsControlData', JSON.stringify(clients));
        render();
    }
}

function editClient(index) {
    let clients = JSON.parse(localStorage.getItem('whatsControlData'));
    const c = clients[index];
    document.getElementById('clientName').value = c.name;
    document.getElementById('clientPhone').value = c.phone;
    document.getElementById('status').value = c.status;
    editIndex = index;
    document.getElementById('mainBtn').innerText = "Actualizar Cliente";
}

function clearInputs() {
    document.getElementById('clientName').value = "";
    document.getElementById('clientPhone').value = "";
}

function render() {
    const list = document.getElementById('clientList');
    const clients = JSON.parse(localStorage.getItem('whatsControlData')) || [];
    list.innerHTML = clients.map((c, i) => `
        <div class="client-card card-${c.status}">
            <div>
                <strong>${c.name}</strong><br>
                <small>${c.status}</small>
            </div>
            <div class="actions">
                <button class="btn-action btn-ws" onclick="window.open('https://wa.me/${c.phone}')">💬</button>
                <button class="btn-action btn-edit" onclick="editClient(${i})">✏️</button>
                <button class="btn-action btn-delete" onclick="deleteClient(${i})">🗑️</button>
            </div>
        </div>
    `).join('');
}

window.onload = render;