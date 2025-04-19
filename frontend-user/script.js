const GRAPHQL_URL = 'http://localhost:3000/graphql';
const WS_URL = 'ws://localhost:8081';

let ws = null;
let currentCategory = null;

// GraphQL функции
async function fetchCategories() {
    try {
        console.log('Отправка запроса на получение категорий...');
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetCategories {
                        categories
                    }
                `
            })
        });

        console.log('Статус ответа:', response.status);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке категорий');
        }

        const result = await response.json();
        console.log('Полный ответ сервера (категории):', JSON.stringify(result, null, 2));
        
        if (!result.data || !result.data.categories) {
            console.error('Неверный формат ответа от сервера:', result);
            return [];
        }

        return result.data.categories;
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        return [];
    }
}

function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) {
        console.error('Контейнер категорий не найден');
        return;
    }

    categoriesContainer.innerHTML = '';

    // Проверяем, что categories существует и является массивом
    if (!Array.isArray(categories)) {
        console.error('Категории не найдены или имеют неверный формат');
        return;
    }

    // Добавляем кнопку "Все"
    const allButton = document.createElement('button');
    allButton.textContent = 'Все';
    allButton.onclick = () => {
        currentCategory = null;
        fetchProducts().then(products => displayProducts(products));
        updateActiveCategory(allButton);
    };
    categoriesContainer.appendChild(allButton);

    // Добавляем кнопки категорий
    categories.forEach(category => {
        if (!category) return; // Пропускаем пустые категории
        
        const button = document.createElement('button');
        button.textContent = category;
        button.onclick = () => {
            console.log('Выбрана категория:', category);
            currentCategory = category;
            fetchProducts(category).then(products => {
                console.log('Получены продукты для категории:', products);
                displayProducts(products);
            });
            updateActiveCategory(button);
        };
        categoriesContainer.appendChild(button);
    });
}

function updateActiveCategory(activeButton) {
    document.querySelectorAll('#categories button').forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

async function fetchProducts(category = null) {
    try {
        const query = `
            query {
                products${category ? `(category: "${category}")` : ''} {
                    id
                    name
                    price
                    description
                    categories
                }
            }
        `;

        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Ответ сервера:', result);

        if (result.errors) {
            console.error('GraphQL ошибки:', result.errors);
            throw new Error('Ошибка при выполнении запроса');
        }

        if (!result.data || !result.data.products) {
            console.error('Неверный формат ответа:', result);
            return [];
        }

        return result.data.products;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return [];
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
        if (product.categories) {
            productContent += `<div class="categories">`;
            product.categories.forEach(category => {
                productContent += `<span class="category-tag">${category}</span>`;
            });
            productContent += `</div>`;
        }
        
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

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
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
    if (chatContainer) {
        chatContainer.classList.toggle('visible');
        // Если чат открывается, подключаемся к WebSocket
        if (chatContainer.classList.contains('visible') && !ws) {
            connectWebSocket();
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories().then(categories => {
        displayCategories(categories);
        fetchProducts();
    });
    connectWebSocket();
});
