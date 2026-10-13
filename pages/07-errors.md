# Errors

A failed request has an `errors` list. The HTTP status is usually still `200`, so **always check for `errors`**.

```json title=Response
{
  "errors": [
    {
      "message": "Validation failed for the field [saveShipment].",
      "extensions": {
        "validation": {
          "input.recipientMobile": ["The recipient mobile field is required."]
        }
      }
    }
  ],
  "data": { "saveShipment": null }
}
```

| Message | What to do |
|---|---|
| `Unauthenticated.` | [Log in](#authentication) again and retry |
| `Validation failed…` | `extensions.validation` lists each wrong field and why |
| `Variable "$input" got invalid value…` | A value has the wrong type, or a required field is missing |
| `Value "X" does not exist in "…" enum` | Use one of the [codes](#codes) |
| `Cannot query field "x"…` | Check the field's name in the [reference](#reference) |
| `This action is unauthorized.` | Your account isn't allowed to: ask your shipping company |

:::tip
Send `Content-Language: ar` to get messages in Arabic. Log the whole `errors` list when a request fails: it makes support much faster.
:::
