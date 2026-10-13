Changes since the previous version of this documentation. If your integration was built on it, check these:

| Change | What to do |
|---|---|
| `saveShipment`: **`serviceId` is now required** | Send the shipping service's id, from `listShippingServicesDropdown` |
| `saveShipment`: `recipientPhone` is now optional | Nothing; `recipientMobile` is still required |
| Images: `ImageInput.file` is required and is a file upload | Upload the file itself |
| `listShipments`: the `customerId` filter is now a list | Send `[123]` instead of `123` |
| `login`: the answer no longer has `ttl` | Stop asking for `ttl` |
| `Branch`: `state`, `city` and `area` removed | Stop asking for them |
| Dropdowns return the type `DropdownEntry` (was `DropDownEntry`) | Only matters if you named the type in your code |
| Shipment type `CLC` removed | Use one of the [shipment types](/english/codes) |
| Fees `post` and `tax` and `Shipment.createdBy` may be `null` | Handle an empty value |
| Webhooks now also send `shipmentCode` | You can find the shipment by its code |
