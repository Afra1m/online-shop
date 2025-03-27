fetch('/api/products')
    .then(res => res.json())
    .then(products => {
        const container = document.getElementById('products');
        container.innerHTML = products.map(p => `
            <div class="product">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p><strong>Цена:</strong> ${p.price} ₽</p>
            </div>
        `).join('');
    });
