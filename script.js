let editIndex = null;

function addClient() {
    const name = document.getElementById('clientName').value.trim();
    let phone = document.getElementById('clientPhone').value.trim();
    const status = document.getElementById('status').value;
    const btn = document.getElementById('mainBtn');

    if(!name || !phone) return alert("Por favor, completa los datos.");

    // Limpieza de número (solo dígitos)
    phone = phone.replace(/\D/g, ''); 

    const d = new Date();
    const dateStr = `${d.getDate()}/${d.getMonth()+1}`;

    let clients = JSON.parse(localStorage.getItem('whatsLite')) || [];

    if(editIndex !== null) {
        clients[editIndex] = { ...clients[editIndex], name, phone, status };
        editIndex = null;
        btn.innerText = "Añadir Cliente";
    } else {
        clients.push({ name, phone, status, date: dateStr });
    }

    localStorage.setItem('whatsLite', JSON.stringify(clients));
    
    btn.innerText = "¡Guardado! ✅";
    btn.classList.add('btn-success');
    setTimeout(() => {
        btn.innerText = "Añadir Cliente";
        btn.classList.remove('btn-success');
    }, 1500);

    document.getElementById('clientName').value = "";
    document.getElementById('clientPhone').value = "";
    render();
}

function render() {
    const list = document.getElementById('clientList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let clients = JSON.parse(localStorage.getItem('whatsLite')) || [];
    
    const total = clients.length;
    const ventas = clients.filter(c => c.status === "✅ Venta Cerrada").length;
    const porc = total > 0 ? (ventas / total) * 100 : 0;
    document.getElementById('progressBar').style.width = porc + "%";

    list.innerHTML = "";
    clients.forEach((c, i) => {
        if(c.name.toLowerCase().includes(searchTerm)) {
            const card = document.createElement('div');
            card.className = "client-card";
            card.innerHTML = `
                <div class="client-info">
                    <strong>${c.name}</strong>
                    <span>${c.status} • ${c.date}</span>
                    <span style="color:#25d366; font-size:10px">+${c.phone}</span>
                </div>
                <div class="actions">
                    <button class="btn-action btn-ws" onclick="window.open('https://wa.me/${c.phone}')">💬</button>
                    <button class="btn-action btn-edit" onclick="editClient(${i})">✏️</button>
                    <button class="btn-action btn-delete" onclick="deleteClient(${i})">🗑️</button>
                </div>`;
            list.appendChild(card);
        }
    });
}

function exportToExcel() {
    let clients = JSON.parse(localStorage.getItem('whatsLite')) || [];
    if(clients.length === 0) return alert("No hay clientes para exportar.");

    // BOM (Byte Order Mark) para que Excel reconozca tildes y caracteres especiales
    let csvContent = "\uFEFF"; 
    
    // Usamos punto y coma (;) que es el estándar más compatible para Excel en español
    csvContent += "Nombre;WhatsApp;Estado;Fecha\n"; 

    clients.forEach(c => {
        // Limpiamos posibles comas o puntos y coma dentro de los nombres para no romper las celdas
        let cleanName = c.name.replace(/;/g, ",");
        csvContent += `${cleanName};${c.phone};${c.status};${c.date}\n`;
    });

    // Creamos el archivo con el tipo de contenido correcto (text/csv)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mis_clientes_whatscontrol.csv");
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}

function deleteClient(i) {
    if(confirm("¿Eliminar este cliente definitivamente?")) {
        let clients = JSON.parse(localStorage.getItem('whatsLite'));
        clients.splice(i, 1);
        localStorage.setItem('whatsLite', JSON.stringify(clients));
        render();
    }
}

function editClient(i) {
    let clients = JSON.parse(localStorage.getItem('whatsLite'));
    const c = clients[i];
    document.getElementById('clientName').value = c.name;
    document.getElementById('clientPhone').value = c.phone;
    document.getElementById('status').value = c.status;
    editIndex = i;
    document.getElementById('mainBtn').innerText = "Actualizar Datos";
    window.scrollTo({top: 0, behavior: 'smooth'});
}

window.onload = render;