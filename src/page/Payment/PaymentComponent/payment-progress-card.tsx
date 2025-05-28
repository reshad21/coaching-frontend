import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentProgressCardProps {
  paidMonths: number;
  totalMonths: number;
  paidPercentage: number;
  nextUnpaidMonth: string | undefined;
}

export function PaymentProgressCard({
  paidMonths,
  totalMonths,
  paidPercentage,
  nextUnpaidMonth,
}: PaymentProgressCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Payment Progress</CardTitle>
        <CardDescription>
          {paidMonths} of {totalMonths} months paid
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {paidPercentage}% Complete
          </span>
          <Badge variant={paidPercentage === 100 ? "default" : "outline"}>
            {paidPercentage === 100 ? "Completed" : "In Progress"}
          </Badge>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-sm text-muted-foreground">
          {nextUnpaidMonth
            ? `Next payment due: ${nextUnpaidMonth}`
            : "All payments completed"}
        </p>
      </CardFooter>
    </Card>
  );
}
