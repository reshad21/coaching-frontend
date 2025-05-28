"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, SquarePen, XCircle } from "lucide-react"
import type { Payment } from "@/types/payment"
import { months } from "@/constants/months"

interface MonthlyPaymentListProps {
  paymentsByMonth: Record<string, Payment>
  onEditPayment: (month: string, payment?: Payment) => void
}

export function MonthlyPaymentList({ paymentsByMonth, onEditPayment }: MonthlyPaymentListProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {months.map((month) => {
            const payment = paymentsByMonth[month]
            const paid = !!payment

            return (
              <div key={month} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
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
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="font-semibold">
                        ${payment.amount}
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Unpaid
                    </Badge>
                  )}
                  <SquarePen
                    className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition ml-2"
                    onClick={() => onEditPayment(month, payment)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
