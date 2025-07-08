/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PaymentDashboardSkeleton from "@/components/Skleton/PaymentDashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaymentCalculations } from "@/hooks/use-payment-calculations";
import {
  useGetPaymentByIdQuery,
  useUpdatePaymentMutation,
} from "@/redux/api/payment/paymentApi";
import type { Payment } from "@/types/payment";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ModelTestPayments } from "../../PaymentComponent/model-test-payments";
import { MonthlyPaymentGrid } from "../../PaymentComponent/monthly-payment-grid";
import { MonthlyPaymentList } from "../../PaymentComponent/monthly-payment-list";
import { PaymentEditModal } from "../../PaymentComponent/payment-edit-modal";
import { PaymentProgressCard } from "../../PaymentComponent/payment-progress-card";
import { PaymentSummaryCard } from "../../PaymentComponent/payment-summary-card";
import { StudentInfoCard } from "../../PaymentComponent/student-info-card";

export function PaymentDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetPaymentByIdQuery(id);
  const [updatePayment] = useUpdatePaymentMutation();

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(
    undefined
  );

  const payments = data?.data?.Payment || [];
  const studentInfo = data?.data;

  const {
    paymentsByMonth,
    totalMonths,
    paidMonths,
    paidPercentage,
    totalPaid,
    currentMonth,
    nextUnpaidMonth,
    modelTestPayments,
  } = usePaymentCalculations(payments);

  const handleEditPayment = (month: string, payment?: Payment) => {
    setSelectedMonth(month);
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedMonth("");
    setSelectedPayment(undefined);
  };

  const handleSavePayment = async (
    paymentId?: string | null,
    month?: string,
    amount?: number
  ) => {
    try {
      if (paymentId && typeof amount === "number") {
        const payload = {
          id: paymentId,
          data: { amount },
        };

        const res: any = await updatePayment(payload);
        if (res.statusCode === 200) {
          toast.success(res?.data?.message || "payment updated successfully!");
        } else {
          console.log(res?.data?.message);
          console.log(month);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save payment:", error);
    }
  };

  if (isLoading) {
    return <PaymentDashboardSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-8 relative">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-0 flex justify-center items-center text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200 transition rounded-full"
        variant="outline"
        size="icon"
      >
        <ArrowLeft className="w-5 h-5 font-bold" />
      </Button>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Payment Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage payment history for {studentInfo?.firstName}{" "}
          {studentInfo?.lastName}
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
        <PaymentSummaryCard
          totalPaid={totalPaid}
          currentMonth={currentMonth}
          paymentsByMonth={paymentsByMonth}
        />
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
          <MonthlyPaymentGrid
            paymentsByMonth={paymentsByMonth}
            onEditPayment={handleEditPayment}
          />
        </TabsContent>

        <TabsContent value="list">
          <MonthlyPaymentList
            paymentsByMonth={paymentsByMonth}
            onEditPayment={handleEditPayment}
          />
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
  );
}
