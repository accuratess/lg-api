لاستخدام الـ API **سجّل الدخول مرة واحدة** باسم المستخدم وكلمة المرور، فيصلك **رمز دخول (Token)**. أرسل هذا الرمز مع كل طلب بعد ذلك.

## 1. تسجيل الدخول

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user { id username }
  }
}
```

القيم (Variables):

```json
{
  "input": {
    "username": "store@example.com",
    "password": "your-password"
  }
}
```

الرد:

```json
{
  "data": {
    "login": {
      "token": "3|kD8f2...x91",
      "user": { "id": 812, "username": "store@example.com" }
    }
  }
}
```

## 2. إرسال الرمز

أضفه إلى ترويسة `Authorization` في كل طلب، بعد كلمة `Bearer` ومسافة:

```
Authorization: Bearer 3|kD8f2...x91
```

## معلومات مهمة

- **احفظ الرمز بسرية** مثل كلمة المرور: على الخادم الخاص بك فقط، وليس في صفحة ويب أو تطبيق جوال.
- **أعد استخدامه.** لا تسجّل الدخول قبل كل طلب؛ سجّل الدخول من جديد فقط عندما يرد أي طلب بـ `Unauthenticated` (انظر [الأخطاء](/arabic/errors)).
- قيمة `rememberMe` هي `true` افتراضياً، فيبقى الرمز صالحاً لمدة طويلة.
- اسم المستخدم أو كلمة المرور الخاطئة ترجع خطأً وليس رمزاً.
