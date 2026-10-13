# Track shipments

:::tip
**Prefer [webhooks](#webhooks)**: we tell you as soon as a status changes, so you don't have to ask.
:::

## One shipment

:::tabs
```graphql title=Query
query Track($code: String) {
  shipment(code: $code) {
    code
    refNumber
    status { code name }
    deliveredOrReturnedDate
    deliveredAmount
    trackingUrl
  }
}
```
```json title=Variables
{ "code": "A12345" }
```
:::

`status.code` is one of the [status codes](#codes); `status.name` is its name in the `Content-Language` you asked for.

## Many shipments

:::tabs
```graphql title=Query
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
```json title=Variables
{
  "input": {
    "date": { "fromDate": "2026-10-01", "toDate": "2026-10-13" },
    "statusCode": ["OTD", "DEX", "HTR"]
  },
  "page": 1
}
```
:::

Up to **100** per page (`first`). Ask for the next `page` while `hasMorePages` is `true`.

## Filters

| Filter | Example | Finds |
|---|---|---|
| `code` | `["A12345"]` | These shipment codes |
| `refNumber` | `["ORDER-1001"]` | Your order numbers |
| `search` | `"01012345678"` | Part of the code, or a recipient's or sender's name or phone |
| `statusCode` | `["DTR"]` | In these [statuses](#codes) |
| `date` | `{ "fromDate": "2026-10-01" }` | Created in this period |
| `deliveredOrReturnedDate` | `{ "fromDays": 7 }` | Delivered or returned in the last 7 days |
| `delivered`, `notDelivered` | `true` | Delivered, or not yet |

All filters are in the [reference](#type-ListShipmentsFilterInput).
