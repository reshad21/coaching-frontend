export type Payment = {
  id: string
  month: string
  amount: number
  createdAt: string
  title?: string
}

export type StudentInfo = {
  firstName: string
  lastName: string
  studentId: string
  batchName: string
  image: string
}

export type PaymentData = {
  data: {
    Payment: Payment[]
  } & StudentInfo
}

export interface EditPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  month: string
  payment?: Payment
  onSave: (paymentId: string | null, month: string, amount: number) => void
}
