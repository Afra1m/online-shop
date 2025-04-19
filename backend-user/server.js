const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Путь к общему файлу с товарами
const PRODUCTS_FILE = path.join(__dirname, '../products.json');

// Загрузка товаров из файла
function loadProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return [];
    }
}

// Раздача статических файлов (фронтенд пользователя)
app.use(express.static(path.join(__dirname, '../frontend-user')));

app.use(cors());
app.use(express.json());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true
}));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`GraphQL сервер запущен на порту ${PORT}`);
});
