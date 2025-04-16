const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 8081;

// Хранение подключенных клиентов
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Новое подключение к чату');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        // Отправляем сообщение всем подключенным клиентам
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'message',
                    text: data.text,
                    sender: data.sender || 'Пользователь'
                }));
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Клиент отключился от чата');
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket сервер запущен на порту ${PORT}`);
}); 