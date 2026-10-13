To use the API you first **log in once** with your username and password. You get back a **token**. Send that token with every other request.

## 1. Log in

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user { id username }
  }
}
```

Variables:

```json
{
  "input": {
    "username": "store@example.com",
    "password": "your-password"
  }
}
```

Answer:

```json
{
  "data": {
    "login": {
      "token": "3|kD8f2...x91",
      "user": { "id": 812, "username": "store@example.com" }
    }
  }
}
```

## 2. Send the token

Add it to the `Authorization` header of every request, after the word `Bearer` and a space:

```
Authorization: Bearer 3|kD8f2...x91
```

## Good to know

- **Keep the token secret**, like a password: store it on your server, never in a web page or mobile app.
- **Reuse it.** Don't log in before every request; log in again only when a request answers with `Unauthenticated` (see [Errors](/english/errors)).
- `rememberMe` is `true` by default, so the token stays valid for a long time.
- A wrong username or password returns an error, not a token.
