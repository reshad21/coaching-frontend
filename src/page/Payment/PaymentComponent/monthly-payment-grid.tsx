import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { months } from "@/constants/months";
import type { Payment } from "@/types/payment";
import { CalendarIcon, CheckCircle, SquarePen, XCircle } from "lucide-react";

interface MonthlyPaymentGridProps {
  paymentsByMonth: Record<string, Payment>;
  onEditPayment: (month: string, payment?: Payment) => void;
}

export function MonthlyPaymentGrid({
  paymentsByMonth,
  onEditPayment,
}: MonthlyPaymentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {months.map((month) => {
        const payment = paymentsByMonth[month];
        const paid = !!payment && payment.amount > 0;

        return (
          <Card
            key={month}
            className={`group relative overflow-hidden rounded-xl border ${paid ? "border-green-300" : "border-blue-200/70"} bg-gradient-to-br from-blue-100 via-white to-purple-100 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <CardHeader className="pt-5 pb-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center justify-center rounded-lg ${paid ? "bg-gradient-to-br from-green-500 to-green-400" : "bg-slate-400"} p-1.5 shadow-sm`}>
                    {paid ? (
                      <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                    )}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${paid ? "text-green-700" : "text-blue-700"}`}>
                    {month}
                  </span>
                </div>
                <button
                  type="button"
                  title="Edit Payment"
                  onClick={() => onEditPayment(month, payment)}
                  className="rounded-lg p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                >
                  <SquarePen className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex flex-col gap-3">
              {paid ? (
                <p className="text-2xl font-bold tracking-tight text-slate-700 leading-none">
                  {payment.amount.toLocaleString("en-BD", { minimumFractionDigits: 2 })} TK
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg">

                  <span className="text-base font-semibold text-slate-500">No Payment</span>
                  <span className="text-xs text-slate-400">Payment not received for this month</span>
                </div>
              )}
              {paid && (
                <div className="flex items-center gap-1.5 text-xs text-slate-700">
                  <CalendarIcon className="h-3 w-3 text-blue-400 shrink-0" />
                  <span>
                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
