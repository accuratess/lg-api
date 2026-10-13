When something goes wrong the answer has an `errors` list instead of (or next to) `data`. The HTTP status is usually still `200`, so **always check for `errors`**.

```json
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

## Common errors

| Message | Why | What to do |
|---|---|---|
| `Unauthenticated.` | No token, or the token is no longer valid | [Log in](/english/authentication) again and retry |
| `Validation failed…` | A field is missing or wrong | Read `extensions.validation`: it lists every field and what's wrong |
| `Variable "$input" got invalid value…` | A value has the wrong type, or a required field is missing | Check the field types in the Reference |
| `Value "X" does not exist in "…Code" enum` | An unknown code | Use one of the [codes](/english/codes) |
| `Cannot query field "x" on type "Shipment"` | That field doesn't exist | Check the field name in the Reference |
| `This action is unauthorized.` | Your account isn't allowed to do this | Ask your shipping company |

## Tips

- Send `Content-Language: ar` to get the messages in Arabic, or `en` for English.
- Log the whole `errors` list when a request fails: it makes support much faster.
