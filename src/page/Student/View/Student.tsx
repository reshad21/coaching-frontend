/* eslint-disable @typescript-eslint/no-explicit-any */
import defaultImg from "@/assets/default.jpg"
import SelectBatch from "@/components/Batch/SelectBatch"
import SearchInputField from "@/components/CommonSearch/SearchInputField"
import Loading from "@/components/Loading"
import SelectShift from "@/components/Shift/SelectShift"
import SelectStudentClass from "@/components/studentClass/SelectStudentClass"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useDeleteStudentMutation, useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi"
import { Users, Filter, Eye, Edit3, Trash2, RotateCcw, GraduationCap, Clock, Phone, Hash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import SendMessage from "./SendMessage/SendMessage"

const Student = () => {
  // * Pagination, search and filter state
  const [search, setSearch] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectClass, setSelectedClass] = useState("")
  const [shift, setShift] = useState("")

  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "search", value: search },
    ...(selectedBatch ? [{ name: "batchName", value: selectedBatch }] : []),
    ...(selectClass ? [{ name: "className", value: selectClass }] : []),
    ...(shift ? [{ name: "shiftName", value: shift }] : []),
  ])

  const [deleteStudent] = useDeleteStudentMutation()

  const handleDelete = (id?: string) => {
    if (!id) return
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "rgb(34 197 94)",
        cancelButtonColor: "rgb(239 68 68)",
        confirmButtonText: "Yes, delete it!",
        background: "rgb(15 15 20)",
        color: "rgb(250 250 250)",
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const res = await deleteStudent(id)
          if (res?.data?.statusCode) {
            toast.success("Student deleted successfully")
          }
        }
      })
    } catch (error) {
      console.error("Error deleting Student:", error)
      toast.error("Failed to delete Student.")
    }
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedBatch("")
    setSelectedClass("")
    setShift("")
  }

  const hasActiveFilters = search || selectedBatch || selectClass || shift

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground">Manage and view all student records</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-card-foreground">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {[search, selectedBatch, selectClass, shift].filter(Boolean).length} active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
            </div>
            <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
            <SelectStudentClass value={selectClass} onChange={setSelectedClass} />
            <SelectShift value={shift} onChange={setShift} />
            <Button
              onClick={clearFilters}
              variant="outline"
              className="border-border bg-primary text-white cursor-pointer"
              disabled={!hasActiveFilters}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Card */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-card-foreground">
                All Students
                {students?.data?.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {students.data.length}
                  </Badge>
                )}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : students?.data?.length > 0 ? (
            <div className="border border-border rounded-lg overflow-y-auto overflow-x-scroll max-h-[500px] table-scroll">
              <Table className="min-w-[1300px]">
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Student Details
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">Student ID</TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" />
                        Class
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Shift
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        Contact
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">Batch</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.data?.map((student: any, index: number) => (
                    <TableRow key={student.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="whitespace-nowrap">
                        <span className="text-muted-foreground font-mono text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={student?.image || defaultImg}
                              alt={`${student?.firstName} ${student?.lastName}`}
                              className="w-10 h-10 rounded-lg object-cover border border-border"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-card"></div>
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">
                              {student?.firstName} {student?.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="font-mono">
                          {student?.studentId}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary">{student.Class?.className || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-card-foreground">{student?.shiftName || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-card-foreground font-mono">{student?.phone || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">{student.Batch?.batchName || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Link to={`/view-student/${student.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link to={`/update-student/${student.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(student.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <SendMessage student={student} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-2">No students found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {hasActiveFilters
                  ? "No students match your current filters. Try adjusting your search criteria."
                  : "No students have been added yet. Add your first student to get started."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" size="sm" className="mt-4 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Student
