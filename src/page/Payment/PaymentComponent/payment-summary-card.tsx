import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Payment } from "@/types/payment";
import { CalendarIcon, DollarSign } from "lucide-react";

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
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Total Paid
          </span>
          <span className="text-xl font-bold">${totalPaid.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" /> Current Month
          </span>
          <Badge
            variant={paymentsByMonth[currentMonth] ? "default" : "destructive"}
          >
            {paymentsByMonth[currentMonth] ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
