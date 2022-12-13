### How to reproduce

```
npm i
npm start
```

Open url with query included: `http://localhost:4000/graphql?query=query+getUsers+%7B%0A++users+%7B%0A++++id%0A++++name%0A++++...+on+User+%7B%0A++++++isNamedTom%0A++++%7D%0A++%7D%0A%7D`

Or open url `http://localhost:4000/graphql` and post the following query:
```
query getUsers {
  users {
    id
    name
    ... on User {
      isNamedTom
    }
  }
}
```
 
Expected result is a list of 2 users with the property `isNamedTom`. Actual result is an error.


One can also see in the logs that the request towards the extending service (`extendedUsers.js`)
is being sent without the field `isNamedTom`, it is simply this:

```
query getUsers($_v0_representations: [_Any!]!) {
   __typename
   _entities(representations: $_v0_representations) {
     __typename
   }
}
```

