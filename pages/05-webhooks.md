# Webhooks

Every time one of your shipments changes status, we send a `POST` to an address on your server. No need to keep asking.

:::steps
1. **Make an address** on your server that accepts a JSON `POST`, like `https://your-store.com/accurate/webhook`.
2. **Send it to your shipping company**: they save it on your account.
3. **Answer `200`** as soon as a request arrives, then update the shipment in your system.
:::

## What you receive

:::tabs
```json title=Body
{
  "shipmentId": 10832354,
  "shipmentCode": "A12345",
  "typeCode": "SHP_STATUS_UPDATE",
  "shipmentStatusCode": "DTR",
  "deliveryTypeCode": "FD",
  "returnTypeCode": null,
  "deliveredAmount": 250,
  "collectedFees": 0,
  "deliveryDate": "2026-10-13",
  "cancellationReasonId": null,
  "notes": "Delivered to the security guard"
}
```
```text title=Headers
POST /accurate/webhook
Content-Type: application/json
X-Client-Id: telegraph
```
```js title=Example handler
// Express
app.post("/accurate/webhook", express.json(), async (req, res) => {
  res.sendStatus(200); // answer first

  const { shipmentCode, shipmentStatusCode } = req.body;
  await orders.updateByShipmentCode(shipmentCode, { status: shipmentStatusCode });
});
```
:::

| Field | |
|---|---|
| `shipmentId`, `shipmentCode` | The shipment, as `saveShipment` returned it |
| `shipmentStatusCode` | **The new status**: see [codes](#codes) |
| `deliveryTypeCode` | When delivered: `FD` fully, `PD` partially |
| `returnTypeCode` | When returned: how the fees were settled, see [codes](#codes) |
| `deliveredAmount` | Collected from the recipient |
| `collectedFees` | Shipping fees collected from the recipient |
| `deliveryDate` | Delivery date |
| `cancellationReasonId` | Why it couldn't be delivered, if given |
| `notes` | The courier's notes |
| `typeCode` | Always `SHP_STATUS_UPDATE` |
| `X-Client-Id` header | Your shipping company's name, if you work with several |

Fields that don't apply to the status are `null`.

:::tip
The same update can arrive twice. Saving the same status again should do no harm.
:::
