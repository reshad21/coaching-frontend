"use client"

import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PaymentProps {
  month: string
  paid: boolean
  payment?: {
    amount: number
    createdAt: string
  }
}

export default function PaymentIndicator({ month, paid, payment }: PaymentProps) {
  return (
    <Card
      className={cn(
        "w-24 h-28 transition-all duration-200 hover:shadow-md",
        paid ? "border-2 border-emerald-200" : "border border-muted-foreground/20",
      )}
    >
      <CardContent className="p-3 flex flex-col items-center justify-between h-full">
        <Badge
          variant={paid ? "default" : "outline"}
          className={cn(
            "w-full justify-center font-medium",
            paid ? "bg-emerald-500 hover:bg-emerald-500" : "text-muted-foreground",
          )}
        >
          {month}
        </Badge>

        <div className="flex flex-col items-center justify-center flex-grow py-1">
          {paid ? (
            <div className="text-lg font-bold text-emerald-600">${payment?.amount}</div>
          ) : (
            <div className="text-muted-foreground text-sm italic">Unpaid</div>
          )}
        </div>

        <div className="flex items-center justify-center w-full">
          {paid ? (
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3 w-3" />
              <span>{new Date(payment?.createdAt || "").toLocaleDateString()}</span>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs bg-muted/50 border-0">
              <X className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>No Payment</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
