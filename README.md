# pyrite-connect

## Install

```
npm install pyrite-connect
```

## Example

```typescript
import { PyriteConnect } from "pyrite-connect";

const connect = new PyriteConnect({
  url: 'http://localhost:8080'
});

connect.getRoutes()
.then((routes) => {
  routes.Users.createUser({
    name: "Foo",
    lastName: "Bar"
  })
  .then((user) => {
    console.log(user);
  });

  routes.Users.getUser(id)
  .then((user) => {
    console.log(user);
  });

  routes.Users.getUsers()
  .then((users) => {
    console.log(users);
  });
});
```
