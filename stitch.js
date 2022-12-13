const { stitchSchemas } = require('@graphql-tools/stitch');
const { federationToStitchingSDL, stitchingDirectives } = require('@graphql-tools/stitching-directives');
const { fetch } = require('@whatwg-node/fetch')
const { buildSchema, print } = require('graphql')
const { createServer } = require('node:http');
const { createYoga } = require('graphql-yoga');

const stitchingConfig = stitchingDirectives();

const executor = (url) => async ({ document, variables }) => {
    const query = typeof document === 'string' ? document : print(document)
    console.log(`Query towards ${url}`, query);
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    })
    return response.json()
}

const getSchema = async (url) => {
    const httpExecutor = executor(url);
    const federationSDL = await httpExecutor({ document: '{ _service { sdl } }' });
    const stitchingSDL = federationToStitchingSDL(federationSDL.data._service.sdl, stitchingConfig)
    return {
        schema: buildSchema(stitchingSDL),
        executor: httpExecutor,
    }
}


const PORT = 4000;

async function init() {
    const userSchema = await getSchema('http://localhost:4001/graphql');
    const extendedUserSchema = await getSchema('http://localhost:4002/graphql');

    const gatewaySchema = stitchSchemas({
        subschemaConfigTransforms: [stitchingConfig.stitchingDirectivesTransformer],
        subschemas: [userSchema, extendedUserSchema],
    });

    const yoga = createYoga({
        schema: gatewaySchema,
    });

    const graphQLServer = createServer(yoga);

    graphQLServer.listen(PORT, () => {
        console.log(`Running on port: ${PORT}`);
    });
}

void init();
