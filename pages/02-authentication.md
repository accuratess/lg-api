# Authentication

Log in **once** with your username and password to get a **token**, then send that token with every request.

## Log in

:::tabs
```graphql title=Query
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
  }
}
```
```json title=Variables
{
  "input": {
    "username": "store@example.com",
    "password": "your-password"
  }
}
```
```json title=Response
{
  "data": {
    "login": { "token": "3|kD8f2...x91" }
  }
}
```
```bash title=cURL
curl https://your-company.com:8443/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation ($input: LoginInput!) { login(input: $input) { token } }",
    "variables": { "input": { "username": "store@example.com", "password": "your-password" } }
  }'
```
```js title=JavaScript
const response = await fetch("https://your-company.com:8443/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "mutation ($input: LoginInput!) { login(input: $input) { token } }",
    variables: { input: { username: "store@example.com", password: "your-password" } },
  }),
});
const { data } = await response.json();
const token = data.login.token;
```
```php title=PHP
$response = Http::post('https://your-company.com:8443/graphql', [
    'query' => 'mutation ($input: LoginInput!) { login(input: $input) { token } }',
    'variables' => ['input' => ['username' => 'store@example.com', 'password' => 'your-password']],
]);
$token = $response->json('data.login.token');
```
:::

## Use the token

Send it in the `Authorization` header of every request, after `Bearer `:

```text
Authorization: Bearer 3|kD8f2...x91
```

:::tip
**Keep the token on your server**, like a password. Reuse it: log in again only when a request answers `Unauthenticated.`
:::
