const loadProducts = () => {
    fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(products => {
            const container = document.getElementById('admin-products');
            container.innerHTML = products.map(p => `
                <div class="product">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <p><strong>Цена:</strong> ${p.price} ₽</p>
                    <button onclick="deleteProduct(${p.id})">Удалить</button>
                </div>
            `).join('');
        });
};

document.getElementById('addForm').addEventListener('submit', event => {
    event.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value
    };

    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }).then(() => {
        loadProducts();
        document.getElementById('addForm').reset();
    });
});

const deleteProduct = id => {
    fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE'
    }).then(() => loadProducts());
};

// Загружаем товары при старте
loadProducts();
