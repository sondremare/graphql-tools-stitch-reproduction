const  { buildSubgraphSchema } = require('@apollo/federation');
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    extend type User @key(fields: "id") {
        id: ID! @external
        name: Boolean! @external
        isNamedTom: Boolean! @requires(fields: "name")
    }


    type Query {
        _dummy: String!
    }
`;


const extendedUserResolvers = {
    Query: {
        _dummy: () => 'OK',
    },
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


