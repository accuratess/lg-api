# Getting started

Send shipments to your shipping company straight from your store, ERP or website, and know the moment their status changes.

:::steps
1. **[Log in](#authentication)** once to get a token.
2. **[Create a shipment](#create-a-shipment)** with one request.
3. **[Get updates](#webhooks)**: we call your server on every status change, or you [ask any time](#track-shipments).
:::

## What you need

Ask your shipping company for:

| | Example |
|---|---|
| **API address** | `https://your-company.com:8443/graphql` |
| **Username and password** of your customer account | `store@example.com` |

## How requests work

Every request is a `POST` to that one address, with a JSON body. The body says **what you want to do** (`query`) and **the values** you send (`variables`). The API uses [GraphQL](https://graphql.org/learn/), but you don't need to know it: copy the examples in this guide.

:::tabs
```bash title=cURL
curl https://your-company.com:8443/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query ($code: String) { shipment(code: $code) { code status { name } } }",
    "variables": { "code": "A12345" }
  }'
```
```json title=Response
{
  "data": {
    "shipment": { "code": "A12345", "status": { "name": "Out To Deliver" } }
  }
}
```
:::

The answer is always JSON. You get back exactly the fields you asked for.

## Headers

| Header | Value | |
|---|---|---|
| `Content-Type` | `application/json` | Required |
| `Authorization` | `Bearer YOUR_TOKEN` | Required, except to log in |
| `Content-Language` | `en` or `ar`, the language of status and zone names | Optional |

:::tip
**Postman** and **Insomnia** make testing easy: choose *GraphQL* as the body type, then paste the query and the variables from this guide.
:::
