const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const PRODUCTS_FILE = path.join(__dirname, '../products.json');

let products = [];

// Генерация уникального ID
function generateId() {
    return Date.now().toString(); // Возвращаем строку
}

// Загрузка товаров из файла
function loadProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            products = JSON.parse(data);
            // Преобразуем ID в строки
            products = products.map(product => ({
                ...product,
                id: String(product.id)
            }));
            console.log('Загружены товары:', products);
        } else {
            products = [];
        }
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        products = [];
    }
}

// Сохранение товаров в файл
function saveProducts() {
    try {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync(PRODUCTS_FILE, data);
    } catch (error) {
        console.error('Ошибка при сохранении товаров:', error);
    }
}

// Инициализация
loadProducts();

// Разрешаем CORS
app.use(cors());

// Настроим сервер для работы с JSON
app.use(express.json());

// Раздаем статические файлы (фронтенд админки)
app.use(express.static(path.join(__dirname, '../frontend-admin/index.html')));

// Отдаём админку при заходе на /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-admin/index.html'));
});

// Получение списка товаров
app.get('/api/products', (req, res) => {
    console.log('Получен запрос на получение всех товаров');
    console.log('Текущие товары:', products);
    res.json(products);
});

// Добавление товара
app.post('/api/products', (req, res) => {
    const { name, price, description, categories } = req.body;
    
    if (!name || !price || !description || !categories) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const newId = generateId();
    console.log('Сгенерирован новый ID:', newId);
    console.log('Тип нового ID:', typeof newId);

    const newProduct = {
        id: newId,
        name,
        price: parseFloat(price),
        description,
        categories: Array.isArray(categories) ? categories : [categories]
    };

    console.log('Создаем новый товар:', newProduct);
    
    products.push(newProduct);
    saveProducts();
    
    // Проверяем, что товар действительно сохранен
    const savedProduct = products.find(p => p.id === newId);
    if (!savedProduct) {
        console.error('Ошибка: товар не был сохранен');
        return res.status(500).json({ error: 'Ошибка при сохранении товара' });
    }
    
    console.log('Товар успешно сохранен:', savedProduct);
    res.status(201).json(savedProduct);
});

// Редактирование товара
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, description, categories } = req.body;
    
    if (!name || !price || !description || !categories) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const updatedProduct = {
        ...products[productIndex],
        name,
        price: parseFloat(price),
        description,
        categories: Array.isArray(categories) ? categories : [categories]
    };
    
    products[productIndex] = updatedProduct;
    saveProducts();
    res.json(updatedProduct);
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(productIndex, 1);
    saveProducts();
    res.status(204).send();
});

app.use(express.static(path.join(__dirname, '../frontend-admin')));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер администратора запущен на порту ${PORT}`);
});
