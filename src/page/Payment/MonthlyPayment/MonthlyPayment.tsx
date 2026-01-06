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
      message = `Dear ${data?.firstName}, your monthly fee for ${data.month} has been successfully paid.\n\nThanks for staying EDUCARE.`;
    } else if (data.title === "ModelTest") {
      message = `Dear ${data?.firstName}, your Special Model Test fee has been successfully paid.\n\nThanks for staying EDUCARE.`;
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
      console.log(response);

      if (response?.data?.response_code == 202) {
        toast.success(`Message send to ${data?.firstName} successfully`);
      }
    } else {
      toast.error("Failed to add payment");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Payment</span>
          <ChevronRight className="h-4 w-4" />
          <span>Student Monthly Fees</span>
        </div>
        <h1 className="text-3xl font-semibold text-foreground">Student Monthly Fees</h1>
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
          className="w-2/4 bg-primary text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Clear Filter
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="">
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
                              src={student?.image || studentImage}
                              alt={`${student?.firstName ?? ""} ${student?.lastName ?? ""}`}
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
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              className="bg-green-600 hover:bg-green-500 text-slate-100"
                              onClick={() => {
                                form.setValue("studentId", student.id); // store the real ID
                                form.setValue("phone", student.phone); // store the phone number
                                form.setValue("firstName", student.firstName); // store the first name
                                setOpenFormFor((prev) =>
                                  prev === student.studentId
                                    ? null
                                    : student.studentId
                                );
                              }}
                            >
                              {/* Icon */}
                              <DollarSign className="w-5 h-5" />{" "}
                              {/* Conditional rendering of button text */}
                              {openFormFor === student.studentId
                                ? "Cancel"
                                : "Make Payment"}
                            </Button>
                            <Link to={`/payment/${student.id}`}>
                              <Button
                                variant="outline"
                                className="bg-green-600 hover:bg-green-500 text-slate-100"
                              >
                                <Eye className="w-5 h-5" /> View Payment
                              </Button>
                            </Link>
                          </div>
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
                                  {/* Conditional message or input */}
                                  {form.watch("title") === "Monthly" && (
                                    <div className="col-span-2 text-green-700 font-medium">This is your monthly payment message.</div>
                                  )}
                                  {form.watch("title") === "ModelTest" && (
                                    <div className="col-span-2 text-blue-700 font-medium">This is your model test payment message.</div>
                                  )}
                                  {form.watch("title") === "Others" && (
                                    <div className="col-span-2">
                                      <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        placeholder="Enter your custom message"
                                        value={customMessage}
                                        onChange={e => setCustomMessage(e.target.value)}
                                      />
                                    </div>
                                  )}
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
            <p className="text-center text-gray-500 mt-10">No data found</p>
          )}
        </div>
      )}

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
