/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useDeleteClassMutation,
  useGetAllClassQuery,
} from "@/redux/api/class/classApi";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ClassCreate from "../Create/ClassCreate";

const ClassView = () => {
  const { data: classResponse, isLoading } = useGetAllClassQuery(undefined);
  const classData = classResponse?.data;

  const [deleteClass] = useDeleteClassMutation();
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
          const res = await deleteClass(id);
          if (res?.data?.statusCode) {
            toast.success("Class deleted successfully");
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
          <h1 className="text-2xl font-bold text-slate-600">CLASS MANAGEMENT</h1>
          <ClassCreate />
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : classData.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                  <TableHead className="text-gray-600">CLASS NAME</TableHead>
                  <TableHead className="text-gray-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData?.map((classItem: any, index: number) => (
                  <TableRow key={classItem.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {classItem.className}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      {/* <Link to={`/update-class/${classItem.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      </Link> */}

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200"
                        onClick={() => handleDelete(classItem.id)}
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
    </>
  );
};

export default ClassView;
