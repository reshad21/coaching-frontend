/* eslint-disable @typescript-eslint/no-explicit-any */

import { ShiftModal } from "@/components/CommonModal/ShiftModal";
import TableSkeleton from "@/components/Skleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteShiftMutation,
  useGetAllShiftQuery,
} from "@/redux/api/shiftApi/shiftApi";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ShiftCreate from "../Create/ShiftCreate";

const ShiftView = () => {
  // * Modal state
  const [openModal, setOpenModal] = useState(false);
  const [modalDataToUpdate, setModalDataToUpdate] = useState<any>(null);

  const { data: shift, isLoading } = useGetAllShiftQuery(undefined);

  const [deleteShift] = useDeleteShiftMutation();

  const handleUpdateClick = (exam: any) => {
    setModalDataToUpdate(exam);
    setOpenModal(true);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    try {
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
          const res = await deleteShift(id);
          if (res?.data?.statusCode) {
            toast.success("Shift deleted successfully");
          }
        }
      });
    } catch (error) {
      console.error("Error deleting Teacher:", error);
      toast.error("Failed to delete Teacher.");
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-600">
            SHIFT MANAGEMENT
          </h1>
          <ShiftCreate />
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : shift?.data?.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                  <TableHead className="text-gray-600">SHIFT NAME</TableHead>
                  <TableHead className="text-gray-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shift?.data?.map((shiftItem: any, index: number) => (
                  <TableRow key={shiftItem.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {shiftItem.shiftName}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                        onClick={() => handleUpdateClick(shiftItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200"
                        onClick={() => handleDelete(shiftItem.id)}
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
          <p className="text-center text-gray-500 mt-10">No data found</p>
        )}
      </div>

      {/* Modal */}
      <ShiftModal
        open={openModal}
        setOpen={setOpenModal}
        data={modalDataToUpdate}
      />
    </>
  );
};

export default ShiftView;
