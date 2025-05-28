

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetPaymentByIdQuery } from "@/redux/api/payment/paymentApi"
import { useParams } from "react-router-dom"
import { usePaymentCalculations } from "@/hooks/use-payment-calculations"
import { StudentInfoCard } from "../../PaymentComponent/student-info-card"
import { PaymentProgressCard } from "../../PaymentComponent/payment-progress-card"
import { PaymentSummaryCard } from "../../PaymentComponent/payment-summary-card"
import { MonthlyPaymentGrid } from "../../PaymentComponent/monthly-payment-grid"
import { MonthlyPaymentList } from "../../PaymentComponent/monthly-payment-list"
import { ModelTestPayments } from "../../PaymentComponent/model-test-payments"

export function PaymentDashboard() {
  const { id } = useParams()
  const { data, isLoading } = useGetPaymentByIdQuery(id)

  const payments = data?.data?.Payment || []
  const studentInfo = data?.data

  const {
    paymentsByMonth,
    totalMonths,
    paidMonths,
    paidPercentage,
    totalPaid,
    currentMonth,
    nextUnpaidMonth,
    modelTestPayments,
  } = usePaymentCalculations(payments)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
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
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Payment Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage payment history for {studentInfo?.firstName} {studentInfo?.lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StudentInfoCard studentInfo={studentInfo} />
        <PaymentProgressCard
          paidMonths={paidMonths}
          totalMonths={totalMonths}
          paidPercentage={paidPercentage}
          nextUnpaidMonth={nextUnpaidMonth}
        />
        <PaymentSummaryCard totalPaid={totalPaid} currentMonth={currentMonth} paymentsByMonth={paymentsByMonth} />
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Monthly Payment History</h2>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <MonthlyPaymentGrid paymentsByMonth={paymentsByMonth} />
        </TabsContent>

        <TabsContent value="list">
          <MonthlyPaymentList paymentsByMonth={paymentsByMonth} />
        </TabsContent>
      </Tabs>

      <ModelTestPayments modelTestPayments={modelTestPayments} />
    </div>
  )
}
