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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined);

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
    amount?: number,
  ) => {
    try {
      if (paymentId && typeof amount === "number") {
        const payload = { id: paymentId, data: { amount } };
        const res: any = await updatePayment(payload);
        if (res.statusCode === 200) {
          toast.success(res?.data?.message || "Payment updated successfully!");
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

  if (isLoading) return <PaymentDashboardSkeleton />;

  return (
    // ✅ Increased horizontal padding from p-6 to px-10 py-6 for breathing room
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 px-10 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ✅ Back button now flows in-layout instead of absolute positioning */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            className="flex justify-center items-center text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200 transition rounded-full shrink-0"
            variant="outline"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5 font-bold" />
          </Button>

          {/* ✅ Title moved next to back button — cleaner layout */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Payment Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              View and manage payment history for{" "}
              <span className="font-medium text-foreground">
                {studentInfo?.firstName} {studentInfo?.lastName}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
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

        {/* Payment History Tabs */}
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
    </div>
  );
}