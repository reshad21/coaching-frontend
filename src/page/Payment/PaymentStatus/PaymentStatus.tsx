/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react"

import SelectBatch from "@/components/Batch/SelectBatch"
import SearchInputField from "@/components/CommonSearch/SearchInputField"
import Loading from "@/components/Loading"
import SelectStudentClass from "@/components/studentClass/SelectStudentClass"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import studentImage from "../../../assets/default.jpg"
import { ChevronsRight, CreditCard, Eye, Filter, FileText, SearchX, Users, X } from "lucide-react"
import { Link } from "react-router-dom"

const PaymentStatus = () => {
  const [search, setSearch] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectClass, setSelectedClass] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("unpaid")
  const [isModelTestModalOpen, setIsModelTestModalOpen] = useState(false)

  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [{ name: "limit", value: 99999 }]

    if (search) params.push({ name: "search", value: search })
    if (selectedBatch) params.push({ name: "batchName", value: selectedBatch })
    if (selectClass) params.push({ name: "className", value: selectClass })

    return params
  }, [search, selectedBatch, selectClass])

  const { data: students, isLoading } = useGetAllStudentQuery(queryParams)
  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const allStudents = useMemo(() => students?.data ?? [], [students?.data])

  const unpaidModelTestStudents = useMemo(() => {
    return allStudents.filter((student: any) => {
      const modelTestPayments = (student?.Payment || []).filter(
        (payment: any) => payment.title?.toLowerCase() === "modeltest",
      )
      return modelTestPayments.length === 0
    })
  }, [allStudents])

  const paidModelTestStudents = useMemo(() => {
    return allStudents.filter((student: any) => {
      const modelTestPayments = (student?.Payment || []).filter(
        (payment: any) => payment.title?.toLowerCase() === "modeltest",
      )
      return modelTestPayments.length > 0
    })
  }, [allStudents])

  const visibleModelTestStudents = useMemo(() => {
    if (paymentStatus === "paid") return paidModelTestStudents
    if (paymentStatus === "unpaid") return unpaidModelTestStudents
    return allStudents
  }, [allStudents, paidModelTestStudents, paymentStatus, unpaidModelTestStudents])

  const summaryStats = useMemo(() => {
    let currentMonthPaid = 0
    let modelTestPaid = 0

    allStudents.forEach((student: any) => {
      const hasPaidCurrentMonth = student?.Payment?.some((payment: any) => payment.month === currentMonth)
      if (hasPaidCurrentMonth) currentMonthPaid += 1

      const hasModelTestPayment = student?.Payment?.some(
        (payment: any) => payment.title?.toLowerCase() === "modeltest",
      )
      if (hasModelTestPayment) modelTestPaid += 1
    })

    return {
      total: allStudents.length,
      currentMonthPaid,
      currentMonthUnpaid: allStudents.length - currentMonthPaid,
      modelTestPaid,
      modelTestUnpaid: unpaidModelTestStudents.length,
    }
  }, [allStudents, currentMonth, unpaidModelTestStudents.length])

  const hasActiveFilters = Boolean(search || selectedBatch || selectClass || paymentStatus !== "unpaid")

  const handleDownloadPdf = () => {
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    pdf.setFillColor(15, 23, 42)
    pdf.rect(0, 0, pageWidth, 28, "F")

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.text("Model Test Payment Status", 14, 12)

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Generated: ${date}`, 14, 20)
    pdf.text(
      `Status: ${paymentStatus === "paid" ? "Paid" : paymentStatus === "unpaid" ? "Unpaid" : "All"}`,
      pageWidth - 14,
      20,
      { align: "right" },
    )

    pdf.setTextColor(15, 23, 42)
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Total Records: ${visibleModelTestStudents.length}`, 14, 38)

    const rows = visibleModelTestStudents.map((student: any, index: number) => {
      const modelTestPayments = (student?.Payment || []).filter(
        (payment: any) => payment.title?.toLowerCase() === "modeltest",
      )
      const isPaid = modelTestPayments.length > 0

      return [
        String(index + 1),
        `${student.firstName || ""} ${student.lastName || ""}`.trim() || "-",
        student.studentId || "-",
        student.Batch?.batchName || student.batchName || "-",
        student.className || "-",
        student.phone || "-",
        isPaid ? "Paid" : "Unpaid",
      ]
    })

    autoTable(pdf, {
      startY: 44,
      head: [["SL", "Name", "Std ID", "Batch", "Class", "Phone", "Status"]],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 2,
        valign: "middle",
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didDrawPage: () => {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 116, 139)
        pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth / 2, pageHeight - 8, { align: "center" })
      },
    })

    pdf.save(`model-test-payment-status-${paymentStatus || "all"}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <span>Dashboard</span>
            <ChevronsRight className="mx-2 h-4 w-4" />
            <span>Payment Management</span>
            <ChevronsRight className="mx-2 h-4 w-4" />
            <span className="text-slate-700">Model Test Status</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl">Model Test Payment Status</h1>
              <p className="mt-1 text-slate-700">Review students who still have no model test payment record.</p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
              <Button variant="primaryGradient" className="w-full sm:w-fit" onClick={handleDownloadPdf}>
                Download PDF
              </Button>
              <Button variant="primaryGradient" className="w-full sm:w-fit" onClick={() => setIsModelTestModalOpen(true)}>
                View unpaid model test data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Total Students</p>
                  <p className="text-2xl font-bold text-slate-700">{summaryStats.total}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Model Test Paid</p>
                  <p className="text-2xl font-bold text-emerald-600">{summaryStats.modelTestPaid}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <button type="button" className="w-full text-left" onClick={() => setIsModelTestModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Model Test Unpaid</p>
                    <p className="text-2xl font-bold text-rose-600">{summaryStats.modelTestUnpaid}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                    <SearchX className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Current Month Pending</p>
                  <p className="text-2xl font-bold text-red-600">{summaryStats.currentMonthUnpaid}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
              <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
              <SelectStudentClass value={selectClass} onChange={setSelectedClass} />
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="h-10 w-full border-slate-200">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setSearch("")
                  setSelectedBatch("")
                  setSelectedClass("")
                  setPaymentStatus("unpaid")
                }}
                variant="primaryGradient"
                className="w-full px-3 text-sm sm:w-fit sm:px-4 sm:text-base"
                disabled={!hasActiveFilters}
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 border-t pt-2">
                <span className="text-sm font-medium text-slate-700">Active filters:</span>
                {search && <Badge variant="secondary">Search: {search}</Badge>}
                {selectedBatch && <Badge variant="secondary">Batch: {selectedBatch}</Badge>}
                {selectClass && <Badge variant="secondary">Class: {selectClass}</Badge>}
                {paymentStatus && (
                  <Badge variant="secondary">
                    Status: {paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading && <Loading />}

        {!isLoading && visibleModelTestStudents.length > 0 ? (
          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <CardTitle className="text-lg font-semibold text-slate-900">
                {paymentStatus === "paid" ? "Paid Model Test Students" : paymentStatus === "unpaid" ? "Unpaid Model Test Students" : "Model Test Students"}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 text-slate-700">
                {visibleModelTestStudents.length} records
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleModelTestStudents.map((student: any) => {
                const modelTestPayments = (student?.Payment || []).filter(
                  (payment: any) => payment.title?.toLowerCase() === "modeltest",
                )
                const isPaid = modelTestPayments.length > 0

                return (
                <div key={student.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                  <div className="flex flex-col gap-3">
                    <div className="w-fit rounded-full bg-slate-100 p-1 ring-1 ring-slate-200">
                      <img
                        src={student.image || studentImage}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-base font-semibold leading-tight text-slate-900 break-words">
                          {student.firstName} {student.lastName}
                        </p>
                        <Badge
                          variant={isPaid ? "secondary" : "destructive"}
                          className={isPaid ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {isPaid ? "Model test payment found" : "No model test payment found"}
                      </p>

                      <div className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600 break-words">
                        <p><span className="font-medium text-slate-700">ID:</span> {student.studentId || "-"}</p>
                        <p><span className="font-medium text-slate-700">Batch:</span> {student.Batch?.batchName || student.batchName || "Not assigned"}</p>
                        <p><span className="font-medium text-slate-700">Class:</span> {student.className || "-"}</p>
                        <p><span className="font-medium text-slate-700">Phone:</span> {student.phone || "-"}</p>
                      </div>

                      <div className="mt-4">
                        <Link to={`/payment/${student.id}`} className="block w-full">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            View payment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                )
              })}
            </CardContent>
          </Card>
        ) : (
          !isLoading && (
            <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">No unpaid model test data found</h3>
                    <p className="mt-1 text-slate-500">
                      {hasActiveFilters
                        ? "Try adjusting your filters to see more results"
                        : "Every student in the current dataset already has a model test payment record."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      <Dialog open={isModelTestModalOpen} onOpenChange={setIsModelTestModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Unpaid Model Test Data</DialogTitle>
            <DialogDescription>
              Students listed here do not have any payment entry with the model test title.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-3">
              {visibleModelTestStudents.length > 0 ? (
                visibleModelTestStudents.map((student: any) => {
                  const modelTestPayments = (student?.Payment || []).filter(
                    (payment: any) => payment.title?.toLowerCase() === "modeltest",
                  )
                  const isPaid = modelTestPayments.length > 0

                  return (
                  <div
                    key={student.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="w-fit rounded-full bg-white p-1 ring-1 ring-slate-200">
                        <img
                          src={student.image || studentImage}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="text-base font-semibold leading-tight text-slate-900 break-words">
                            {student.firstName} {student.lastName}
                          </p>
                          <Badge
                            variant={isPaid ? "secondary" : "destructive"}
                            className={isPaid ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}
                          >
                            {isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 break-words">
                          {student.studentId || "-"} | {student.Batch?.batchName || student.batchName || "No batch"}
                        </p>
                        <p className="text-xs text-slate-500">Phone: {student.phone || "-"}</p>

                        <div className="mt-4">
                          <Link to={`/payment/${student.id}`} className="block w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              Open payment
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                  No model test records available for the selected status.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentStatus