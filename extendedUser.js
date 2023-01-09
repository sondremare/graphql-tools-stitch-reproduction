const  { buildSubgraphSchema } = require('@apollo/federation');
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    
    type ComplexType {
        someProperty: Boolean
    }
    
    extend type User @key(fields: "id") {
        id: ID! @external
        name: Boolean! @external
        isSomeComplexType: ComplexType @requires(fields: "name")
    }

    type Query {
        _dummy: String!
    }
`;


const extendedUserResolvers = {
    Query: {
        _dummy: () => 'OK',
    },
    User: {
        isSomeComplexType: (source, args) => {
            if (source.name === 'Tom') {
                return {someProperty: true};
            }
            return {someProperty: false};
        },
    }
}

const federatedExtendedUserSchema = buildSubgraphSchema({
    typeDefs,
    resolvers: extendedUserResolvers,
});


const PORT = 4002;

async function init() {
    const server = new ApolloServer({
        schema: federatedExtendedUserSchema,
    });

    await server.listen(PORT);
    console.log(`Extended user service running on port: ${PORT}`);
}

void init();


