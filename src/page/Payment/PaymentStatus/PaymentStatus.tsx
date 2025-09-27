/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import SelectBatch from "@/components/Batch/SelectBatch";
import SelectStudentClass from "@/components/studentClass/SelectStudentClass";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import EduCPagination from "@/components/EduCPagination/EduCPagination";
import Loading from "@/components/Loading";
import studentImage from "../../../assets/default.jpg";

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
  useDeleteStudentMutation,
  useGetAllStudentQuery,
} from "@/redux/api/studentApi/studentApi";

import { ChevronsRight, Eye, SquarePen, Trash } from "lucide-react";

const PaymentStatus = () => {
  // Pagination, search, and filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectClass, setSelectedClass] = useState("");

  // Query params memoized
  const queryParams = useMemo(() => {
    const params: { name: string; value: any }[] = [
      { name: "limit", value: 10 },
      { name: "page", value: page },
      { name: "search", value: search },
    ];
    if (selectedBatch) params.push({ name: "batchName", value: selectedBatch });
    if (selectClass) params.push({ name: "className", value: selectClass });
    return params;
  }, [page, search, selectedBatch, selectClass]);

  const { data: students, isLoading } = useGetAllStudentQuery(queryParams);
  const [deleteStudent] = useDeleteStudentMutation();

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#09733D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      const res = await deleteStudent(id);
      if ('data' in res && res.data?.statusCode) {
        toast.success("Student deleted successfully");
      }
    }
  };

  return (
    <div className="container mx-auto pb-8">
      {/* Page Header */}
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Payment</h1>
        <ChevronsRight className="mx-2" />
        <h1 className="text-2xl font-bold text-slate-600">Payment Overview</h1>
      </div>

      {/* Filters */}
      <div className="filter-section grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <SearchInputField value={search} onChange={setSearch} onSearch={setSearch} />
        <SelectBatch value={selectedBatch} onChange={setSelectedBatch} />
        <SelectStudentClass value={selectClass} onChange={setSelectedClass} />
        <Button
          onClick={() => {
            setSearch("");
            setSelectedBatch("");
            setSelectedClass("");
          }}
          className="text-slate-500 w-1/4 bg-gray-50 hover:bg-gray-100"
        >
          Clear Filter
        </Button>
      </div>

      {/* Loading */}
      {isLoading && <Loading />}

      {/* Students Table */}
      {!isLoading && students?.data?.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Std Id</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Model Test</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.data.map((student: any, index: number) => (
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={student.image || studentImage}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span>{student.firstName} {student.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.Batch?.batchName || "-"}</TableCell>
                  <TableCell>
                    {(() => {
                      const currentMonth = new Date().toLocaleString("default", { month: "long" });
                      const hasPaid = student?.Payment?.some((p: any) => p.month === currentMonth);
                      return hasPaid ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>;
                    })()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const modelTests = student?.Payment?.filter((p: any) => p.title === "ModelTest");
                      if (!modelTests || modelTests.length === 0) return <span className="text-red-600">No</span>;
                      const latestModelTest = modelTests.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                      return latestModelTest ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>;
                    })()}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Link to={`/view-student/${student.id}`}>
                      <Button variant="outline" size="icon" className="text-green-600 h-8 w-8"><Eye /></Button>
                    </Link>
                    <Link to={`/update-student/${student.id}`}>
                      <Button variant="outline" size="icon" className="text-blue-600 h-8 w-8"><SquarePen /></Button>
                    </Link>
                    <Button variant="outline" size="icon" className="text-red-600 h-8 w-8" onClick={() => handleDelete(student.id)}>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        !isLoading && <p>No data found</p>
      )}

      {/* Pagination */}
      {students?.meta?.total > students?.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={students.meta.totalPages}
          className="mt-4 flex justify-end"
        />
      )}
    </div>
  );
};

export default PaymentStatus;
