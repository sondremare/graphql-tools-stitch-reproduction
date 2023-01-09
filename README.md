### How to reproduce

```
npm i
npm start
```

Open url with query included: `http://localhost:4000/graphql?query=query+getUsers+%7B%0A++users+%7B%0A++++id%0A++++name%0A++++...+on+User+%7B%0A++++++isSomeComplexType+%7B%0A++++++++someProperty%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D`;

Or open url `http://localhost:4000/graphql` and post the following query:
```
query getUsers {
  users {
    id
    name
    ... on User {
      isSomeComplexType {
        someProperty
      }
    }
  }
}
```
 
Expected result is a list of 2 users with the property `isSomeComplexType`. Actual result is an `Unexpected error` because the schema is invalid.

One can also see in the logs that we get an error: `Type ComplexType must define one or more fields.`;
