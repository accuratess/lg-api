# Codes

## Shipment status

In the order a shipment usually goes through them.

| Code | Status | Meaning |
|---|---|---|
| `PKR` | Shipping request | Created, waiting for pickup |
| `PKM` | Picking up | A courier is on the way to pick it up |
| `PKH` | Pickup rescheduled | Pickup will be tried again |
| `PKD` | Picked up | Picked up from you |
| `RJCT` | Rejected | Refused by the shipping company |
| `RITS` | In the warehouse | At the shipping company's warehouse |
| `PRP` | Being prepared | Being packed |
| `PRPD` | Prepared | Ready to go out |
| `BMT` | Sent to another branch | Moving between branches |
| `BMR` | Arrived at the branch | At the branch that delivers it |
| `STD` | Handing to courier | Being given to the delivery courier |
| `OTD` | Out for delivery | On the way to the recipient |
| `DTR` | **Delivered** | See `deliveryTypeCode` |
| `DEX` | Delivery failed | Not delivered this time, see `cancellationReasonId` |
| `HTR` | Waiting to redeliver | Will be delivered again later |
| `RTS` | Returning | Will come back to you |
| `RCV` | Return in the warehouse | Back at the warehouse |
| `OTR` | Out for return | On the way back to you |
| `RTRN` | **Returned** | Back with you, see `returnTypeCode` |

## Delivery type

| Code | |
|---|---|
| `FD` | Fully delivered |
| `PD` | Partially delivered: the rest comes back |

## Return type

| Code | |
|---|---|
| `WODF` | Returned, you pay no fees |
| `WFDF` | Returned, you pay the full shipping fees |
| `WPDF` | Returned, you pay part of the shipping fees |
| `FFC` | Returned, the recipient paid the full shipping fees |
| `FPC` | Returned, the recipient paid part of the shipping fees |
| `PRTS` | Partially returned |

## Shipment type

| Code | |
|---|---|
| `FDP` | Deliver the whole package (default) |
| `PDP` | The recipient may keep only part of it |
| `PTP` | Exchange: deliver one package, bring another back |
| `RTS` | Pick up a package from the recipient for you |

## Payment type

| Code | |
|---|---|
| `COLC` | Collect from the recipient on delivery |
| `PAID` | Prepaid |
| `CASH` | Paid in cash |
| `CRDT` | Postpaid, settled with you later |
| `VISA` | Paid by card |

## Price type and open package

| Code | |
|---|---|
| `INCLD` | `price` includes the shipping fees |
| `EXCLD` | Shipping fees are added to `price` |
| `Y` | The recipient may open the package before paying |
| `N` | The recipient may not open it |
