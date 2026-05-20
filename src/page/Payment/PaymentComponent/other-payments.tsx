import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Payment } from "@/types/payment"
import { CalendarIcon, DollarSign, SquarePen } from "lucide-react"
import { formatPaymentMonth } from "@/utils/formatPaymentMonth"

interface OtherPaymentsProps {
  otherPayments: Payment[]
  onEditPayment?: (payment: Payment) => void
}

export function OtherPayments({ otherPayments, onEditPayment }: OtherPaymentsProps) {
  if (otherPayments.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-1">Other Payments</h2>
        <p className="text-slate-400 text-sm">No Other payments found.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Other Payments</h2>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium tabular-nums">
          {otherPayments.length} {otherPayments.length === 1 ? "record" : "records"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherPayments.map((payment) => (
          <Card
            key={payment.id}
            className="group relative overflow-hidden rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-100 via-white to-orange-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="pt-5 pb-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-1.5 shadow-sm">
                    <DollarSign className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Other
                  </span>
                </div>

                {onEditPayment && (
                  <button
                    type="button"
                    title="Edit Payment"
                    onClick={() => onEditPayment(payment)}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all duration-150"
                  >
                    <SquarePen className="h-5 w-5" />
                  </button>
                )}
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 flex flex-col gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-700 leading-none">
                {payment.amount.toLocaleString("en-BD", { minimumFractionDigits: 2 })} TK
              </p>

              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                <CalendarIcon className="h-3 w-3 text-amber-400 shrink-0" />
                <span title={`Month: ${formatPaymentMonth(payment.month, payment.title)}`}>
                  {new Date(payment.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}