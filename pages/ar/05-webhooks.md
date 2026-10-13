الإشعار (Webhook) يعني أننا **نتصل بك**: كلما تغيّرت حالة إحدى شحناتك، يرسل أكيوريت طلب `POST` إلى عنوان على الخادم الخاص بك (**رابط الاستدعاء Callback URL**)، فلا تحتاج إلى السؤال عن التحديثات باستمرار.

## الإعداد

1. جهّز عنواناً على الخادم الخاص بك يستقبل طلبات `POST` بمحتوى JSON، مثل `https://your-store.com/accurate/webhook`.
2. أرسل هذا العنوان إلى شركة الشحن لتحفظه في ربط الحساب الخاص بك.

## ما يصلك

```
POST https://your-store.com/accurate/webhook
Content-Type: application/json
X-Client-Id: telegraph
```

```json
{
  "shipmentId": 10832354,
  "shipmentCode": "A12345",
  "typeCode": "SHP_STATUS_UPDATE",
  "shipmentStatusCode": "DTR",
  "returnTypeCode": null,
  "deliveryTypeCode": "FD",
  "deliveredAmount": 250,
  "collectedFees": 0,
  "deliveryDate": "2026-10-13",
  "cancellationReasonId": null,
  "notes": "تم التسليم لفرد الأمن"
}
```

| الحقل | معناه |
|---|---|
| `shipmentId`، `shipmentCode` | `id` و`code` الشحنة كما رجعا من `saveShipment` |
| `typeCode` | دائماً `SHP_STATUS_UPDATE` عند تغيّر الحالة |
| `shipmentStatusCode` | **الحالة الجديدة**: انظر [أكواد الحالة](/arabic/codes) |
| `deliveryTypeCode` | عند التسليم: `FD` كامل، `PD` جزئي |
| `returnTypeCode` | عند الارتجاع: كيف تمت معالجة المصاريف، انظر [أكواد الارتجاع](/arabic/codes) |
| `deliveredAmount` | المبلغ المحصّل من المستلم |
| `collectedFees` | مصاريف الشحن المحصّلة من المستلم |
| `deliveryDate` | تاريخ التسليم |
| `cancellationReasonId` | سبب تعذّر التسليم، إن وُجد |
| `notes` | ملاحظات المندوب أو الشركة |
| ترويسة `X-Client-Id` | اسم شركة الشحن في أكيوريت، إن كنت تتعامل مع أكثر من شركة |

الحقول التي لا تخص الحالة الحالية قيمتها `null`.

## الرد

- رُد بحالة HTTP **`200`** فور استلام الطلب، ثم نفّذ معالجتك بعد ذلك.
- ابحث عن الشحنة بـ `shipmentId` أو `shipmentCode` واحفظ حالتها الجديدة.
- قد يصل التحديث نفسه أكثر من مرة: حفظ الحالة نفسها مرتين يجب ألا يسبب مشكلة.
