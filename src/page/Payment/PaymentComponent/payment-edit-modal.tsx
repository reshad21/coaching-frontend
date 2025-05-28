"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, DollarSign } from "lucide-react"
import type { EditPaymentModalProps } from "@/types/payment"

export function PaymentEditModal({ isOpen, onClose, month, payment, onSave }: EditPaymentModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount.toString())
    } else {
      setAmount("")
    }
  }, [payment, isOpen])

  const handleSave = async () => {
    const numericAmount = Number.parseFloat(amount)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      // Pass payment ID (or null for new payments) along with month and amount
      await onSave(payment?.id || null, month, numericAmount)
      onClose()
    } catch (error) {
      console.error("Failed to save payment:", error)
      alert("Failed to save payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setAmount("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {payment ? "Edit Payment" : "Add Payment"}
          </DialogTitle>
          <DialogDescription>
            {payment ? `Update the payment for ${month}` : `Add a new payment for ${month}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">
              Month
            </Label>
            <div className="col-span-3 flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{month}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* {payment && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm text-muted-foreground">Payment ID</Label>
                <div className="col-span-3 text-sm text-muted-foreground font-mono">{payment.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-sm text-muted-foreground">Current</Label>
                <div className="col-span-3 text-sm text-muted-foreground">
                  ${payment.amount.toFixed(2)} - {new Date(payment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </>
          )} */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : payment ? "Update Payment" : "Add Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
