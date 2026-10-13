# Create a shipment

A shipment needs three **ids**: the shipping service, the recipient's zone (city) and subzone (area). Look them up once and save them in your system; they rarely change. Then creating a shipment is a single request.

## 1. Get the shipping services

:::tabs
```graphql title=Query
query Services {
  listShippingServicesDropdown(input: { active: true }) {
    id
    name
  }
}
```
```json title=Response
{
  "data": {
    "listShippingServicesDropdown": [
      { "id": 1, "name": "Standard" },
      { "id": 4, "name": "Same day" }
    ]
  }
}
```
:::

## 2. Get the zones and subzones

The zones the service delivers to:

:::tabs
```graphql title=Query
query Zones($serviceId: Int!) {
  listZonesDropdown(input: { active: true, service: { serviceId: $serviceId } }) {
    id
    name
  }
}
```
```json title=Variables
{ "serviceId": 1 }
```
:::

Then the subzones inside a zone:

:::tabs
```graphql title=Query
query Subzones($zoneId: Int!) {
  listZonesDropdown(input: { active: true, parentId: $zoneId }) {
    id
    name
  }
}
```
```json title=Variables
{ "zoneId": 12 }
```
:::

## 3. Create the shipment

:::tabs
```graphql title=Query
mutation CreateShipment($input: ShipmentInput!) {
  saveShipment(input: $input) {
    id
    code
    trackingUrl
    status { code name }
  }
}
```
```json title=Variables
{
  "input": {
    "serviceId": 1,
    "refNumber": "ORDER-1001",
    "recipientName": "Ahmed Ali",
    "recipientMobile": "01012345678",
    "recipientZoneId": 12,
    "recipientSubzoneId": 140,
    "recipientAddress": "12 Nile St, building 4, floor 2",
    "description": "2 T-shirts",
    "weight": 1.5,
    "piecesCount": 1,
    "price": 250,
    "priceTypeCode": "INCLD",
    "paymentTypeCode": "COLC",
    "openableCode": "Y",
    "notes": "Call before delivery"
  }
}
```
```json title=Response
{
  "data": {
    "saveShipment": {
      "id": 10832354,
      "code": "A12345",
      "trackingUrl": "https://your-company.com/track/A12345",
      "status": { "code": "PKR", "name": "Shipping Request" }
    }
  }
}
```
```js title=JavaScript
const response = await fetch("https://your-company.com:8443/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    query: `mutation ($input: ShipmentInput!) {
      saveShipment(input: $input) { id code trackingUrl }
    }`,
    variables: {
      input: {
        serviceId: 1,
        refNumber: "ORDER-1001",
        recipientName: "Ahmed Ali",
        recipientMobile: "01012345678",
        recipientZoneId: 12,
        recipientSubzoneId: 140,
        recipientAddress: "12 Nile St, building 4, floor 2",
        price: 250,
      },
    },
  }),
});
const { data, errors } = await response.json();
```
```php title=PHP
$response = Http::withToken($token)->post('https://your-company.com:8443/graphql', [
    'query' => 'mutation ($input: ShipmentInput!) { saveShipment(input: $input) { id code trackingUrl } }',
    'variables' => ['input' => [
        'serviceId' => 1,
        'refNumber' => 'ORDER-1001',
        'recipientName' => 'Ahmed Ali',
        'recipientMobile' => '01012345678',
        'recipientZoneId' => 12,
        'recipientSubzoneId' => 140,
        'recipientAddress' => '12 Nile St, building 4, floor 2',
        'price' => 250,
    ]],
]);
$shipment = $response->json('data.saveShipment');
```
:::

Save the `id` and `code`: you'll need them to [track](#track-shipments) the shipment, and every [webhook](#webhooks) includes them.

## Fields

**Required**

| Field | |
|---|---|
| `serviceId` | Shipping service, from step 1 |
| `recipientZoneId`, `recipientSubzoneId` | Zone and subzone, from step 2 |
| `recipientMobile` | Recipient's mobile number |
| `recipientAddress` | Full delivery address |

**Optional, most used**

| Field | |
|---|---|
| `refNumber` | **Your order number.** Recommended: you can search by it |
| `recipientName`, `recipientPhone` | Name and a second number |
| `price` | What the courier collects from the recipient (`0` if prepaid) |
| `priceTypeCode` | `INCLD`: price includes shipping fees · `EXCLD`: fees are added |
| `paymentTypeCode` | `COLC` collect on delivery · `PAID` prepaid · [more](#codes) |
| `typeCode` | `FDP` deliver (default) · `PDP` partial · `PTP` exchange · `RTS` pick up a return |
| `openableCode` | `Y` / `N`: may the recipient open it before paying? |
| `description`, `notes` | What's inside, and notes for the courier |
| `weight`, `piecesCount`, `size` | Kilograms, pieces, `{ length, width, height }` in cm |
| `deliveryDate` | Requested date, `YYYY-MM-DD` |
| `senderName`, `senderMobile`, `senderAddress`, `senderZoneId`, `senderSubzoneId` | Pickup details, if not your account's |

Every field is in the [reference](#type-ShipmentInput).

:::tip
**To change a shipment**, send `saveShipment` again with its `id` and the fields to change. That works until the shipping company starts handling it: the shipment's `editable` field tells you.
:::
