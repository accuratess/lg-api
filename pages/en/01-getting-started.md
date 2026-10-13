Welcome! This guide shows you how to send shipments to Accurate from your own system (store, ERP, website) and get notified when their status changes.

You can be up and running in about **10 minutes**:

1. [Log in](/english/authentication) to get an access token.
2. [Create a shipment](/english/create-a-shipment).
3. [Track it](/english/track-shipments), or let us [call your system](/english/webhooks) every time its status changes.

## Before you start

You need two things from your shipping company (the company that uses Accurate):

| What | Example |
|---|---|
| **API address** | `https://your-company.com:8443/graphql` |
| **A username and password** for your customer account | `store@example.com` / `••••••` |

Every request goes to that **one address**, with `POST`.

## How a request looks

The API uses [GraphQL](https://graphql.org/learn/). If you have never used it, don't worry: a request is a normal HTTP `POST` with a JSON body that has two parts:

- `query`: what you want to do, and which fields you want back.
- `variables`: the values you send.

```bash
curl https://your-company.com:8443/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query ($code: String) { shipment(code: $code) { code status { name } } }",
    "variables": { "code": "A12345" }
  }'
```

The answer is always JSON, inside `data`:

```json
{
  "data": {
    "shipment": { "code": "A12345", "status": { "name": "Out To Deliver" } }
  }
}
```

You only get back the fields you ask for, so ask only for what you need.

## Headers

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer YOUR_TOKEN` (see [Authentication](/english/authentication)) | Yes, except for `login` |
| `Content-Language` | `en` or `ar`: the language of names in the answer (statuses, zones…) | No |

## Tools that make it easier

- **Postman** or **Insomnia**: choose *GraphQL* as the body type and paste the query and variables from this guide.
- The **Reference** section of this site lists every query, field and code, with ready-made examples.
