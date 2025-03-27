const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Раздача статических файлов (фронтенд пользователя)
app.use(express.static(path.join(__dirname, '../frontend-user')));

// Эндпоинт для получения товаров
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'products.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка загрузки товаров' });
        }
        res.json(JSON.parse(data));
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер пользователя запущен на http://localhost:${PORT}`);
});
