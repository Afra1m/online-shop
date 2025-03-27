const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, '../backend-user/products.json'); // Путь к файлу с товарами

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
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка загрузки' });
        res.json(JSON.parse(data));
    });
});

// Добавление товара
app.post('/api/products', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка чтения данных' });

        let products = JSON.parse(data);
        const newProduct = { id: Date.now(), ...req.body };
        products.push(newProduct);

        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Ошибка сохранения' });
            res.json(newProduct);
        });
    });
});

// Редактирование товара
app.put('/api/products/:id', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка чтения данных' });

        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id == req.params.id);
        if (productIndex === -1) return res.status(404).json({ error: 'Товар не найден' });

        products[productIndex] = { ...products[productIndex], ...req.body };

        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Ошибка сохранения' });
            res.json(products[productIndex]);
        });
    });
});

// Удаление товара
app.delete('/api/products/:id', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Ошибка загрузки данных' });

        let products = JSON.parse(data);
        products = products.filter(p => p.id != req.params.id);

        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Ошибка сохранения' });
            res.json({ success: true });
        });
    });
});

app.use(express.static(path.join(__dirname, '../frontend-admin')));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер администратора запущен на http://localhost:${PORT}`);
});
