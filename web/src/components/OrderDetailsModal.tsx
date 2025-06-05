
import { Dialog } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
import {Order} from "@/types";

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "shipped":
        return "primary"
      case "delivered":
        return "success"
      case "cancelled":
        return "danger"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <div className="max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
            <Card variant="bordered" className="p-4">
              <div className="mb-2">
                <span className="text-sm text-gray-500">Order Date:</span>
                <p className="font-medium">{new Date(order.audit.createdAt).toLocaleString()}</p>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <p className="font-medium">{new Date(order.audit.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <p>
                  <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                </p>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
            <Card variant="bordered" className="p-4">
              <div className="mb-2">
                <span className="text-sm text-gray-500">Name:</span>
                <p className="font-medium">{order.recipientName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone:</span>
                <p className="font-medium">{order.phoneNumber}</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
          <Card variant="bordered" className="p-4">
            <p>{`${order.city.name}, ${order.district.name}, ${order.address}`}</p>
          </Card>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${(item.unitPrice * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">${order.totalAmount?.toFixed(2)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </Dialog>
  )
}
