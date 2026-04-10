function addClient() {
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const status = document.getElementById('status').value;

    if(!name || !phone) return alert("Llena los datos");

    const client = { name, phone, status };
    let clients = JSON.parse(localStorage.getItem('myClients')) || [];
    clients.push(client);
    localStorage.setItem('myClients', JSON.stringify(clients));
    
    renderClients();
}

function renderClients() {
    const list = document.getElementById('clientList');
    const clients = JSON.parse(localStorage.getItem('myClients')) || [];
    list.innerHTML = clients.map((c, index) => `
        <div class="client-card">
            <strong>${c.name}</strong> - ${c.status}
            <button onclick="window.open('https://wa.me/${c.phone}?text=Hola%20${c.name}')">WhatsApp</button>
        </div>
    `).join('');
}

window.onload = renderClients;