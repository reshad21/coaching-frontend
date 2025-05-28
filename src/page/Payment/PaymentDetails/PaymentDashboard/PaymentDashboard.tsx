"use client"

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetPaymentByIdQuery } from "@/redux/api/payment/paymentApi"
import { useParams } from "react-router-dom"
import { usePaymentCalculations } from "@/hooks/use-payment-calculations"
import type { Payment } from "@/types/payment"
import { StudentInfoCard } from "../../PaymentComponent/student-info-card"
import { PaymentProgressCard } from "../../PaymentComponent/payment-progress-card"
import { PaymentSummaryCard } from "../../PaymentComponent/payment-summary-card"
import { MonthlyPaymentGrid } from "../../PaymentComponent/monthly-payment-grid"
import { MonthlyPaymentList } from "../../PaymentComponent/monthly-payment-list"
import { ModelTestPayments } from "../../PaymentComponent/model-test-payments"
import { PaymentEditModal } from "../../PaymentComponent/payment-edit-modal"

export function PaymentDashboard() {
  const { id } = useParams()
  const { data, isLoading } = useGetPaymentByIdQuery(id)

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined)

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

  const handleEditPayment = (month: string, payment?: Payment) => {
    console.log("Edit payment clicked:", { month, payment })
    console.log("Payment ID:", payment?.id || "No payment ID (new payment)")

    setSelectedMonth(month)
    setSelectedPayment(payment)
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setSelectedMonth("")
    setSelectedPayment(undefined)
  }

  const handleSavePayment = async (paymentId: string | null, month: string, amount: number) => {
    console.log("Saving payment with data:", {
      paymentId,
      month,
      amount,
      studentId: id,
      isUpdate: !!paymentId,
    })

    try {
      if (paymentId) {
        // Update existing payment using payment ID
        console.log("Updating existing payment with ID:", paymentId)

        // TODO: Implement your update payment API call
        // Example:
        // await updatePaymentMutation({
        //   id: paymentId,
        //   amount,
        //   month
        // }).unwrap()
      } else {
        // Create new payment for the student
        console.log("Creating new payment for student ID:", id)

        // TODO: Implement your create payment API call
        // Example:
        // await createPaymentMutation({
        //   studentId: id,
        //   month,
        //   amount
        // }).unwrap()
      }

      // TODO: Refetch data or update cache after successful save
      // refetch() or invalidate cache

      console.log("Payment saved successfully!")
      handleCloseModal()
    } catch (error) {
      console.error("Failed to save payment:", error)
      throw error // Re-throw to let modal handle the error
    }
  }

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
          <MonthlyPaymentGrid paymentsByMonth={paymentsByMonth} onEditPayment={handleEditPayment} />
        </TabsContent>

        <TabsContent value="list">
          <MonthlyPaymentList paymentsByMonth={paymentsByMonth} onEditPayment={handleEditPayment} />
        </TabsContent>
      </Tabs>

      <ModelTestPayments modelTestPayments={modelTestPayments} />

      <PaymentEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        month={selectedMonth}
        payment={selectedPayment}
        onSave={handleSavePayment}
      />
    </div>
  )
}
