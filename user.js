const { createSchema, createYoga} = require('graphql-yoga')
const { createServer } = require('node:http');

const userData = [
    { id: '1', name: 'Tom',},
    { id: '2', name: 'Mary' },
]

const typeDefs = `
    directive @key(selectionSet: String!) on OBJECT
    directive @computed(selectionSet: String!) on FIELD_DEFINITION
    directive @merge(argsExpr: String, keyArg: String, keyField: String, key: [String!], additionalArgs: String) on FIELD_DEFINITION
    directive @canonical on OBJECT | INTERFACE | INPUT_OBJECT | UNION | ENUM | SCALAR | FIELD_DEFINITION | INPUT_FIELD_DEFINITION
    
    type Service {
        sdl: String!
    }
    
    type User {
        id: ID!
        name: String!
    }
    
    type Query {
        _service: Service!
        users: [User!]!
    }
`;


const userResolvers = {
    Query: {
        users: () => userData,
        _service: () => {
            return {
                sdl: typeDefs,
            }
        },
    },
}

const federatedUserSchema = createSchema({
    typeDefs,
    resolvers: userResolvers,
});

const PORT = 4001;

async function init() {
    const yoga = createYoga({
        schema: federatedUserSchema,
    });

    const graphQLServer = createServer(yoga);

    graphQLServer.listen(PORT, () => {
        console.log(`User service running on port: ${PORT}`);
    });
}

void init();


