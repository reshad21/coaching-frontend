/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import EduCPagination from "@/components/EduCPagination/EduCPagination";
import Loading from "@/components/Loading";
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
import { useSendSingleMessageMutation } from "@/redux/api/auth/message/message";
import { useAddPaymentMutation } from "@/redux/api/payment/paymentApi";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { ChevronRight, DollarSign, Eye, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import studentImage from "../../../assets/default.jpg";

const MonthlyPayment = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openFormFor, setOpenFormFor] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sendMessage] = useSendSingleMessageMutation();

  const { data: students, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 10 },
    { name: "page", value: page },
    { name: "search", value: search },
  ]);

  const [addPayment] = useAddPaymentMutation();

  const form = useForm({
    defaultValues: {
      studentId: "",
      firstName: "",
      phone: "",
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

    let message = "";
    if (data.title === "Monthly") {
      message = `Dear ${data?.firstName}, your monthly fee for ${data.month} has been successfully paid.\n\nThank you for staying with EDUCARE!`;
    } else if (data.title === "ModelTest") {
      message = `Dear ${data?.firstName}, your Special Model Test fee has been successfully paid.\n\nThank you for staying with EDUCARE!`;
    } else if (data.title === "Others") {
      message = customMessage || `Dear ${data?.firstName}, your payment has been received.`;
    }

    const res: any = await addPayment(payload).unwrap();

    if (res?.statusCode == 200) {
      form.reset();
      setOpenFormFor(null);
      toast.success(res?.message || "Payment added successfully");
      const response = await sendMessage({
        message,
        number: data?.phone,
      }).unwrap();

      if (response?.data?.response_code == 202) {
        toast.success(`Message sent to ${data?.firstName} successfully`);
      }
    } else {
      toast.error("Failed to add payment");
    }
  };

  return (
    // ✅ Responsive padding: Adjusted for mobile, tablet, and desktop
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* ✅ Responsive Header */}
      <div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 overflow-x-auto">
          <span className="whitespace-nowrap">Payment</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">Student Monthly Fees</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Student Monthly Fees
        </h1>
      </div>

      {/* ✅ Responsive Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        <SearchInputField
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
        />
        <Button
          onClick={() => setSearch("")}
          className="w-full sm:w-auto bg-primary text-white text-sm sm:text-base"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Clear Filter</span>
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>

      {/* ✅ Responsive Table */}
      {isLoading ? (
        <Loading />
      ) : students?.data?.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SL No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="hidden md:table-cell">Std Id</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.data?.map((student: any, index: number) => (
                <>
                  <TableRow key={student.id}>
                    <TableCell data-label="SL No." className="hidden sm:table-cell">{index + 1}</TableCell>
                    <TableCell data-label="Full Name">
                      <div className="flex items-center gap-2">
                        <img
                          src={student?.image || studentImage}
                          alt={`${student?.firstName ?? ""} ${student?.lastName ?? ""}`}
                          className="size-8 sm:size-10 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-gray-500 block sm:hidden">{student.studentId}</div>
                          <div className="text-xs text-gray-500 block md:hidden">{student.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell data-label="Std Id" className="hidden md:table-cell">{student.studentId}</TableCell>
                    <TableCell data-label="Phone" className="hidden md:table-cell">{student.phone}</TableCell>
                    <TableCell data-label="Action">
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm"
                          onClick={() => {
                            form.setValue("studentId", student.id);
                            form.setValue("phone", student.phone);
                            form.setValue("firstName", student.firstName);
                            setOpenFormFor((prev) =>
                              prev === student.studentId
                                ? null
                                : student.studentId
                            );
                          }}
                        >
                          <DollarSign className="w-3 h-3 sm:w-5 sm:h-5 mr-1" />
                          <span className="hidden sm:inline">
                            {openFormFor === student.studentId
                              ? "Cancel"
                              : "Make Payment"}
                          </span>
                          <span className="sm:hidden">
                            {openFormFor === student.studentId ? "Cancel" : "Pay"}
                          </span>
                        </Button>
                        <Link to={`/payment/${student.id}`} className="w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm"
                          >
                            <Eye className="w-3 h-3 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* ✅ Responsive Collapsible Form Row */}
                  {openFormFor === student.studentId && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-2 sm:p-4">
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="p-3 sm:p-4 bg-muted rounded-md"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                              <SelectFieldWrapper
                                name="title"
                                label="Payment Title"
                                options={[
                                  { value: "Monthly", name: "Monthly" },
                                  { value: "ModelTest", name: "Model Test" },
                                  { value: "Others", name: "Other" },
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
                              {form.watch("title") === "Monthly" && (
                                <div className="col-span-1 sm:col-span-2 text-green-700 font-medium text-sm">
                                  This is your monthly payment message.
                                </div>
                              )}
                              {form.watch("title") === "ModelTest" && (
                                <div className="col-span-1 sm:col-span-2 text-blue-700 font-medium text-sm">
                                  This is your model test payment message.
                                </div>
                              )}
                              {form.watch("title") === "Others" && (
                                <div className="col-span-1 sm:col-span-2">
                                  <input
                                    type="text"
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Enter your custom message"
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                            <Button
                              type="submit"
                              className="w-full sm:w-auto bg-primary hover:bg-cyan-800 text-white flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-md transition text-sm sm:text-base"
                            >
                              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span>Submit Payment</span>
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
        <p className="text-center text-muted-foreground mt-10 text-sm sm:text-base">No data found</p>
      )}

      {/* ✅ Responsive Pagination */}
      {students?.meta?.total > students?.meta?.limit && (
        <EduCPagination
          page={page}
          setPage={setPage}
          totalPages={students?.meta?.totalPages}
          className="mt-4 flex justify-end text-xs sm:text-base"
        />
      )}
    </div>
  );
};

export default MonthlyPayment;