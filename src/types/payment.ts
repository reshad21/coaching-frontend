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
