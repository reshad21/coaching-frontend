/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import EduCPagination from "@/components/EduCPagination/EduCPagination";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddPaymentMutation } from "@/redux/api/payment/paymentApi";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { ChevronsRight, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const MonthlyPayment = () => {
  // * Pagination, search and filter state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // call api to get student data from studentId
  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 10 },
    { name: "page", value: page },
    { name: "search", value: search },
  ]);
  console.log("get all student data", students);
  console.log("get all student data", isLoading);

  const [addPayment] = useAddPaymentMutation();

  const form = useForm({
    defaultValues: {
      studentId: "",
      month: "",
      amount: "",
      title: "",
    },
  });

  const onSubmit = async (data: any) => {
    const payload = {
      studentId: data.studentId,
      month: data.month,
      amount: data.amount,
      title: data.title,
    };
    const res: any = await addPayment(payload);
    console.log("see response", res);
    if (res?.status === 200) {
      form.reset();
      toast.success(res?.message || "Payment added successfully");
    } else {
      toast.error("Failed to add payment");
    }
  };

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Payment</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">
          Student Monthly Fees
        </h1>
      </div>

      <div className="filter-section grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
        />
        <Button
          onClick={() => {
            setSearch("");
          }}
          className="text-slate-500 w-1/4 bg-gray-50 hover:bg-gray-100"
        >
          Clear Filter
        </Button>
      </div>

      <div className="border-1 border-slate-500 rounded-lg shadow-md p-5">
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
                    <TableCell className="flex items-center gap-2"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          "No data found"
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <FormFieldWrapper
                name="studentId"
                label="Student ID"
                placeholder="Enter Student ID"
              />
              <SelectFieldWrapper
                name="title"
                label="Payment Title"
                options={[
                  { value: "Monthly", name: "Monthly" },
                  { value: "ModelTest", name: "ModelTest" },
                  { value: "Others", name: "Others" },
                ]}
                control={form.control}
              />
              <FormFieldWrapper
                name="amount"
                label="Amount"
                placeholder="Enter amount"
                type="number"
              />

              <SelectFieldWrapper
                name="month"
                label="Select Month"
                options={[
                  { value: "January", name: "January" },
                  { value: "February", name: "February" },
                  { value: "March", name: "March" },
                  { value: "April", name: "April" },
                  { value: "May", name: "May" },
                  { value: "June", name: "June" },
                  { value: "July", name: "July" },
                  { value: "August", name: "August" },
                  { value: "September", name: "September" },
                  { value: "October", name: "October" },
                  { value: "November", name: "November" },
                  { value: "December", name: "December" },
                ]}
                control={form.control}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-cyan-800 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-md transition"
            >
              <Plus className="w-5 h-5" />
              Add Payment
            </Button>
          </form>
        </Form>
      </div>
      {/* pagination */}
      {students?.meta?.total > students?.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={students?.meta?.totalPages}
          className="mt-4 flex justify-end"
        />
      )}
    </div>
  );
};

export default MonthlyPayment;
