import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Payment } from "@/types/payment"
import { CalendarIcon, DollarSign, SquarePen } from "lucide-react"

interface ModelTestPaymentsProps {
  modelTestPayments: Payment[]
  onEditPayment?: (payment: Payment) => void
}

export function ModelTestPayments({ modelTestPayments, onEditPayment }: ModelTestPaymentsProps) {
  if (modelTestPayments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Model Test Payments</h2>
        <p className="text-muted-foreground">No Model Test payments found.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Model Test Payments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modelTestPayments.map((payment) => (
          <Card key={payment.id} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Model Test
                {onEditPayment && (
                  <span title="Edit Payment">
                    <SquarePen
                      className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition ml-2"
                      onClick={() => onEditPayment(payment)}
                    />
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Amount
                </span>
                <span className="text-xl font-bold">${payment.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Date
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
