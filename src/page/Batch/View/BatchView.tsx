/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Edit, Trash2 } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import BatchCreate from "../Create/BatchCreate";
  import { useDeleteBatchMutation, useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
  
  const BatchView = () => {
    const { data: batchResponse, isLoading } = useGetAllBatchQuery(undefined);
    const batchData = batchResponse?.data;


    console.log(batchData)

    const [deleteBatch] =useDeleteBatchMutation();
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
            const res = await deleteBatch(id);
            if (res?.data?.statusCode) {
              toast.success("Batch deleted successfully");
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
                Batch Management
              </CardTitle>
              <BatchCreate />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                  <TableHead className="text-gray-600">Batch Name</TableHead>
                  <TableHead className="text-gray-600">Class Name</TableHead>
                  <TableHead className="text-gray-600">Shift Name</TableHead>
                  <TableHead className="text-gray-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchData?.map((batchItem: any, index: number) => (
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
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
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
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default BatchView;
  