
/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectBatch from "@/components/Batch/SelectBatch";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import EduCPagination from "@/components/EduCPagination/EduCPagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllPaymentQuery } from "@/redux/api/payment/paymentApi";
import {
  useDeleteStudentMutation,
  useGetAllStudentQuery,
} from "@/redux/api/studentApi/studentApi";
import { ChevronsRight, Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentStatus = () => {
  // * Pagination, search and filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const { data: payments } = useGetAllPaymentQuery(undefined);
  console.log("line39==>", payments);

  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 10 },
    { name: "page", value: page },
    { name: "search", value: search },
    ...(selectedBatch ? [{ name: "batchName", value: selectedBatch }] : []),
  ]);

  console.log("line 172==>",students);

  console.log("isLoading=>", isLoading);
  // console.log("all students=>", students);

  const [deleteStudent] = useDeleteStudentMutation();

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
          const res = await deleteStudent(id);
          if (res?.data?.statusCode) {
            toast.success("Student deleted successfully");
          }
        }
      });
    } catch (error) {
      console.error("Error deleting Teacher:", error);
      toast.error("Failed to delete Teacher.");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Payment</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">Payment Overview</h1>
      </div>
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
      {students?.data?.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="text-slate-600 font-bold">SL No.</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Full Name</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Std Id</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Phone</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Batch</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Payment</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.data?.map((student: any, index: number) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={`http://localhost:3000${student.image}`}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="size-10 rounded-md object-cover"
                      />
                      <span className="text-slate-500 font-medium">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.studentId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.Batch?.batchName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.Batch?.batchName}
                    </span>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Link to={`/view-student/${student.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700 border-blue-100 hover:border-blue-200"
                      >
                        <Eye />
                      </Button>
                    </Link>
                    <Link to={`/update-student/${student.id}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                      >
                        <SquarePen />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 border-blue-100 hover:border-blue-200"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash />
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="icon"
                      
                    >
                      
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        "No data found"
      )}

      {/* pagination */}
      {students?.meta?.total > students?.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={students?.meta?.totalPages}
          className="mt-4 flex justify-end"
        />
      )}
      {/* <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={students?.meta?.totalPages}
          className="mt-4 flex justify-end"
        /> */}
    </div>
  );
};

export default PaymentStatus;
