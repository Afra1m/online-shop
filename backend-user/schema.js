const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLList } = require('graphql');

// Тип Product
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        description: { type: GraphQLString }
    }
});

// Корневой тип запроса
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        products: {
            type: new GraphQLList(ProductType),
            args: {
                fields: { type: GraphQLString }
            },
            resolve(parent, args) {
                const products = require('./products.json');
                if (args.fields) {
                    const fields = args.fields.split(',');
                    return products.map(product => {
                        const filteredProduct = {};
                        fields.forEach(field => {
                            if (product[field] !== undefined) {
                                filteredProduct[field] = product[field];
                            }
                        });
                        return filteredProduct;
                    });
                }
                return products;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
}); 