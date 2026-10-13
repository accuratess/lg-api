Creating a shipment takes one request (`saveShipment`). The steps before it only look up the **IDs** that request needs: the shipping service and the recipient's zone and subzone. Look them up once and keep them; they rarely change.

## Step 1: Pick a shipping service

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
        "name": "Standard"
      },
      {
        "id": 4,
        "name": "Same day"
      }
    ]
  }
}
```

Keep the `id` of the service you want: it's the `serviceId` below.

## Step 2: Find the recipient's zone and subzone

Zones are cities or governorates; subzones are the areas inside them. Get the zones the service delivers to:

```graphql
query Zones($serviceId: Int!) {
  listZonesDropdown(input: { active: true, service: { serviceId: $serviceId } }) {
    id
    name
  }
}
```

Then the subzones of one zone, with `parentId`:

```graphql
query Subzones($zoneId: Int!) {
  listZonesDropdown(input: { active: true, parentId: $zoneId }) {
    id
    name
  }
}
```

> Tip: download the whole list once and map it to the cities and areas in your own system.

## Step 3 (optional): Check the price

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

## Step 4: Create the shipment

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

Answer:

```json
{
  "data": {
    "saveShipment": {
      "id": 10832354,
      "code": "A12345",
      "trackingUrl": "https://your-company.com/track/A12345",
      "status": { "code": "PKR", "name": "Shipping Request" },
      "totalAmount": 250
    }
  }
}
```

Save the `id` and `code`: you'll use them to [track](/english/track-shipments) the shipment, and they are in every [webhook](/english/webhooks).

## The fields

**Required:**

| Field | What it is |
|---|---|
| `serviceId` | The shipping service, from step 1 |
| `recipientZoneId` | The recipient's zone, from step 2 |
| `recipientSubzoneId` | The recipient's subzone, from step 2 |
| `recipientMobile` | The recipient's mobile number |
| `recipientAddress` | The full delivery address |

**Most used optional fields:**

| Field | What it is |
|---|---|
| `refNumber` | **Your own order number.** Recommended: you can search by it later |
| `recipientName`, `recipientPhone` | Recipient's name and a second number |
| `description`, `notes` | What's inside, and instructions for the courier |
| `weight` (kg), `piecesCount` | Weight and number of pieces |
| `price` | The amount the courier collects from the recipient (`0` if prepaid) |
| `priceTypeCode` | Does `price` include the shipping fees? `INCLD` yes, `EXCLD` no |
| `paymentTypeCode` | Who pays and how: `COLC` collect on delivery, `PAID` prepaid, `CRDT` postpaid… see [Codes](/english/codes) |
| `typeCode` | `FDP` deliver the whole package (default), `PDP` partial delivery, `PTP` exchange, `RTS` pick up a return. See [Codes](/english/codes) |
| `openableCode` | May the recipient open the package before paying? `Y` / `N` |
| `deliveryDate` | Requested delivery date, `YYYY-MM-DD` |
| `size` | `{ length, width, height }` in cm |
| `senderName`, `senderMobile`, `senderAddress`, `senderZoneId`, `senderSubzoneId` | Pickup details, if different from your account's |

All fields are listed under **Reference → Types → ShipmentInput**.

## Updating a shipment

Send `saveShipment` again with the shipment's `id` and the fields you want to change. A shipment can only be changed while the shipping company hasn't started handling it: the `editable` field tells you.
