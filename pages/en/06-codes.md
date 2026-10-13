## Shipment status (`shipmentStatusCode`, `status.code`)

In the order a shipment usually goes through them:

| Code | Status | What it means |
|---|---|---|
| `PKR` | Shipping request | Created, waiting to be picked up |
| `PKM` | Picking up | A courier is on the way to pick it up |
| `PKH` | Pickup rescheduled | Pickup will be tried again |
| `PKD` | Picked up | Picked up from you |
| `RJCT` | Rejected | The shipping company refused it |
| `RITS` | Received in the warehouse | At the shipping company's warehouse |
| `PRP` | Being prepared | Being packed |
| `PRPD` | Prepared | Packed, ready to go out |
| `BMT` | Transferring between branches | Sent to another branch |
| `BMR` | Received from another branch | Arrived at the branch that delivers it |
| `STD` | Sending to the courier | Being handed to the delivery courier |
| `OTD` | Out for delivery | With the courier on the way to the recipient |
| `DTR` | **Delivered** | Delivered to the recipient (see `deliveryTypeCode`) |
| `DEX` | Delivery failed | Couldn't be delivered this time (see `cancellationReasonId`) |
| `HTR` | Waiting to redeliver | Will be delivered again later |
| `RTS` | Returning to you | Will be returned to the sender |
| `RCV` | Return in the warehouse | The return is back at the warehouse |
| `OTR` | Out for return | On the way back to you |
| `RTRN` | **Returned** | Returned to you (see `returnTypeCode`) |

## Delivery type (`deliveryTypeCode`)

| Code | Meaning |
|---|---|
| `FD` | Fully delivered |
| `PD` | Partially delivered: part of the package was delivered, the rest comes back |

## Return type (`returnTypeCode`)

| Code | Meaning |
|---|---|
| `WODF` | Returned, you pay no fees |
| `WFDF` | Returned, you pay the full shipping fees |
| `WPDF` | Returned, you pay part of the shipping fees |
| `FFC` | Returned, the recipient paid the full shipping fees |
| `FPC` | Returned, the recipient paid part of the shipping fees |
| `PRTS` | Partially returned |

## Shipment type (`typeCode`)

| Code | Meaning |
|---|---|
| `FDP` | Deliver the whole package (default) |
| `PDP` | The recipient may take only part of the package |
| `PTP` | Exchange: deliver a package and take another one back |
| `RTS` | Pick up a package from the recipient and bring it back to you |

## Payment type (`paymentTypeCode`)

| Code | Meaning |
|---|---|
| `COLC` | Collect from the recipient on delivery |
| `PAID` | Prepaid |
| `CASH` | Paid in cash |
| `CRDT` | Postpaid: settled with you later |
| `VISA` | Paid by card |

## Price type (`priceTypeCode`)

| Code | Meaning |
|---|---|
| `INCLD` | `price` already includes the shipping fees |
| `EXCLD` | The shipping fees are added on top of `price` |

## Open package (`openableCode`)

| Code | Meaning |
|---|---|
| `Y` | The recipient may open the package before paying |
| `N` | The recipient may not open the package |
