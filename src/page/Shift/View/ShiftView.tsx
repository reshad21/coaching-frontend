
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ShiftModal } from "@/components/CommonModal/ShiftModal"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteShiftMutation, useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi"
import { Edit, Trash2, Clock } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import ShiftCreate from "../Create/ShiftCreate"
import Loading from "@/components/Loading"

const ShiftView = () => {
  // * Modal state
  const [openModal, setOpenModal] = useState(false)
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null)

  const { data: shift, isLoading } = useGetAllShiftQuery(undefined)

  const [deleteShift] = useDeleteShiftMutation()

  const handleUpdateClick = (exam: any) => {
    setModalDataToUpdate(exam)
    setOpenModal(true)
  }

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
          const res = await deleteShift(id)
          if (res?.data?.statusCode) {
            toast.success("Shift deleted successfully")
          }
        }
      })
    } catch (error) {
      console.error("Error deleting Shift:", error)
      toast.error("Failed to delete Shift.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* ✅ Responsive Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl flex-shrink-0">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">Shift Management</h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 hidden sm:block">Manage and organize work shifts efficiently</p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <ShiftCreate />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loading />
            </div>
          ) : shift?.data?.length > 0 ? (
            <>
              {/* ✅ Responsive Stats Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-xs sm:text-sm text-slate-600">
                      Total Shifts: <span className="font-semibold text-slate-900">{shift.data.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                      <TableHead className="w-12 sm:w-20 text-slate-700 font-semibold py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm">#</TableHead>
                      <TableHead className="text-slate-700 font-semibold py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm">Shift Name</TableHead>
                      <TableHead className="text-slate-700 font-semibold py-3 sm:py-4 px-3 sm:pr-6 text-right text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shift?.data?.map((shiftItem: any, index: number) => (
                      <TableRow
                        key={shiftItem.id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0"
                      >
                        <TableCell data-label="#" className="font-medium text-slate-500 py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell data-label="Shift Name" className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg flex-shrink-0">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{shiftItem.shiftName}</div>
                              <div className="text-xs text-slate-500 hidden sm:block">Work Shift</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell data-label="Actions" className="py-3 sm:py-4 px-3 sm:pr-6">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200 bg-transparent"
                              onClick={() => handleUpdateClick(shiftItem)}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200 bg-transparent"
                              onClick={() => handleDelete(shiftItem.id)}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
              <div className="p-3 sm:p-4 bg-slate-100 rounded-full mb-4">
                <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No shifts found</h3>
              <p className="text-xs sm:text-sm text-slate-500 text-center mb-6 max-w-md">
                Get started by creating your first shift to organize work schedules effectively.
              </p>
              <ShiftCreate />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ShiftModal open={openModal} setOpen={setOpenModal} data={modalDataToUpdate} />
    </div>
  )
}

export default ShiftView
