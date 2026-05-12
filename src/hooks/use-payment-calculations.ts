"use client"

import { useMemo } from "react"
import type { Payment } from "@/types/payment"
import { months } from "@/constants/months"

export function usePaymentCalculations(payments: Payment[]) {
  return useMemo(() => {
    const paymentsByMonth: Record<string, Payment> = {}
    payments.forEach((payment) => {
      if (payment.month) {
        paymentsByMonth[payment.month] = payment
      }
    })

    const totalMonths = months.length
    const paidMonths = Object.values(paymentsByMonth).filter(
      (payment) => payment && payment.amount > 0
    ).length
    const paidPercentage = Math.round((paidMonths / totalMonths) * 100)
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    const currentMonth = new Date().toLocaleString("default", { month: "long" })
    const nextUnpaidMonth = months.find(
      (month) => !paymentsByMonth[month] && months.indexOf(month) >= months.indexOf(currentMonth),
    )

    const modelTestPayments = payments.filter((payment) => payment.title?.toLowerCase() === "modeltest")
    const otherPayments = payments.filter((payment) => payment.title?.toLowerCase() === "others")
    
    // Calculate total monthly fees - only from paymentsByMonth (one payment per month)
    const totalMonthlyFees = Object.values(paymentsByMonth).reduce((sum, payment) => sum + (payment.amount || 0), 0)

    return {
      paymentsByMonth,
      totalMonths,
      paidMonths,
      paidPercentage,
      totalPaid,
      totalMonthlyFees,
      currentMonth,
      nextUnpaidMonth,
      modelTestPayments,
      otherPayments,
    }
  }, [payments])
}
