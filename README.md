# 🛍️ Онлайн-магазин с GraphQL и WebSocket

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

</div>

## 📋 Содержание
- [Описание](#-описание)
- [Функциональность](#-функциональность)
- [Технологии](#-технологии)
- [Установка и запуск](#-установка-и-запуск)
- [API Документация](#-api-документация)
- [Структура проекта](#-структура-проекта)
- [Требования](#-требования)
- [Архитектура](#-архитектура)

## 🎯 Описание

Современный онлайн-магазин с разделением на клиентскую и административную части. Проект реализован с использованием GraphQL для клиентской части и REST API для административной панели. Включает в себя систему чата поддержки на базе WebSocket.

## ✨ Функциональность

### 👤 Клиентская часть
- 📦 Каталог товаров с фильтрацией по категориям
- 🔍 Поиск товаров
- 💬 Чат поддержки в реальном времени
- 🛒 Корзина покупок
- 📱 Адаптивный дизайн

### 👨‍💼 Административная часть
- 📊 Панель управления товарами
- ✏️ CRUD операции с товарами
- 💬 Модерация чата поддержки
- 📈 Статистика продаж
- 🔐 Защищенный доступ

## 🛠 Технологии

- **Frontend:**
  - React.js
  - Apollo Client
  - Material-UI
  - WebSocket

- **Backend:**
  - Node.js
  - Express
  - GraphQL
  - WebSocket
  - REST API

- **DevOps:**
  - Docker
  - Docker Compose

## 🏗️ Архитектура

### Балансировка нагрузки
- 🔄 Nginx в качестве балансировщика нагрузки
- 📦 3 экземпляра клиентского бэкенда
- 👨‍💼 3 экземпляра административного бэкенда
- 🔌 WebSocket поддержка через прокси

### Схема развертывания
```
                    ┌─────────────┐
                    │    Nginx    │
                    │  (Port 80)  │
                    └──────┬──────┘
                           │
        ┌──────────┬───────┴───────┬──────────┐
        │          │               │          │
┌───────▼───┐ ┌────▼─────┐    ┌────▼─────┐ ┌──▼───────┐
│Backend-1  │ │Backend-2 │    │Backend-3 │ │Frontend  │
│(User)     │ │(User)    │    │(User)    │ │(User)    │
└───────────┘ └──────────┘    └──────────┘ └──────────┘
        │          │               │              │
        └──────────┴───────────────┴──────────────┘
                           │
                    ┌──────▼──────┐
                    │  Products   │
                    │    JSON     │
                    └─────────────┘
```

## 🚀 Установка и запуск

### Вариант 1: Запуск с Docker (рекомендуется)

1. Убедитесь, что у вас установлены:
   - Docker
   - Docker Compose

2. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd <project-directory>
```

3. Запустите приложение:
```bash
docker-compose up --build
```

4. Откройте в браузере:
   - 🌐 Клиентская часть: http://localhost:3000
   - 🔧 Административная часть: http://localhost:3001

### Проверка балансировки нагрузки

Для проверки работы балансировщика нагрузки можно использовать следующие команды:

```bash
# Проверка доступности сервисов
curl http://localhost/graphql

# Проверка WebSocket соединения
wscat -c ws://localhost/ws
```

### Вариант 2: Ручной запуск

1. Установите зависимости:
```bash
# Backend User
cd backend-user
npm install

# Backend Admin
cd ../backend-admin
npm install

# Frontend User
cd ../frontend-user
npm install

# Frontend Admin
cd ../frontend-admin
npm install
```

2. Запустите сервисы:
```bash
# Backend User (GraphQL + WebSocket)
cd backend-user
npm start

# Backend Admin
cd ../backend-admin
npm start

# Frontend User
cd ../frontend-user
npm start

# Frontend Admin
cd ../frontend-admin
npm start
```

## 📚 API Документация

### GraphQL API (клиентская часть)
- **Endpoint:** http://localhost:4000/graphql
- **Запросы:**
  - `products`: Получение списка товаров
  - `productsByCategory`: Фильтрация по категориям
  - `categories`: Получение списка категорий

### REST API (административная часть)
- **Base URL:** http://localhost:4001
- **Endpoints:**
  - `GET /api/products` - получение списка товаров
  - `POST /api/products` - создание товара
  - `PUT /api/products/:id` - обновление товара
  - `DELETE /api/products/:id` - удаление товара

### WebSocket
- **URL:** ws://localhost:4000
- **Функционал:** Чат поддержки
- **События:**
  - `message`: отправка сообщения
  - `typing`: индикатор набора текста
  - `read`: подтверждение прочтения

## 📂 Структура проекта
```
project/
├── backend-user/         # GraphQL + WebSocket сервер
├── backend-admin/        # REST API сервер
├── frontend-user/        # Клиентский интерфейс
├── frontend-admin/       # Административный интерфейс
├── products.json         # Данные товаров
├── docker-compose.yml    # Docker конфигурация
└── README.md            # Документация
```

## 📋 Требования

- Node.js >= 14.x
- Docker >= 20.x
- Docker Compose >= 2.x
- Современный веб-браузер с поддержкой WebSocket

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функциональности
3. Внесите изменения
4. Отправьте pull request

## 📄 Автор

Пивоваров Александр Константинович

---
