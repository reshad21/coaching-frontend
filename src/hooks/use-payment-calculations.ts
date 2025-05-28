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
    const paidMonths = Object.keys(paymentsByMonth).length
    const paidPercentage = Math.round((paidMonths / totalMonths) * 100)
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    const currentMonth = new Date().toLocaleString("default", { month: "long" })
    const nextUnpaidMonth = months.find(
      (month) => !paymentsByMonth[month] && months.indexOf(month) >= months.indexOf(currentMonth),
    )

    const modelTestPayments = payments.filter((payment) => payment.title === "ModelTest")

    return {
      paymentsByMonth,
      totalMonths,
      paidMonths,
      paidPercentage,
      totalPaid,
      currentMonth,
      nextUnpaidMonth,
      modelTestPayments,
    }
  }, [payments])
}
