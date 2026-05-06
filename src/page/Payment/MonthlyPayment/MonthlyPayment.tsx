/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import SearchInputField from "@/components/CommonSearch/SearchInputField";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
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
import { ChevronRight, DollarSign, Eye, Plus, RotateCcw, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import studentImage from "../../../assets/default.jpg";

const MonthlyPayment = () => {
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openFormFor, setOpenFormFor] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sendMessage] = useSendSingleMessageMutation();
  const location = useLocation();

  const queryParams: any[] = [
    { name: "limit", value: 99999 },
    { name: "search", value: search },
  ];

  const { data: students, isLoading } = useGetAllStudentQuery(queryParams);
  const focusStudentId = (location.state as { focusStudentId?: string } | null)?.focusStudentId;

  const filteredStudents = useMemo(() => {
    const allStudents = students?.data ?? [];

    const monthFilteredStudents = !filterMonth
      ? allStudents
      : allStudents.filter((student: any) => {
          const hasPaidForMonth = student?.Payment?.some(
            (payment: any) => payment.month === filterMonth
          );

          if (!filterStatus) {
            return true;
          }

          if (filterStatus === "paid") {
            return hasPaidForMonth;
          }

          if (filterStatus === "unpaid") {
            return !hasPaidForMonth;
          }

          return true;
        });

    if (!focusStudentId) {
      return monthFilteredStudents;
    }

    return [...monthFilteredStudents].sort((a: any, b: any) => {
      if (a.id === focusStudentId) return -1;
      if (b.id === focusStudentId) return 1;
      return 0;
    });
  }, [students?.data, filterMonth, filterStatus, focusStudentId]);

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

  const onSubmit = async (data: any, studentPayments: any[] = []) => {
    if (data.title === "Monthly") {
      const alreadyPaidMonth = studentPayments.some(
        (payment: any) => payment.month === data.month && Number(payment.amount) > 0
      );

      if (alreadyPaidMonth && Number(data.amount) > 0) {
        toast.error("Payment already taken this month");
        return;
      }
    }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <SearchInputField
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
        />
        <select
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
            setFilterStatus("");
          }}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">All Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          disabled={!filterMonth}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Payment Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Not Paid</option>
        </select>
        <Button
          onClick={() => {
            setSearch("");
            setFilterMonth("");
            setFilterStatus("");
          }}
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
      ) : filteredStudents?.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SL No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead className="hidden md:table-cell">Std Id</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Class</TableHead>
                <TableHead className="text-center">Payment Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents?.map((student: any, index: number) => (
                <>
                  <TableRow
                    key={student.id}
                    className={focusStudentId === student.id ? "bg-amber-50 border-l-4 border-amber-600" : ""}
                  >
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
                    <TableCell data-label="Class" className="hidden md:table-cell">{student.className || "N/A"}</TableCell>
                    <TableCell data-label="Payment Status" className="text-center">
                      {filterMonth ? (
                        (() => {
                          const hasPaidForMonth = student?.Payment?.some(
                            (payment: any) => payment.month === filterMonth
                          );
                          return hasPaidForMonth ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center justify-center gap-1 mx-auto w-fit">
                              <Check className="w-3 h-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center gap-1 mx-auto w-fit">
                              <X className="w-3 h-3" />
                              Not Paid
                            </Badge>
                          );
                        })()
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-1 mx-auto w-fit">
                          <span>—</span>
                          No Filter
                        </Badge>
                      )}
                    </TableCell>
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
                      <TableCell colSpan={7} className="p-2 sm:p-4">
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit((data) => onSubmit(data, student.Payment || []))}
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
    </div>
  );
};

export default MonthlyPayment;