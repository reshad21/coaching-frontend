import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { months } from "@/constants/months";
import type { Payment } from "@/types/payment";
import { CheckCircle, XCircle } from "lucide-react";

interface MonthlyPaymentListProps {
  paymentsByMonth: Record<string, Payment>;
}

export function MonthlyPaymentList({
  paymentsByMonth,
}: MonthlyPaymentListProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {months.map((month) => {
            const payment = paymentsByMonth[month];
            const paid = !!payment;

            return (
              <div
                key={month}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  {paid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium">{month}</span>
                </div>
                <div className="flex items-center gap-4">
                  {paid ? (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="font-semibold">
                        ${payment.amount}
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Unpaid
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
