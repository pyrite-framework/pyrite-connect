# pyrite-connect

## Install

```
npm install pyrite-connect
```

## Example

```typescript
import { Connect } from "pyrite-connect";

const connect = new Connect({
  url: 'http://localhost:8080'
});

connect.getRoutes()
.then((routes) => {
  routes.Users.createUser({ 
    body: {
      name: "Foo",
      lastName: "Bar"
    }
  })
  .then((user) => {
    console.log(user);
  });

  routes.Users.getUser({
    params: { id: 1 }
  })
  .then((user) => {
    console.log(user);
  });

  routes.Users.getUsers()
  .then((users) => {
    console.log(users);
  });

  routes.Users.on.createUser((data, id) => {
    console.log(data, id);

    routes.Users.off.createUser();
  });
});
```
