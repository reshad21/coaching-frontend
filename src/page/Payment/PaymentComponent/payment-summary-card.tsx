import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Payment } from "@/types/payment";
import { CalendarDays, DollarSign, TrendingUp, BookOpen } from "lucide-react";

interface PaymentSummaryCardProps {
  totalPaid: number;
  totalMonthlyFees: number;
  currentMonth: string;
  paymentsByMonth: Record<string, Payment>;
  modelTestPayments?: Payment[];
  otherPayments?: Payment[];
  admissionFee?: number;
}

export function PaymentSummaryCard({
  totalPaid,
  totalMonthlyFees,
  currentMonth,
  paymentsByMonth,
  modelTestPayments = [],
  otherPayments = [],
  admissionFee = 0,
}: PaymentSummaryCardProps) {
  const isCurrentMonthPaid = !!paymentsByMonth[currentMonth];
  const paidMonthCount = Object.values(paymentsByMonth).filter(
    (payment) => payment && payment.amount > 0
  ).length;
  
  const modelTestTotal = modelTestPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const otherTotal = otherPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const hasOutstandingPayments = modelTestTotal > 0 || otherTotal > 0;
  
  // Total paid WITHOUT admission fee = Monthly + ModelTest + Other
  const totalPaidWithoutAdmission = totalMonthlyFees + modelTestTotal + otherTotal;

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
        {admissionFee > 0 && (
          <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-green-50 border border-green-100 p-1.5">
                <DollarSign className="h-3.5 w-3.5 text-green-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-slate-500">Admission Fee</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700">
              ${admissionFee.toFixed(2)}
            </span>
          </div>
        )}

        {totalMonthlyFees > 0 && (
          <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-slate-500">Total Monthly Fees</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700">
              ${totalMonthlyFees.toFixed(2)}
            </span>
          </div>
        )}

        {paidMonthCount > 0 && (
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
        )}

        {paidMonthCount > 0 && (
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
        )}

        {modelTestTotal > 0 && (
          <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-purple-50 border border-purple-100 p-1.5">
                <BookOpen className="h-3.5 w-3.5 text-purple-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-slate-500">Model Test</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700">
              ${modelTestTotal.toFixed(2)}
            </span>
          </div>
        )}

        {otherTotal > 0 && (
          <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-amber-50 border border-amber-100 p-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-slate-500">Other Payments</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700">
              ${otherTotal.toFixed(2)}
            </span>
          </div>
        )}

        {hasOutstandingPayments && (
          <div className="rounded-lg bg-orange-50/60 border border-orange-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-orange-100 border border-orange-200 p-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-orange-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-orange-600">Outstanding Total</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-orange-600">
              ${(modelTestTotal + otherTotal).toFixed(2)}
            </span>
          </div>
        )}

        {totalPaidWithoutAdmission > 0 && (
          <div className="rounded-lg bg-white/60 border border-blue-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md bg-blue-50 border border-blue-100 p-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-slate-500">Total Paid without admission fee</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700">
              ${totalPaidWithoutAdmission.toFixed(2)}
            </span>
          </div>
        )}

        {totalPaid === 0 && paidMonthCount === 0 && modelTestTotal === 0 && otherTotal === 0 && admissionFee === 0 && (
          <div className="rounded-lg bg-slate-50/60 border border-slate-200 px-4 py-3 text-center">
            <p className="text-xs text-slate-500">No payments recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}