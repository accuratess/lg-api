إنشاء الشحنة طلب واحد فقط (`saveShipment`). الخطوات التي قبله هدفها معرفة **الأرقام (IDs)** التي يحتاجها: خدمة الشحن، ومنطقة المستلم ومنطقته الفرعية. اجلبها مرة واحدة واحفظها، فهي نادراً ما تتغير.

## الخطوة 1: اختر خدمة الشحن

```graphql
query Services {
  listShippingServicesDropdown(input: { active: true }) {
    id
    name
  }
}
```

```json
{
  "data": {
    "listShippingServicesDropdown": [
      {
        "id": 1,
        "name": "عادي"
      },
      {
        "id": 4,
        "name": "نفس اليوم"
      }
    ]
  }
}
```

احفظ `id` الخدمة التي تريدها: هو `serviceId` في الخطوات التالية.

## الخطوة 2: حدّد منطقة المستلم ومنطقته الفرعية

المناطق هي المدن أو المحافظات، والمناطق الفرعية هي الأحياء داخلها. اجلب المناطق التي تغطيها الخدمة:

```graphql
query Zones($serviceId: Int!) {
  listZonesDropdown(input: { active: true, service: { serviceId: $serviceId } }) {
    id
    name
  }
}
```

ثم المناطق الفرعية لمنطقة معيّنة باستخدام `parentId`:

```graphql
query Subzones($zoneId: Int!) {
  listZonesDropdown(input: { active: true, parentId: $zoneId }) {
    id
    name
  }
}
```

> نصيحة: حمّل القائمة كاملة مرة واحدة واربطها بالمدن والأحياء في نظامك.

## الخطوة 3 (اختيارية): اعرف السعر

```graphql
query Fees($input: CalculateShipmentFeesInput!) {
  calculateShipmentFees(input: $input) {
    delivery
    weight
    collection
    total
  }
}
```

```json
{
  "input": {
    "serviceId": 1,
    "recipientZoneId": 12,
    "recipientSubzoneId": 140,
    "weight": 1.5,
    "price": 250
  }
}
```

## الخطوة 4: أنشئ الشحنة

```graphql
mutation CreateShipment($input: ShipmentInput!) {
  saveShipment(input: $input) {
    id
    code
    trackingUrl
    status { code name }
    totalAmount
  }
}
```

```json
{
  "input": {
    "serviceId": 1,
    "refNumber": "ORDER-1001",
    "recipientName": "أحمد علي",
    "recipientMobile": "01012345678",
    "recipientZoneId": 12,
    "recipientSubzoneId": 140,
    "recipientAddress": "12 شارع النيل، عمارة 4، الدور 2",
    "description": "قميصان",
    "weight": 1.5,
    "piecesCount": 1,
    "price": 250,
    "priceTypeCode": "INCLD",
    "paymentTypeCode": "COLC",
    "openableCode": "Y",
    "notes": "الاتصال قبل التوصيل"
  }
}
```

الرد:

```json
{
  "data": {
    "saveShipment": {
      "id": 10832354,
      "code": "A12345",
      "trackingUrl": "https://your-company.com/track/A12345",
      "status": { "code": "PKR", "name": "طلب شحن" },
      "totalAmount": 250
    }
  }
}
```

احفظ `id` و`code`: ستستخدمهما [لمتابعة](/arabic/track-shipments) الشحنة، ويصلانك في كل [إشعار](/arabic/webhooks).

## الحقول

**الحقول الإلزامية:**

| الحقل | معناه |
|---|---|
| `serviceId` | خدمة الشحن، من الخطوة 1 |
| `recipientZoneId` | منطقة المستلم، من الخطوة 2 |
| `recipientSubzoneId` | المنطقة الفرعية للمستلم، من الخطوة 2 |
| `recipientMobile` | رقم جوال المستلم |
| `recipientAddress` | عنوان التوصيل كاملاً |

**أهم الحقول الاختيارية:**

| الحقل | معناه |
|---|---|
| `refNumber` | **رقم الطلب في نظامك.** يُنصح به: يمكنك البحث به لاحقاً |
| `recipientName`، `recipientPhone` | اسم المستلم ورقم ثانٍ له |
| `description`، `notes` | محتوى الشحنة، وتعليمات للمندوب |
| `weight` (كجم)، `piecesCount` | الوزن وعدد القطع |
| `price` | المبلغ الذي يحصّله المندوب من المستلم (`0` إذا كانت مدفوعة مسبقاً) |
| `priceTypeCode` | هل `price` يشمل مصاريف الشحن؟ `INCLD` نعم، `EXCLD` لا |
| `paymentTypeCode` | من يدفع وكيف: `COLC` تحصيل عند التسليم، `PAID` مدفوعة مسبقاً، `CRDT` آجلة… انظر [الأكواد](/arabic/codes) |
| `typeCode` | `FDP` تسليم الطرد كاملاً (الافتراضي)، `PDP` تسليم جزئي، `PTP` استبدال، `RTS` استرجاع طرد. انظر [الأكواد](/arabic/codes) |
| `openableCode` | هل يُسمح للمستلم بفتح الطرد قبل الدفع؟ `Y` / `N` |
| `deliveryDate` | تاريخ التوصيل المطلوب `YYYY-MM-DD` |
| `size` | `{ length, width, height }` بالسنتيمتر |
| `senderName`، `senderMobile`، `senderAddress`، `senderZoneId`، `senderSubzoneId` | بيانات الاستلام منك، إن كانت مختلفة عن بيانات حسابك |

كل الحقول موجودة في **Reference ← Types ← ShipmentInput**.

## تعديل شحنة

أرسل `saveShipment` مرة أخرى مع `id` الشحنة والحقول التي تريد تغييرها. يمكن تعديل الشحنة فقط قبل أن تبدأ شركة الشحن في التعامل معها، ويخبرك الحقل `editable` بذلك.
