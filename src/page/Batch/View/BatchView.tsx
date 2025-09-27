

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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Batch Management</h1>
            <p className="text-muted-foreground">Manage and organize your educational batches efficiently</p>
          </div>
          <BatchCreate />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                  <p className="text-2xl font-bold text-foreground">{totalBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-accent" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-chart-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold text-foreground">{totalBatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
              </div>
              <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("")
                  setSelectedBatch("")
                }}
                className="flex items-center gap-2 border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Batch Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading />
              </div>
            ) : batchData?.data?.data?.length > 0 ? (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                      <TableHead className="w-[60px] font-semibold text-foreground">#.</TableHead>
                      <TableHead className="font-semibold text-foreground">Batch Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Class Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Shift Name</TableHead>
                      <TableHead className="font-semibold text-foreground">Total Students</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchData.data.data.map((batchItem: any, index: number) => (
                      <TableRow key={batchItem?.id} className="border-border transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">
                          {(page - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{batchItem?.batchName}</TableCell>
                        <TableCell className="text-muted-foreground">{batchItem?.Class?.className}</TableCell>
                        <TableCell className="text-muted-foreground">{batchItem?.Shift?.shiftName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium text-foreground">{batchItem?.students?.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-accent/20 bg-accent/10 text-accent hover:bg-accent/20 hover:text-accent"
                              onClick={() => handleUpdateClick(batchItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
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
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No batches found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get started by creating your first batch or adjust your search filters.
                </p>
                <Button
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
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
        {batchData?.meta?.total > batchData?.meta?.limit && (
          <div className="flex justify-center">
            <EduCPagination
              page={page}
              setPage={setPage}
              totalPages={batchData?.meta?.totalPages}
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
