/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectBatch from "@/components/Batch/SelectBatch";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import EduCPagination from "@/components/EduCPagination/EduCPagination";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteBatchMutation,
  useGetAllBatchQuery,
} from "@/redux/api/batch/batchApi";
import { Edit, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BatchCreate from "../Create/BatchCreate";
import { BatchModal } from "@/components/CommonModal/BatchModal";
import Loading from "@/components/Loading";

const BatchView = () => {
  // * Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null);

  // * Pagination, search and filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  // * Memoize query params to prevent hook issues
  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [
      { name: "limit", value: 10 },
      { name: "page", value: page },
      { name: "search", value: search },
    ];
    if (selectedBatch) {
      params.push({ name: "batchName", value: selectedBatch });
    }
    return params;
  }, [page, search, selectedBatch]);

  // * Fetch batches
  const { data: batchData, isLoading } = useGetAllBatchQuery(queryParams);

  const [deleteBatch] = useDeleteBatchMutation();

  if (isLoading) {
    return <Loading />;
  }

  // * Handle update modal
  const handleUpdateClick = (batch: any) => {
    setModalDataToUpdate(batch);
    setOpenModal(true);
  };

  // * Handle delete
  const handleDelete = (id?: string) => {
    if (!id) return;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09733D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        const res = await deleteBatch(id);
        if (res?.data?.statusCode) {
          toast.success("Batch deleted successfully");
        }
      }
    });
  };

  return (
    <div className="container mx-auto pb-8">
      <div className="flex justify-between items-center mb-5">
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Batch Management
        </CardTitle>
        <BatchCreate />
      </div>

      {/* Filter Section */}
      <div className="filter-section grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
        />
        <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
        <Button
          onClick={() => {
            setSearch("");
            setSelectedBatch("");
          }}
          className="text-slate-500 w-1/4 bg-gray-50 hover:bg-gray-100"
        >
          Clear Filter
        </Button>
      </div>

      {/* Batch Table */}
      {batchData?.data?.data?.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                <TableHead className="text-gray-600">Batch Name</TableHead>
                <TableHead className="text-gray-600">Class Name</TableHead>
                <TableHead className="text-gray-600">Shift Name</TableHead>
                <TableHead className="text-gray-600">Total Students</TableHead>
                <TableHead className="text-gray-600 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchData.data.data.map((batchItem: any, index: number) => (
                <TableRow key={batchItem?.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {batchItem?.batchName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {batchItem?.Class?.className}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {batchItem?.Shift?.shiftName}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {batchItem?.students?.length}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                      onClick={() => handleUpdateClick(batchItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200"
                      onClick={() => handleDelete(batchItem?.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        "No data found"
      )}

      {/* Pagination */}
      {batchData?.meta?.total > batchData?.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={batchData?.meta?.totalPages}
          className="my-6 flex justify-end"
        />
      )}

      {/* Modal */}
      <BatchModal
        open={openModal}
        setOpen={setOpenModal}
        data={modalDataToUpdate}
      />
    </div>
  );
};

export default BatchView;
