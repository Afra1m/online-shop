const { request } = require('graphql-request');

const GRAPHQL_URL = 'http://localhost:8080/graphql';
const WS_URL = 'ws://localhost:8081';

let ws = null;

// GraphQL функции
async function fetchProducts(fields = 'id,name,price,description') {
    const query = `
        query GetProducts($fields: String) {
            products(fields: $fields) {
                ${fields}
            }
        }
    `;

    try {
        const data = await request(GRAPHQL_URL, query, { fields });
        displayProducts(data.products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let productContent = '';
        if (product.name) productContent += `<h3>${product.name}</h3>`;
        if (product.price) productContent += `<p>Цена: ${product.price} руб.</p>`;
        if (product.description) productContent += `<p>${product.description}</p>`;
        
        productCard.innerHTML = productContent;
        productsContainer.appendChild(productCard);
    });
}

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
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message && ws) {
        ws.send(JSON.stringify({
            text: message,
            sender: 'Пользователь'
        }));
        input.value = '';
    }
}

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    connectWebSocket();
});
