أهلاً بك! يشرح هذا الدليل كيف ترسل الشحنات إلى أكيوريت من نظامك (متجرك أو نظام ERP أو موقعك)، وكيف تصلك الإشعارات عند تغيّر حالتها.

يمكنك البدء خلال **10 دقائق** تقريباً:

1. [سجّل الدخول](/arabic/authentication) لتحصل على رمز الدخول (Token).
2. [أنشئ شحنة](/arabic/create-a-shipment).
3. [تابعها](/arabic/track-shipments)، أو دعنا [نتصل بنظامك](/arabic/webhooks) عند كل تغيير في حالتها.

## قبل أن تبدأ

تحتاج إلى أمرين من شركة الشحن (الشركة التي تستخدم أكيوريت):

| المطلوب | مثال |
|---|---|
| **عنوان الـ API** | `https://your-company.com:8443/graphql` |
| **اسم مستخدم وكلمة مرور** لحساب العميل الخاص بك | `store@example.com` / `••••••` |

كل الطلبات تُرسل إلى هذا **العنوان الواحد** باستخدام `POST`.

## شكل الطلب

يعتمد الـ API على [GraphQL](https://graphql.org/learn/). إن لم تستخدمها من قبل فلا تقلق: الطلب هو طلب HTTP عادي من نوع `POST` يحمل JSON من جزأين:

- `query`: ما تريد تنفيذه، والحقول التي تريدها في الرد.
- `variables`: القيم التي ترسلها.

```bash
curl https://your-company.com:8443/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "query": "query ($code: String) { shipment(code: $code) { code status { name } } }",
    "variables": { "code": "A12345" }
  }'
```

الرد دائماً JSON داخل `data`:

```json
{
  "data": {
    "shipment": { "code": "A12345", "status": { "name": "قيد التوصيل" } }
  }
}
```

يصلك فقط ما تطلبه من حقول، فاطلب ما تحتاجه فقط.

## الترويسات (Headers)

| الترويسة | القيمة | إلزامية |
|---|---|---|
| `Content-Type` | `application/json` | نعم |
| `Authorization` | `Bearer YOUR_TOKEN` (انظر [المصادقة](/arabic/authentication)) | نعم، ما عدا `login` |
| `Content-Language` | `ar` أو `en`: لغة الأسماء في الرد (الحالات، المناطق…) | لا |

## أدوات تسهّل العمل

- **Postman** أو **Insomnia**: اختر نوع الطلب *GraphQL* والصق الـ query والـ variables من هذا الدليل.
- قسم **Reference** في هذا الموقع يعرض كل الاستعلامات والحقول والأكواد مع أمثلة جاهزة.
