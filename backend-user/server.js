const express = require('express');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
const PORT = 8080;

// Раздача статических файлов (фронтенд пользователя)
app.use(express.static(path.join(__dirname, '../frontend-user')));

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер пользователя запущен на http://localhost:${PORT}`);
});
