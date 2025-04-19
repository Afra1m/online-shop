const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt } = require('graphql');
const fs = require('fs');
const path = require('path');

// Путь к файлу с товарами
const PRODUCTS_FILE = path.join(__dirname, '..', 'products.json');
console.log('Текущая рабочая директория:', process.cwd());
console.log('Путь к файлу products.json:', PRODUCTS_FILE);
console.log('Файл существует:', fs.existsSync(PRODUCTS_FILE));

// Функция для загрузки товаров
function loadProducts() {
    try {
        console.log('Попытка загрузки файла:', PRODUCTS_FILE);
        if (fs.existsSync(PRODUCTS_FILE)) {
            console.log('Файл products.json существует');
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            console.log('Содержимое файла:', data);
            const products = JSON.parse(data);
            return products.map(product => ({
                ...product,
                id: String(product.id)
            }));
        }
        console.error('Файл products.json не найден по пути:', PRODUCTS_FILE);
        return [];
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        return [];
    }
}

// Тип Category
const CategoryType = new GraphQLObjectType({
    name: 'Category',
    fields: {
        name: { type: GraphQLString }
    }
});

// Тип Product
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        description: { type: GraphQLString },
        categories: { type: new GraphQLList(GraphQLString) }
    })
});

// Корневой тип запроса
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            args: {
                category: { type: GraphQLString }
            },
            resolve: (_, { category }) => {
                const products = loadProducts();
                if (!category) return products;
                return products.filter(product => 
                    product.categories && 
                    product.categories.includes(category)
                );
            }
        },
        categories: {
            type: new GraphQLList(GraphQLString),
            resolve: () => {
                const products = loadProducts();
                const categories = new Set();
                products.forEach(product => {
                    if (product.categories) {
                        product.categories.forEach(category => {
                            if (category) categories.add(category);
                        });
                    }
                });
                return Array.from(categories);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
}); 