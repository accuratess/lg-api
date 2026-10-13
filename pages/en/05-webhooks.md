A webhook lets **us call you**: every time one of your shipments changes status, Accurate sends a `POST` request to an address on your server (your **callback URL**). You don't need to keep asking for updates.

## Set it up

1. Make an address on your server that accepts `POST` requests with a JSON body, for example `https://your-store.com/accurate/webhook`.
2. Give that address to your shipping company. They save it on your customer integration.

## What you receive

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
  "notes": "Delivered to the security guard"
}
```

| Field | Meaning |
|---|---|
| `shipmentId`, `shipmentCode` | The shipment's `id` and `code`, as returned by `saveShipment` |
| `typeCode` | Always `SHP_STATUS_UPDATE` for a status change |
| `shipmentStatusCode` | The **new status**: see [status codes](/english/codes) |
| `deliveryTypeCode` | When delivered: `FD` fully, `PD` partially |
| `returnTypeCode` | When returned: how the fees were handled, see [return codes](/english/codes) |
| `deliveredAmount` | The amount collected from the recipient |
| `collectedFees` | The shipping fees collected from the recipient |
| `deliveryDate` | The delivery date |
| `cancellationReasonId` | Why it couldn't be delivered, when there is a reason |
| `notes` | The courier's or the company's notes |
| Header `X-Client-Id` | The shipping company's name in Accurate, if you work with more than one |

Fields that don't apply to the status are `null`.

## Answering

- Answer with HTTP **`200`** as soon as you have received the request. Do your own processing afterwards.
- Find the shipment by `shipmentId` or `shipmentCode`, and save the new status.
- The same update can arrive more than once: saving the same status twice should do no harm.
