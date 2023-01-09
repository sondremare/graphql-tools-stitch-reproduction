const { createSchema, createYoga} = require('graphql-yoga')
const { createServer } = require('node:http');

const typeDefs = `
    directive @key(selectionSet: String!) on OBJECT
    directive @computed(selectionSet: String!) on FIELD_DEFINITION
    directive @merge(argsExpr: String, keyArg: String, keyField: String, key: [String!], additionalArgs: String) on FIELD_DEFINITION
    directive @canonical on OBJECT | INTERFACE | INPUT_OBJECT | UNION | ENUM | SCALAR | FIELD_DEFINITION | INPUT_FIELD_DEFINITION
    
    type Service {
        sdl: String!
    }
    
    type ComplexType {
        someProperty: Boolean
    }
    
    type User {
        id: ID!
        isSomeComplexType: ComplexType @computed(selectionSet: "{ name }")
    }

    type Query {
        _entities(representations: [_Any!]!): [_Entity]! @merge
        _service: Service!
        _dummy: String!
    }
    
    scalar _Any

    union _Entity = User
`;


const extendedUserResolvers = {
    Query: {
        _dummy: () => 'OK',
        _entities: (root, args) => {
            return args.representations;
        },
        _service: () => {
            return {
                sdl: typeDefs,
            }
        },
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

const federatedExtendedUserSchema = createSchema({
    typeDefs,
    resolvers: extendedUserResolvers,
});


const PORT = 4002;

async function init() {
    const yoga = createYoga({
        schema: federatedExtendedUserSchema,
    });

    const graphQLServer = createServer(yoga);

    graphQLServer.listen(PORT, () => {
        console.log(`Extended user service running on port: ${PORT}`);
    });
}

void init();


