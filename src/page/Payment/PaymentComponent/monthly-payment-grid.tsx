import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { months } from "@/constants/months";
import type { Payment } from "@/types/payment";
import { CheckCircle, SquarePen, XCircle } from "lucide-react";

interface MonthlyPaymentGridProps {
  paymentsByMonth: Record<string, Payment>;
}

export function MonthlyPaymentGrid({
  paymentsByMonth,
}: MonthlyPaymentGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {months.map((month) => {
        const payment = paymentsByMonth[month];
        const paid = !!payment;

        return (
          <Card
            key={month}
            className={`relative transition-all hover:shadow-md ${
              paid ? "border-green-200" : ""
            }`}
          >
            <CardHeader
              className={`py-3 ${
                paid ? "bg-green-50" : "bg-muted/50"
              } relative`}
            >
              <SquarePen className="absolute top-2 right-2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition" />
              <CardTitle className="text-base font-medium text-center">
                {month}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-center">
              {paid ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
                  <p className="text-lg font-bold">${payment.amount}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <XCircle className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No Payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
