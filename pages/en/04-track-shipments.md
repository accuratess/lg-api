## One shipment

By its `code` (or its `id`):

```graphql
query Track($code: String) {
  shipment(code: $code) {
    code
    refNumber
    status { code name }
    deliveryType { code name }
    returnType { code name }
    deliveredOrReturnedDate
    deliveredAmount
    collectedFees
    attempts
    trackingUrl
  }
}
```

```json
{ "code": "A12345" }
```

`status.code` is one of the [status codes](/english/codes); `status.name` is the same status in words, in the language of your `Content-Language` header.

## Many shipments

`listShipments` returns a page of shipments plus `paginatorInfo` to move between pages:

```graphql
query MyShipments($input: ListShipmentsFilterInput, $page: Int) {
  listShipments(input: $input, first: 50, page: $page) {
    paginatorInfo { currentPage lastPage total hasMorePages }
    data {
      code
      refNumber
      status { code name }
    }
  }
}
```

```json
{
  "input": {
    "date": { "fromDate": "2026-10-01", "toDate": "2026-10-13" },
    "statusCode": ["OTD", "DEX", "HTR"]
  },
  "page": 1
}
```

- `first` is the page size: at most **100**.
- Ask for `page: 2`, `3`… while `hasMorePages` is `true`.

## Useful filters

| Filter | Example | Finds |
|---|---|---|
| `code` | `["A12345", "A12346"]` | These shipment codes |
| `refNumber` | `["ORDER-1001"]` | Your own order numbers |
| `search` | `"01012345678"` | Part of the code, or of the recipient's or sender's name or phone |
| `statusCode` | `["DTR"]` | Shipments in these statuses |
| `date` | `{ "fromDate": "2026-10-01", "toDate": "2026-10-13" }` | Created in this period |
| `deliveredOrReturnedDate` | `{ "fromDays": 7 }` | Delivered or returned in the last 7 days |
| `delivered` / `notDelivered` | `true` | Delivered / not delivered yet |
| `recipientZoneId` | `[12]` | Going to these zones |

All filters are listed under **Reference → Types → ListShipmentsFilterInput**.

> Instead of asking every few minutes, use [webhooks](/english/webhooks): we tell you as soon as a status changes.
