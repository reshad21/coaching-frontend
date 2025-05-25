/* eslint-disable @typescript-eslint/no-explicit-any */

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPaymentByIdQuery } from "@/redux/api/payment/paymentApi";
import { CalendarIcon, CheckCircle, DollarSign, XCircle } from "lucide-react";
import { useParams } from "react-router-dom";

type Payment = {
  month: string;
  amount: number;
  createdAt: string;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PaymentDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPaymentByIdQuery(id);

  const payments: Payment[] = data?.data?.Payment || [];

  const modelTestPayments = payments.filter(
    (payment: any) => payment.title === "ModelTest"
  );

  const studentInfo = data?.data;

  console.log("line 62==>", studentInfo);

  const paymentsByMonth: Record<string, Payment> = {};
  payments.forEach((payment) => {
    if (payment.month) {
      paymentsByMonth[payment.month] = payment;
    }
  });

  const totalMonths = months.length;
  const paidMonths = Object.keys(paymentsByMonth).length;
  const paidPercentage = Math.round((paidMonths / totalMonths) * 100);
  const totalPaid = payments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const nextUnpaidMonth = months.find(
    (month) =>
      !paymentsByMonth[month] &&
      months.indexOf(month) >= months.indexOf(currentMonth)
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Payment Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage payment history for {studentInfo?.firstName}{" "}
          {studentInfo?.lastName}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[180px]" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="">
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-semibold">
                    <img
                      src={`http://localhost:3000${studentInfo.image}`}
                      alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
                      className="size-10 rounded-sm object-cover"
                    />
                  </div>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">
                    {studentInfo.firstName} {studentInfo.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {studentInfo.studentId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Batch: {studentInfo.batchName}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Payment Progress
                </CardTitle>
                <CardDescription>
                  {paidMonths} of {totalMonths} months paid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {paidPercentage}% Complete
                  </span>
                  <Badge
                    variant={paidPercentage === 100 ? "default" : "outline"}
                  >
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

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Total Paid
                  </span>
                  <span className="text-xl font-bold">
                    ${totalPaid.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Current Month
                  </span>
                  <Badge
                    variant={
                      paymentsByMonth[currentMonth] ? "default" : "destructive"
                    }
                  >
                    {paymentsByMonth[currentMonth] ? "Paid" : "Unpaid"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Monthly Payment History</h2>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {months.map((month) => {
                  const payment = paymentsByMonth[month];
                  const paid = !!payment;
                  return (
                    <Card
                      key={month}
                      className={`transition-all hover:shadow-md ${
                        paid ? "border-green-200" : ""
                      }`}
                    >
                      <CardHeader
                        className={`py-3 ${
                          paid ? "bg-green-50" : "bg-muted/50"
                        }`}
                      >
                        <CardTitle className="text-base font-medium text-center">
                          {month}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 text-center">
                        {paid ? (
                          <div className="space-y-2">
                            <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
                            <p className="text-lg font-bold">
                              ${payment.amount}
                            </p>
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
            </TabsContent>

            <TabsContent value="list">
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
                                  {new Date(
                                    payment.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="font-semibold"
                                >
                                  ${payment.amount}
                                </Badge>
                              </>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground"
                              >
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
            </TabsContent>
          </Tabs>

          {/* Model Test Payments */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Model Test Payments</h2>
            {modelTestPayments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modelTestPayments.map((payment: any) => (
                  <Card key={payment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Model Test
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" /> Amount
                        </span>
                        <span className="text-xl font-bold">
                          ${payment.amount.toFixed(2)}
                        </span>
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
            ) : (
              <p className="text-muted-foreground">
                No Model Test payments found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentDetails;
