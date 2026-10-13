# What changed

If your integration follows an older version of these docs:

| Change | What to do |
|---|---|
| **`serviceId` is required** in `saveShipment` | Send a service id from `listShippingServicesDropdown` |
| `recipientPhone` is optional | Nothing: `recipientMobile` is still required |
| `customerId` in `listShipments` is a list | Send `[123]` instead of `123` |
| `ImageInput.file` is a required file upload | Upload the file itself |
| `ttl` removed from `login` | Stop asking for it |
| `state`, `city`, `area` removed from `Branch` | Stop asking for them |
| Shipment type `CLC` removed | Use another [shipment type](#codes) |
| `ShipmentFees.post`, `tax` and `Shipment.createdBy` may be `null` | Handle an empty value |
| Webhooks also send `shipmentCode` | Find the shipment by its code |
