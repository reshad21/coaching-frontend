/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useGetPaymentByIdQuery } from "@/redux/api/payment/paymentApi";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PaymentDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPaymentByIdQuery(id);
  const payments = data?.data?.Payment || [];

  const paymentsByMonth: Record<string, any> = {};

  payments.forEach((payment: any) => {
    if (payment.month) {
      paymentsByMonth[payment.month] = payment;
    }
  });

  return (
    <div className="p-4 md:p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Student Payment Summary</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {months.map((month) => {
            const payment = paymentsByMonth[month];
            return (
              <Card
                key={month}
                className={`rounded-xl border shadow-sm ${
                  payment ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <CardContent className="p-4 space-y-1">
                  <p className="text-lg font-medium">{month}</p>
                  {payment ? (
                    <>
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">Amount:</span> ${payment.amount}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No payment made</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
