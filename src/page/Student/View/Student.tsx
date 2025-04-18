/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useGetAllStudentQuery } from "@/redux/api/student/student";
import { ChevronsRight, Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";

const Student = () => {
  // * Pagination state
  const [page, setPage] = useState(1);

  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 5 },
    { name: "page", value: page },
  ]);

  console.log("students=>", students);
  console.log("isLoading=>", isLoading);
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Student</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">All Student</h1>
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
                  <span className="text-slate-600 font-bold">Class</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Phone</span>
                </TableHead>
                <TableHead>
                  <span className="text-slate-600 font-bold">Batch</span>
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
                    <span className="text-slate-500 font-medium">
                      {student.firstName} {student.lastName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.studentId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-medium">
                      {student.class}
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
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 border-blue-100 hover:border-blue-200"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                    >
                      <SquarePen />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 border-blue-100 hover:border-blue-200"
                    >
                      <Trash />
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

      {/* pagination  */}
      {students.meta?.total > students.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          className="mt-4 flex justify-end"
        />
      )}
    </div>
  );
};

export default Student;
