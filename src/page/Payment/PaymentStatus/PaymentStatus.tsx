/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import SelectBatch from "@/components/Batch/SelectBatch"
import SearchInputField from "@/components/CommonSearch/SearchInputField"
import EduCPagination from "@/components/EduCPagination/EduCPagination"
import Loading from "@/components/Loading"
import SelectStudentClass from "@/components/studentClass/SelectStudentClass"
import studentImage from "../../../assets/default.jpg"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi"

import { ChevronsRight, CreditCard, Eye, FileText, Filter, SquarePen, Users, X } from "lucide-react"

const PaymentStatus = () => {
  // Pagination, search, and filter state
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectClass, setSelectedClass] = useState("")

  // Query params memoized
  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [
      { name: "limit", value: 10 },
      { name: "page", value: page },
      { name: "search", value: search },
    ]
    if (selectedBatch) params.push({ name: "batchName", value: selectedBatch })
    if (selectClass) params.push({ name: "className", value: selectClass })
    return params
  }, [page, search, selectedBatch, selectClass])

  const { data: students, isLoading } = useGetAllStudentQuery(queryParams)


  const summaryStats = useMemo(() => {
    if (!students?.data) return { total: 0, paid: 0, unpaid: 0, modelTestPassed: 0 }

    const currentMonth = new Date().toLocaleString("default", { month: "long" })
    let paid = 0
    let modelTestPassed = 0

    students.data.forEach((student: any) => {
      const hasPaid = student?.Payment?.some((p: any) => p.month === currentMonth)
      if (hasPaid) paid++

      const modelTests = student?.Payment?.filter((p: any) => p.title === "ModelTest")
      if (modelTests && modelTests.length > 0) modelTestPassed++
    })

    return {
      total: students.data.length,
      paid,
      unpaid: students.data.length - paid,
      modelTestPassed,
    }
  }, [students?.data])

  const hasActiveFilters = search || selectedBatch || selectClass

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-500 font-medium">
            <span>Dashboard</span>
            <ChevronsRight className="mx-2 h-4 w-4" />
            <span>Payment Management</span>
            <ChevronsRight className="mx-2 h-4 w-4" />
            <span className="text-slate-900">Payment Overview</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Overview</h1>
              <p className="text-slate-600 mt-1">Monitor student payment status and model test progress</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-slate-600">
                {students?.meta?.total || 0} Total Students
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <p className="text-2xl font-bold text-slate-900">{summaryStats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.paid}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Payment</p>
                  <p className="text-2xl font-bold text-red-600">{summaryStats.unpaid}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Model Test Passed</p>
                  <p className="text-2xl font-bold text-purple-600">{summaryStats.modelTestPassed}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
              <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
              <SelectStudentClass value={selectClass} onChange={setSelectedClass} />
              <Button
                onClick={() => {
                  setSearch("")
                  setSelectedBatch("")
                  setSelectedClass("")
                }}
                variant="outline"
                className="w-full flex items-center gap-2 hover:bg-slate-50"
                disabled={!hasActiveFilters}
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm text-slate-600 font-medium">Active filters:</span>
                {search && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {search}
                  </Badge>
                )}
                {selectedBatch && (
                  <Badge variant="secondary" className="text-xs">
                    Batch: {selectedBatch}
                  </Badge>
                )}
                {selectClass && (
                  <Badge variant="secondary" className="text-xs">
                    Class: {selectClass}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && <Loading />}

        {!isLoading && students?.data?.length > 0 ? (
          <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Student Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-slate-700">SL No.</TableHead>
                      <TableHead className="font-semibold text-slate-700">Student Details</TableHead>
                      <TableHead className="font-semibold text-slate-700">Student ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                      <TableHead className="font-semibold text-slate-700">Batch</TableHead>
                      <TableHead className="font-semibold text-slate-700">Payment Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Model Test</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.data?.map((student: any, index: number) => (
                      <TableRow key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-slate-600">{(page - 1) * 10 + index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={student.image || studentImage}
                                alt={`${student.firstName} ${student.lastName}`}
                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {student.firstName} {student.lastName}
                              </p>
                              <p className="text-sm text-slate-500">Student</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {student.studentId}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">{student.phone}</TableCell>
                        <TableCell>
                          {student.Batch?.batchName ? (
                            <Badge variant="secondary" className="text-xs">
                              {student.Batch.batchName}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-sm">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const currentMonth = new Date().toLocaleString("default", { month: "long" })
                            const hasPaid = student?.Payment?.some((p: any) => p.month === currentMonth)
                            return hasPaid ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Paid
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                                <CreditCard className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const modelTests = student?.Payment?.filter((p: any) => p.title === "ModelTest")
                            if (!modelTests || modelTests.length === 0) {
                              return (
                                <Badge variant="outline" className="text-red-600 border-red-200">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Not Taken
                                </Badge>
                              )
                            }
                            const latestModelTest = modelTests.sort(
                              (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                            )[0]
                            return latestModelTest ? (
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                                <FileText className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-200">
                                <FileText className="h-3 w-3 mr-1" />
                                Not Taken
                              </Badge>
                            )
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Link to={`/view-student/${student.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/update-student/${student.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <SquarePen className="h-4 w-4" />
                              </Button>
                            </Link>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          !isLoading && (
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">No students found</h3>
                    <p className="text-slate-500 mt-1">
                      {hasActiveFilters
                        ? "Try adjusting your filters to see more results"
                        : "No students have been added to the system yet"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {students?.meta?.total > students?.meta?.limit && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, students.meta.total)} of {students.meta.total}{" "}
              students
            </p>
            <EduCPagination
              page={page}
              setPage={setPage}
              totalPages={students.meta.totalPages}
              className="flex justify-end"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentStatus
