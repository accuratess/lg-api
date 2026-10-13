## شحنة واحدة

باستخدام `code` الشحنة (أو `id`):

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

`status.code` أحد [أكواد الحالة](/arabic/codes)، و`status.name` هو اسم الحالة نفسها باللغة المحددة في ترويسة `Content-Language`.

## عدة شحنات

يرجع `listShipments` صفحة من الشحنات ومعها `paginatorInfo` للتنقل بين الصفحات:

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

- `first` هو عدد الشحنات في الصفحة: **100** كحد أقصى.
- اطلب `page: 2` ثم `3`… ما دام `hasMorePages` يساوي `true`.

## أهم عوامل التصفية

| عامل التصفية | مثال | النتيجة |
|---|---|---|
| `code` | `["A12345", "A12346"]` | الشحنات بهذه الأكواد |
| `refNumber` | `["ORDER-1001"]` | بأرقام الطلبات في نظامك |
| `search` | `"01012345678"` | جزء من الكود، أو من اسم أو هاتف المستلم أو الراسل |
| `statusCode` | `["DTR"]` | الشحنات في هذه الحالات |
| `date` | `{ "fromDate": "2026-10-01", "toDate": "2026-10-13" }` | المُنشأة في هذه الفترة |
| `deliveredOrReturnedDate` | `{ "fromDays": 7 }` | المُسلّمة أو المُرتجعة خلال آخر 7 أيام |
| `delivered` / `notDelivered` | `true` | المُسلّمة / غير المُسلّمة بعد |
| `recipientZoneId` | `[12]` | المتجهة لهذه المناطق |

كل عوامل التصفية موجودة في **Reference ← Types ← ListShipmentsFilterInput**.

> بدلاً من السؤال كل بضع دقائق، استخدم [الإشعارات](/arabic/webhooks): نخبرك فور تغيّر الحالة.
