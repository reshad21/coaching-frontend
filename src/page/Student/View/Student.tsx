/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDeleteStudentMutation, useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi"
import { Users, RotateCcw, GraduationCap, } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import StudentHeader from "../_component/StudentHeader"
import StudentFilters from "../_component/StudentFilters"
import StudentTable from "../_component/StudentTable"

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
    <div className="bg-background p-6 space-y-6">
      {/* Header Section */}
      <StudentHeader/>

      {/* Filters Card */}
      <StudentFilters
        search={search}
        selectedBatch={selectedBatch}
        selectClass={selectClass}
        shift={shift}
        onSearchChange={setSearch}
        onBatchChange={setSelectedBatch}
        onClassChange={setSelectedClass}
        onShiftChange={setShift}
        onClearFilters={clearFilters}
      />

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
            <StudentTable students={students.data} onDelete={handleDelete} />
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
