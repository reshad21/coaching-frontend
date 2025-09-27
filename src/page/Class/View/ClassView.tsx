
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
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg px-6 py-2",
          cancelButton: "rounded-lg px-6 py-2",
        },
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Class Management</h1>
          <p className="text-muted-foreground">Manage and organize your classes efficiently</p>
        </div>
        <ClassCreate />
      </div>

      <Card className="shadow-sm border-0 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <GraduationCap className="h-5 w-5 text-primary" />
            All Classes
            {classData && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({classData.length} {classData.length === 1 ? "class" : "classes"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading />
          ) : classData && classData.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[80px] font-semibold text-foreground">#</TableHead>
                    <TableHead className="font-semibold text-foreground">Class Name</TableHead>
                    <TableHead className="text-right font-semibold text-foreground w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData?.map((classItem: any, index: number) => (
                    <TableRow key={classItem.id} className="hover:bg-muted/30 transition-colors duration-200">
                      <TableCell className="font-medium text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{classItem.className}</TableCell>
                      <TableCell className="text-right">
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No classes found</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
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
