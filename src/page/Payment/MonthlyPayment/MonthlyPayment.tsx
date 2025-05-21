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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openFormFor, setOpenFormFor] = useState<string | null>(null);

  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 10 },
    { name: "page", value: page },
    { name: "search", value: search },
  ]);

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
      amount: Number(data.amount),
      title: data.title,
    };

    const res: any = await addPayment(payload);
    if (res?.status === 200) {
      form.reset();
      setOpenFormFor(null);
      toast.success(res?.message || "Payment added successfully");
    } else {
      toast.error("Failed to add payment");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Payment</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">
          Student Monthly Fees
        </h1>
      </div>

      {/* Search & Filter */}
      <div className="filter-section grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
        />
        <Button
          onClick={() => setSearch("")}
          className="text-slate-500 w-1/4 bg-gray-50 hover:bg-gray-100"
        >
          Clear Filter
        </Button>
      </div>

      {/* Table */}
      <div className="border-1 border-slate-500 rounded-lg shadow-md p-5">
        {students?.data?.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL No.</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Std Id</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.data?.map((student: any, index: number) => (
                  <>
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={`http://localhost:3000${student.image}`}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="size-10 rounded-md object-cover"
                          />
                          <span>
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => {
                            form.setValue("studentId", student.studentId);
                            setOpenFormFor((prev) =>
                              prev === student.studentId ? null : student.studentId
                            );
                          }}
                        >
                          {openFormFor === student.studentId
                            ? "Cancel"
                            : "Make Payment"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible Form Row */}
                    {openFormFor === student.studentId && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="p-4 bg-gray-100 rounded-md"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                className="bg-primary hover:bg-cyan-800 text-white flex items-center gap-2 py-2 px-4 rounded-md transition"
                              >
                                <Plus className="w-5 h-5" />
                                Submit Payment
                              </Button>
                            </form>
                          </Form>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          "No data found"
        )}
      </div>

      {/* Pagination */}
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
