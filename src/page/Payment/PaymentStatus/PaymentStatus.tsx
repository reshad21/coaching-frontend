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
import { ChevronsRight, Eye, FileText, Filter, SearchX, Users, X } from "lucide-react"
import { Link } from "react-router-dom"
import studentImage from "../../../assets/default.jpg"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const PaymentStatus = () => {
  const [search, setSearch] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectClass, setSelectedClass] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("unpaid")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentMonth = new Date().toLocaleString("default", { month: "long" })

  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [{ name: "limit", value: 99999 }]
    if (search) params.push({ name: "search", value: search })
    if (selectedBatch) params.push({ name: "batchName", value: selectedBatch })
    if (selectClass) params.push({ name: "className", value: selectClass })
    return params
  }, [search, selectedBatch, selectClass])

  const { data: students, isLoading } = useGetAllStudentQuery(queryParams)
  const allStudents = useMemo(() => students?.data ?? [], [students?.data])

  // Strict: only a ModelTest payment with exactly this month counts as paid
  // For ModelTest payments (which have month: null), check the createdAt date
  // If no month selected, check against current month
  const hasModelTestForMonth = (student: any, month: string): boolean =>
    (student?.Payment || []).some(
      (p: any) => {
        if (p.title !== "ModelTest") return false
        
        // For ModelTest payments, check if payment was made in the target month
        if (p.month === null && p.createdAt) {
          const paymentDate = new Date(p.createdAt)
          const paymentMonth = paymentDate.toLocaleString("default", { month: "long" })
          return paymentMonth === month
        }
        
        // Fallback to month field check for other cases
        return p.month === month
      }
    )

  const activeMonth = selectedMonth || currentMonth

  // Students shown in main card — respects all filters
  const visibleStudents = useMemo(() => {
    return allStudents.filter((student: any) => {
      const isPaid = hasModelTestForMonth(student, activeMonth)
      if (paymentStatus === "paid") return isPaid
      if (paymentStatus === "unpaid") return !isPaid
      return true
    })
  }, [allStudents, paymentStatus, activeMonth])

  // Summary stats — always based on activeMonth across ALL students (no search/batch/class filter)
  const summaryStats = useMemo(() => {
    let paid = 0
    let unpaid = 0
    allStudents.forEach((student: any) => {
      if (hasModelTestForMonth(student, activeMonth)) paid++
      else unpaid++
    })
    return { total: allStudents.length, paid, unpaid }
  }, [allStudents, activeMonth])

  const hasActiveFilters = Boolean(search || selectedBatch || selectClass || paymentStatus !== "unpaid" || selectedMonth)

  const handleDownloadPdf = () => {
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

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
      `Month: ${activeMonth} | Status: ${paymentStatus === "paid" ? "Paid" : paymentStatus === "unpaid" ? "Unpaid" : "All"}`,
      pageWidth - 14, 20, { align: "right" }
    )
    pdf.setTextColor(15, 23, 42)
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "bold")
    pdf.text(`Total Records: ${visibleStudents.length}`, 14, 38)

    const rows = visibleStudents.map((student: any, index: number) => [
      String(index + 1),
      `${student.firstName || ""} ${student.lastName || ""}`.trim() || "-",
      student.studentId || "-",
      student.Batch?.batchName || student.batchName || "-",
      student.className || "-",
      student.phone || "-",
      hasModelTestForMonth(student, activeMonth) ? "Paid" : "Unpaid",
    ])

    autoTable(pdf, {
      startY: 44,
      head: [["SL", "Name", "Std ID", "Batch", "Class", "Phone", "Status"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8.5, cellPadding: 2, valign: "middle" },
      headStyles: { fillColor: [15, 23, 42], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: () => {
        pdf.setFontSize(9)
        pdf.setTextColor(100, 116, 139)
        pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth / 2, pageHeight - 8, { align: "center" })
      },
    })

    pdf.save(`model-test-${activeMonth}-${paymentStatus}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

        {/* Header */}
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl">
                Model Test Payment Status
              </h1>
              <p className="mt-1 text-slate-700">
                Showing results for <span className="font-semibold text-slate-900">{activeMonth}</span>.
                {!selectedMonth && <span className="text-slate-400 text-sm ml-1">(current month)</span>}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
              <Button variant="primaryGradient" className="w-full sm:w-fit" onClick={handleDownloadPdf}>
                Download PDF
              </Button>
              <Button variant="primaryGradient" className="w-full sm:w-fit" onClick={() => setIsModalOpen(true)}>
                View Unpaid Students
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Total Students</p>
                  <p className="text-2xl font-bold text-slate-700">{summaryStats.total}</p>
                  <p className="text-xs text-slate-400 mt-1">All enrolled</p>
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
                  <p className="text-2xl font-bold text-emerald-600">{summaryStats.paid}</p>
                  <p className="text-xs text-slate-400 mt-1">{activeMonth}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardContent className="p-6">
              <button type="button" className="w-full text-left" onClick={() => setIsModalOpen(true)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Model Test Unpaid</p>
                    <p className="text-2xl font-bold text-rose-600">{summaryStats.unpaid}</p>
                    <p className="text-xs text-slate-400 mt-1">{activeMonth}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                    <SearchX className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />

              {/* Month filter */}
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-10 w-full border-slate-200">
                  <SelectValue placeholder={`Month (${currentMonth})`} />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
              <SelectStudentClass value={selectClass} onChange={setSelectedClass} />

              {/* Payment status */}
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger className="h-10 w-full border-slate-200">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearch("")
                  setSelectedBatch("")
                  setSelectedClass("")
                  setSelectedMonth("")
                  setPaymentStatus("unpaid")
                }}
                variant="primaryGradient"
                className="w-full px-3 text-sm sm:w-fit sm:px-4"
                disabled={!hasActiveFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 border-t pt-2">
                <span className="text-sm font-medium text-slate-700">Active filters:</span>
                {search && <Badge variant="secondary">Search: {search}</Badge>}
                {selectedBatch && <Badge variant="secondary">Batch: {selectedBatch}</Badge>}
                {selectClass && <Badge variant="secondary">Class: {selectClass}</Badge>}
                {selectedMonth && <Badge variant="secondary">Month: {selectedMonth}</Badge>}
                <Badge variant="secondary">
                  Status: {paymentStatus === "paid" ? "Paid" : paymentStatus === "unpaid" ? "Unpaid" : "All"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading && <Loading />}

        {/* Student Cards */}
        {!isLoading && visibleStudents.length > 0 ? (
          <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <CardTitle className="text-lg font-semibold text-slate-900">
                {paymentStatus === "paid"
                  ? `Paid — Model Test (${activeMonth})`
                  : paymentStatus === "unpaid"
                  ? `Unpaid — Model Test (${activeMonth})`
                  : `All Students — Model Test (${activeMonth})`}
              </CardTitle>
              <Badge variant="outline" className="shrink-0 text-slate-700">
                {visibleStudents.length} records
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleStudents.map((student: any) => {
                const isPaid = hasModelTestForMonth(student, activeMonth)
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
                            className={
                              isPaid
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                            }
                          >
                            {isPaid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {isPaid
                            ? `ModelTest payment found for ${activeMonth}`
                            : `No ModelTest payment for ${activeMonth}`}
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
                    <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
                    <p className="mt-1 text-slate-500">
                      {hasActiveFilters
                        ? "Try adjusting your filters to see more results."
                        : `All students have paid their Model Test fee for ${activeMonth}.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Modal — always shows unpaid for activeMonth, ignores search/batch/class filters */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Unpaid Model Test — {activeMonth}</DialogTitle>
            <DialogDescription>
              Students who have <strong>not</strong> paid their ModelTest fee for <strong>{activeMonth}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] overflow-y-auto pr-1">
            <div className="space-y-3">
              {allStudents.filter((s: any) => !hasModelTestForMonth(s, activeMonth)).length > 0 ? (
                allStudents
                  .filter((student: any) => !hasModelTestForMonth(student, activeMonth))
                  .map((student: any) => (
                    <div key={student.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
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
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Unpaid</Badge>
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
                  ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                  All students have paid their Model Test fee for {activeMonth}.
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