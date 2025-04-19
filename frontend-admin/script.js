// Константы
const API_URL = 'http://localhost:3001/api';
const WS_URL = 'ws://localhost:8081';

let ws = null;

// WebSocket функции
function connectWebSocket() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        console.log('Подключено к чату');
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        displayMessage(message);
    };

    ws.onclose = () => {
        console.log('Отключено от чата');
        setTimeout(connectWebSocket, 1000);
    };
}

function displayMessage(message) {
    const chatMessages = document.getElementById('adminChatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'Администратор' ? 'admin' : 'user'}`;
    messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleAdminKeyPress(event) {
    if (event.key === 'Enter') {
        sendAdminMessage();
    }
}

function sendAdminMessage() {
    const input = document.getElementById('adminMessageInput');
    const message = input.value.trim();
    
    if (message && ws) {
        ws.send(JSON.stringify({
            text: message,
            sender: 'Администратор'
        }));
        input.value = '';
    }
}

// Функции управления товарами
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке списка товаров:', error);
        alert('Не удалось загрузить список товаров');
    }
}

function displayProducts(products) {
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    console.log('Отображение товаров:', products);

    products.forEach(product => {
        console.log('Обработка товара:', product);
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Цена: ${product.price} руб.</p>
            <p>${product.description}</p>
            <p>Категории: ${product.categories ? product.categories.join(', ') : 'Нет категорий'}</p>
            <div class="product-actions">
                <button class="edit-btn" data-id="${product.id}" onclick="editProduct('${product.id}')">Редактировать</button>
                <button class="delete-btn" data-id="${product.id}" onclick="deleteProduct('${product.id}')">Удалить</button>
            </div>
        `;
        productsList.appendChild(productElement);
    });
}

async function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const categories = document.getElementById('productCategories').value
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

    if (!name || !price || !description || categories.length === 0) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                description,
                categories
            })
        });

        if (response.ok) {
            fetchProducts();
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productDescription').value = '';
            document.getElementById('productCategories').value = '';
        }
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
    }
}

async function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchProducts();
        }
    } catch (error) {
        console.error('Ошибка при удалении товара:', error);
    }
}

async function editProduct(id) {
    try {
        // Получаем список всех товаров
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке списка товаров');
        }
        
        const products = await response.json();
        const product = products.find(p => p.id === id);
        
        if (!product) {
            throw new Error('Товар не найден');
        }
        
        // Заполняем форму данными товара
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategories').value = Array.isArray(product.categories) 
            ? product.categories.join(', ') 
            : product.categories || '';

        // Изменяем кнопку добавления на кнопку обновления
        const addButton = document.querySelector('.add-product-form button');
        addButton.textContent = 'Обновить товар';
        addButton.onclick = () => updateProduct(id);

        // Добавляем кнопку отмены
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';
        cancelButton.className = 'cancel-btn';
        cancelButton.onclick = resetForm;
        
        const form = document.querySelector('.add-product-form');
        if (!document.querySelector('.cancel-btn')) {
            form.appendChild(cancelButton);
        }

        // Добавляем индикатор редактирования
        const formTitle = document.querySelector('.add-product-form h3');
        formTitle.textContent = 'Редактирование товара';
        formTitle.style.color = 'var(--primary-color)';
    } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
        alert(error.message);
        resetForm();
    }
}

function resetForm() {
    // Очищаем форму
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategories').value = '';

    // Возвращаем кнопку добавления
    const addButton = document.querySelector('.add-product-form button');
    addButton.textContent = 'Добавить товар';
    addButton.onclick = addProduct;

    // Удаляем кнопку отмены
    const cancelButton = document.querySelector('.cancel-btn');
    if (cancelButton) {
        cancelButton.remove();
    }

    // Возвращаем заголовок формы
    const formTitle = document.querySelector('.add-product-form h3');
    formTitle.textContent = 'Добавление товара';
    formTitle.style.color = '';
}

async function updateProduct(id) {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const categories = document.getElementById('productCategories').value
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

    if (!name || !price || !description || categories.length === 0) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                description,
                categories
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка при обновлении товара');
        }

        // Обновляем список товаров
        await fetchProducts();
        
        // Сбрасываем форму
        resetForm();
        
        alert('Товар успешно обновлен');
    } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        alert('Не удалось обновить товар');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    connectWebSocket();
}); 