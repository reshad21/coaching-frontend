/* eslint-disable @typescript-eslint/no-explicit-any */

import { ShiftModal } from "@/components/CommonModal/ShiftModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  console.log("shift data==>", shift);
  console.log("loading..", isLoading);

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
    <div className="container mx-auto">
      <Card>
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Shift Management
            </CardTitle>
            <ShiftCreate />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                <TableHead className="text-gray-600">Shift Name</TableHead>
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
        </CardContent>
      </Card>

      {/* Modal */}
      <ShiftModal
        open={openModal}
        setOpen={setOpenModal}
        data={modalDataToUpdate}
      />
    </div>
  );
};

export default ShiftView;
