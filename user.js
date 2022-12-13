const  { buildSubgraphSchema } = require('@apollo/federation');
const { ApolloServer, gql } = require('apollo-server');

const userData = [
    { id: '1', name: 'Tom',},
    { id: '2', name: 'Mary' },
]

const typeDefs = gql`
        interface GenericUser {
            id: ID!
            name: String!
        }

        type User implements GenericUser @key(fields: "id") {
            id: ID!
            name: String!
        }

        type Query {
            users: [GenericUser!]!
        }
`;


const userResolvers = {
    Query: {
        users: () => userData,
    },
    GenericUser: {
        __resolveType: () => {
            return 'User';
        }
    }
}

const federatedUserSchema = buildSubgraphSchema({
    typeDefs,
    resolvers: userResolvers,
});

const PORT = 4001;

async function init() {
    const server = new ApolloServer({
        schema: federatedUserSchema,
    });

    await server.listen(PORT);
    console.log(`User service running on port: ${PORT}`);
}

void init();


