/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectBatch from "@/components/Batch/SelectBatch"
import { BatchModal } from "@/components/CommonModal/BatchModal"
import SearchInputField from "@/components/CommonSearch/SearchInputField"
import EduCPagination from "@/components/EduCPagination/EduCPagination"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDeleteBatchMutation, useGetAllBatchQuery } from "@/redux/api/batch/batchApi"
import { Clock, Edit, Filter, GraduationCap, Plus, RotateCcw, Trash2, Users } from "lucide-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import BatchCreate from "../Create/BatchCreate"

const BatchView = () => {
  // * Modal state
  const [openModal, setOpenModal] = useState(false)
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null)

  // * Pagination, search and filter state
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("")

  // * Memoize query params to prevent hook issues
  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [
      { name: "limit", value: 10 },
      { name: "page", value: page },
      { name: "search", value: search },
    ]
    if (selectedBatch) {
      params.push({ name: "batchName", value: selectedBatch })
    }
    return params
  }, [page, search, selectedBatch])

  // * Fetch batches
  const { data: batchData, isLoading } = useGetAllBatchQuery(queryParams)

  const [deleteBatch] = useDeleteBatchMutation()

  // * Handle update modal
  const handleUpdateClick = (batch: any) => {
    setModalDataToUpdate(batch)
    setOpenModal(true)
  }

  // * Handle delete
  const handleDelete = (id?: string) => {
    if (!id) return
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
        const res = await deleteBatch(id)
        if (res?.data?.statusCode) {
          toast.success("Batch deleted successfully")
        }
      }
    })
  }

  const totalBatches = batchData?.data?.data?.length || 0
  const totalStudents =
    batchData?.data?.data?.reduce((acc: number, batch: any) => acc + (batch?.students?.length || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Batch Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage and organize your educational batches efficiently</p>
          </div>
          <BatchCreate />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Batches</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Users className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Clock className="h-5 w-5 text-chart-4 flex-shrink-0" />
                <div className="space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-4">
              <div className="relative">
                <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
              </div>
              <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
              <Button
                variant="primaryGradient"
                onClick={() => {
                  setSearch("")
                  setSelectedBatch("")
                }}
                className="w-full md:w-fit px-3 sm:px-4 text-xs sm:text-base h-9 sm:h-10"
              >
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="ml-1 sm:ml-2">Clear Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Batch Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading />
              </div>
            ) : batchData?.data?.data?.length > 0 ? (
              <>
                {/* Mobile: Card Layout */}
                <div className="md:hidden p-4 space-y-3">
                  {batchData.data.data.map((batchItem: any, index: number) => (
                    <div
                      key={batchItem?.id}
                      className="bg-muted/20 rounded-lg border border-border p-4 space-y-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Index and Batch Name */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-shrink-0 h-7 w-7 bg-primary/10 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">
                                {(page - 1) * 10 + index + 1}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground truncate">
                              {batchItem?.batchName}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Batch Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Class:</span>
                          <span className="font-medium text-foreground">{batchItem?.Class?.className}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Shift:</span>
                          <span className="font-medium text-foreground">{batchItem?.Shift?.shiftName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Students:</span>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{batchItem?.students?.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          onClick={() => handleUpdateClick(batchItem)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                          onClick={() => handleDelete(batchItem?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="w-[60px] font-semibold text-foreground text-xs sm:text-sm">#.</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Batch Name</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Class Name</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Shift Name</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Total Students</TableHead>
                        <TableHead className="text-right font-semibold text-foreground text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchData.data.data.map((batchItem: any, index: number) => (
                        <TableRow key={batchItem?.id} className="border-border transition-colors hover:bg-muted/50">
                          <TableCell className="font-medium text-muted-foreground text-xs sm:text-sm">
                            {(page - 1) * 10 + index + 1}
                          </TableCell>
                          <TableCell className="font-medium text-foreground text-xs sm:text-sm">{batchItem?.batchName}</TableCell>
                          <TableCell className="text-muted-foreground text-xs sm:text-sm">{batchItem?.Class?.className}</TableCell>
                          <TableCell className="text-muted-foreground text-xs sm:text-sm">{batchItem?.Shift?.shiftName}</TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground">{batchItem?.students?.length}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                onClick={() => handleUpdateClick(batchItem)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDelete(batchItem?.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center">
                <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-foreground">No batches found</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
                  Get started by creating your first batch or adjust your search filters.
                </p>
                <Button
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-9 sm:h-10 text-xs sm:text-sm"
                  onClick={() => {
                    setSearch("")
                    setSelectedBatch("")
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Batch
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {batchData?.data?.meta?.total > batchData?.data?.meta?.limit && (
          <div className="flex justify-center overflow-x-auto">
            <EduCPagination
              page={page}
              setPage={setPage}
              totalPages={batchData?.data?.meta?.totalPages}
              className="bg-card border-border rounded-lg p-2"
            />
          </div>
        )}

        {/* Modal */}
        <BatchModal open={openModal} setOpen={setOpenModal} data={modalDataToUpdate} />
      </div>
    </div>
  )
}

export default BatchView