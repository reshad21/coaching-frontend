import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Payment } from "@/types/payment";
import { CalendarDays, DollarSign, TrendingUp } from "lucide-react";

interface PaymentSummaryCardProps {
  totalPaid: number;
  currentMonth: string;
  paymentsByMonth: Record<string, Payment>;
}

export function PaymentSummaryCard({
  totalPaid,
  currentMonth,
  paymentsByMonth,
}: PaymentSummaryCardProps) {
  const isCurrentMonthPaid = !!paymentsByMonth[currentMonth];
  const paidMonthCount = Object.values(paymentsByMonth).filter(
    (payment) => payment && payment.amount > 0
  ).length;

  return (
    <Card className="h-full relative overflow-hidden rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-100 via-white to-purple-100 shadow-sm flex flex-col">
      <CardHeader className="pt-5 pb-4 px-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-1.5 shadow-sm">
            <DollarSign className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Payment Summary
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0 flex flex-col gap-3 flex-1">
        <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
            </span>
            <span className="text-xs font-medium text-slate-500">Total Paid</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-700">
            ${totalPaid.toFixed(2)}
          </span>
        </div>

        <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
            </span>
            <span className="text-xs font-medium text-slate-500">Paid Months</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-700">
            {paidMonthCount}
          </span>
        </div>

        <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
            </span>
            <span className="text-xs font-medium text-slate-500">Current Month</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isCurrentMonthPaid
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-500 border-red-200"
          }`}>
            {isCurrentMonthPaid ? "Paid" : "Unpaid"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}