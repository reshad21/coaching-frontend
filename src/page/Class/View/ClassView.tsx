/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteClassMutation, useGetAllClassQuery } from "@/redux/api/class/classApi"
import { Trash2, GraduationCap, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import ClassCreate from "../Create/ClassCreate"
import Loading from "@/components/Loading"

const ClassView = () => {
  const { data: classResponse, isLoading } = useGetAllClassQuery(undefined)
  const classData = classResponse?.data

  const [deleteClass] = useDeleteClassMutation()
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
          const res = await deleteClass(id)
          if (res?.data?.statusCode) {
            toast.success("Class deleted successfully")
          }
        }
      })
    } catch (error) {
      console.error("Error deleting Class:", error)
      toast.error("Failed to delete Class.")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Class Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage and organize your classes efficiently</p>
        </div>
        <ClassCreate />
      </div>

      <Card className="shadow-sm border-0 bg-card">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            All Classes
            {classData && (
              <span className="ml-1 text-xs sm:text-sm font-normal text-muted-foreground">
                ({classData.length} {classData.length === 1 ? "class" : "classes"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading />
          ) : classData && classData.length > 0 ? (
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="w-12 sm:w-20 font-semibold text-xs sm:text-sm text-foreground py-3 px-3 sm:px-6">#</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm text-foreground py-3 px-3 sm:px-6">Class Name</TableHead>
                    <TableHead className="text-right font-semibold text-xs sm:text-sm text-foreground w-16 sm:w-[120px] py-3 px-3 sm:px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData?.map((classItem: any, index: number) => (
                    <TableRow key={classItem.id} className="border-b hover:bg-muted/30 transition-colors duration-200">
                      <TableCell className="font-medium text-xs sm:text-sm text-muted-foreground py-3 px-3 sm:px-6">
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm text-foreground py-3 px-3 sm:px-6">
                        {classItem.className}
                      </TableCell>
                      <TableCell className="text-right py-3 px-3 sm:px-6">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                            onClick={() => handleDelete(classItem.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete class</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* Enhanced empty state with better visual design */
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center">
              <div className="rounded-full bg-muted p-2 sm:p-3 mb-3 sm:mb-4">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No classes found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-sm">
                Get started by creating your first class to organize your educational content.
              </p>
              <ClassCreate />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClassView
