export type Payment = {
  id: string
  month: string | null
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
  phone?: string
  guardianName?: string
  className?: string
  schedule?: string
  enrollmentDate?: string
  status?: string
  email?: string
  address?: string
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
  onSave: (paymentId?: string | null, month?: string, amount?: number) => void
}
