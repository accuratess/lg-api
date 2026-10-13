عند حدوث خطأ يحتوي الرد على قائمة `errors` بدلاً من `data` (أو معها). غالباً تبقى حالة HTTP هي `200`، لذلك **تحقّق دائماً من وجود `errors`**.

```json
{
  "errors": [
    {
      "message": "Validation failed for the field [saveShipment].",
      "extensions": {
        "validation": {
          "input.recipientMobile": ["حقل جوال المستلم مطلوب."]
        }
      }
    }
  ],
  "data": { "saveShipment": null }
}
```

## الأخطاء الشائعة

| الرسالة | السبب | الحل |
|---|---|---|
| `Unauthenticated.` | لا يوجد رمز دخول، أو الرمز لم يعد صالحاً | [سجّل الدخول](/arabic/authentication) من جديد وأعد المحاولة |
| `Validation failed…` | حقل ناقص أو قيمته خاطئة | اقرأ `extensions.validation`: فيها كل حقل وسبب الخطأ |
| `Variable "$input" got invalid value…` | قيمة بنوع خاطئ، أو حقل إلزامي ناقص | راجع أنواع الحقول في قسم Reference |
| `Value "X" does not exist in "…Code" enum` | كود غير معروف | استخدم أحد [الأكواد](/arabic/codes) |
| `Cannot query field "x" on type "Shipment"` | هذا الحقل غير موجود | راجع اسم الحقل في قسم Reference |
| `This action is unauthorized.` | حسابك غير مسموح له بهذا الإجراء | تواصل مع شركة الشحن |

## نصائح

- أرسل `Content-Language: ar` لتصلك الرسائل بالعربية، أو `en` للإنجليزية.
- سجّل قائمة `errors` كاملة عند فشل أي طلب: هذا يسرّع الدعم الفني كثيراً.
