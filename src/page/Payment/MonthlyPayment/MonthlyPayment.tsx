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
import {
  ChevronRight,
  DollarSign,
  Eye,
  Plus,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
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
  const focusStudentId = (location.state as { focusStudentId?: string } | null)
    ?.focusStudentId;

  const filteredStudents = useMemo(() => {
    const allStudents = students?.data ?? [];

    const monthFilteredStudents = !filterMonth
      ? allStudents
      : allStudents.filter((student: any) => {
          const hasPaidForMonth = student?.Payment?.some(
            (payment: any) => payment.month === filterMonth,
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

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const form = useForm({
    defaultValues: {
      studentId: "",
      firstName: "",
      phone: "",
      month: "",
      tmpMonth: "",
      amount: "",
      title: "",
    },
  });

  // Prepare month options and disable future months (only current and previous allowed)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthIndex = new Date().getMonth(); // 0-based
  const currentMonth = monthNames[currentMonthIndex];
  const previousMonth =
    monthNames[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1];

  // Helper function to generate month options based on student payment history
  const getMonthOptions = (student: any) => {
    const studentPayments = student?.Payment || [];
    const currentAndPreviousPaid =
      studentPayments.some(
        (p: any) => p.month === currentMonth && Number(p.amount) > 0,
      ) &&
      studentPayments.some(
        (p: any) => p.month === previousMonth && Number(p.amount) > 0,
      );

    return monthNames.map((m, i) => ({
      value: m,
      name: m,
      disabled:
        // disable future months unless both current and previous are paid
        (i > currentMonthIndex && !currentAndPreviousPaid) ||
        selectedMonths.includes(m),
    }));
  };

  const onSubmit = async (data: any, studentPayments: any[] = []) => {
    const monthsToPay = selectedMonths.length
      ? selectedMonths
      : data.month
        ? [data.month]
        : [];
    const errors: { [key: string]: string } = {};

    // Validate that months are selected only for Monthly payments
    if (data.title === "Monthly" && !monthsToPay.length) {
      errors.months = "Month is not selected";
    }

    if (!data.amount || Number(data.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }

    // If validation errors exist, display them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear validation errors if all pass
    setValidationErrors({});

    if (data.title === "Monthly") {
      // prevent paying same month twice
      const alreadyPaid = monthsToPay.filter((m) =>
        studentPayments.some(
          (payment: any) => payment.month === m && Number(payment.amount) > 0,
        ),
      );

      if (alreadyPaid.length > 0 && Number(data.amount) > 0) {
        toast.error(`Payment already taken for: ${alreadyPaid.join(", ")}`);
        return;
      }
    }

    // Calculate average amount per month
    const totalAmount = Number(data.amount);
    const averageAmount =
      monthsToPay.length > 0
        ? parseFloat((totalAmount / monthsToPay.length).toFixed(2))
        : totalAmount;

    // Create payment payloads
    let payloads;
    if (monthsToPay.length > 0) {
      // For Monthly and ModelTest with months selected
      payloads = monthsToPay.map((m) => ({
        studentId: data.studentId,
        month: m,
        amount: averageAmount,
        title: data.title,
      }));
    } else {
      // For ModelTest and Others without months (single payment)
      payloads = [
        {
          studentId: data.studentId,
          month: null,
          amount: totalAmount,
          title: data.title,
        },
      ];
    }

    let allSuccess = true;

    for (const payload of payloads) {
      const res: any = await addPayment(payload).unwrap();
      if (res?.statusCode == 200) {
        // payment successful
      } else {
        allSuccess = false;
      }
    }

    if (allSuccess) {
      form.reset();
      setSelectedMonths([]);
      setOpenFormFor(null);

      const monthText =
        monthsToPay.length > 1 ? monthsToPay.join(", ") : monthsToPay[0] || "";
      const breakdownText =
        monthsToPay.length > 1
          ? `${monthsToPay.length} months @ $${averageAmount} each`
          : monthsToPay.length === 1
            ? `$${averageAmount}`
            : `$${totalAmount}`;

      toast.success(`Payment(s) added successfully!\n${breakdownText}`);

      let message = "";
      if (data.title === "Monthly") {
        message = `Dear ${data?.firstName}, your monthly fee for ${monthText} has been successfully paid.\n\nThank you for staying with EDUCARE!`;
      } else if (data.title === "ModelTest") {
        message = `Dear ${data?.firstName}, your Special Model Test fee has been successfully paid.\n\nThank you for staying with EDUCARE!`;
      } else if (data.title === "Others") {
        message =
          customMessage ||
          `Dear ${data?.firstName}, your payment has been received.`;
      }

      // SMS should never break a successful payment flow.
      if (data?.phone) {
        const smsResult: any = await sendMessage({
          message,
          number: data?.phone,
        });

        if (smsResult?.data?.success === true) {
          toast.success(`Message sent to ${data?.firstName} successfully`);
        } else if (smsResult?.error) {
          const backendStatus = smsResult?.error?.originalStatus || smsResult?.error?.status;
          const errorMessage =
            smsResult?.error?.data?.message ||
            smsResult?.error?.data?.error_message ||
            smsResult?.error?.message ||
            (backendStatus
              ? `SMS service failed with status ${backendStatus}`
              : "Message failed to send");

          toast.error(errorMessage);
        } else {
          toast.error(`Message failed to send to ${data?.firstName}`);
        }
      } else {
        toast.error(`Payment added, but no phone number was available to send a message to ${data?.firstName}`);
      }
    } else {
      toast.error("Failed to add one or more payments");
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
          className="w-fit px-3 sm:px-4 text-sm sm:text-base"
          variant="primaryGradient"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Clear Filters</span>
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>

      {/* ✅ Responsive Table */}
      {isLoading ? (
        <Loading />
      ) : filteredStudents?.length > 0 ? (
        <div className="border rounded-lg overflow-hidden bg-slate-100 p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">#.</TableHead>
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
                    className={
                      focusStudentId === student.id
                        ? "bg-amber-50 border-l-4 border-amber-600"
                        : ""
                    }
                  >
                    <TableCell
                      data-label="SL No."
                      className="hidden sm:table-cell"
                    >
                      {index + 1}
                    </TableCell>
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
                          <div className="text-xs text-gray-500 block sm:hidden">
                            {student.studentId}
                          </div>
                          <div className="text-xs text-gray-500 block md:hidden">
                            {student.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      data-label="Std Id"
                      className="hidden md:table-cell"
                    >
                      {student.studentId}
                    </TableCell>
                    <TableCell
                      data-label="Phone"
                      className="hidden md:table-cell"
                    >
                      {student.phone}
                    </TableCell>
                    <TableCell
                      data-label="Class"
                      className="hidden md:table-cell"
                    >
                      {student.className || "N/A"}
                    </TableCell>
                    <TableCell
                      data-label="Payment Status"
                      className="text-center"
                    >
                      {filterMonth ? (
                        (() => {
                          const hasPaidForMonth = student?.Payment?.some(
                            (payment: any) => payment.month === filterMonth,
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
                            setValidationErrors({});
                            setSelectedMonths([]);
                            setOpenFormFor((prev) =>
                              prev === student.studentId
                                ? null
                                : student.studentId,
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
                            {openFormFor === student.studentId
                              ? "Cancel"
                              : "Pay"}
                          </span>
                        </Button>
                        <Link
                          to={`/payment/${student.id}`}
                          className="w-full sm:w-auto"
                        >
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
                            onSubmit={form.handleSubmit((data) =>
                              onSubmit(data, student.Payment || []),
                            )}
                            className="p-3 sm:p-4 bg-white rounded-md"
                          >
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4">
                              <SelectFieldWrapper
                                name="title"
                                label="Payment Title"
                                required={true}
                                options={[
                                  { value: "Monthly", name: "Monthly" },
                                  { value: "ModelTest", name: "Model Test" },
                                  { value: "Others", name: "Other" },
                                ]}
                                control={form.control}
                              />

                              {/* Month selector - visible only for Monthly payments */}
                              {form.watch("title") === "Monthly" && (
                                <div>
                                  <SelectFieldWrapper
                                    name="tmpMonth"
                                    label="Add Month"
                                    required={form.watch("title") === "Monthly"}
                                    options={getMonthOptions(student).filter(
                                      (opt) => {
                                        // hide months already selected in the chips
                                        if (selectedMonths.includes(opt.value))
                                          return false;
                                        // hide months the student already paid for
                                        const hasPaid = (
                                          student?.Payment || []
                                        ).some(
                                          (p: any) =>
                                            p.month === opt.value &&
                                            Number(p.amount) > 0,
                                        );
                                        if (hasPaid) return false;
                                        return true;
                                      },
                                    )}
                                    control={form.control}
                                    onChange={(val: string) => {
                                      if (!val) return;
                                      // add if not already selected
                                      setSelectedMonths((prev) =>
                                        prev.includes(val)
                                          ? prev
                                          : [...prev, val],
                                      );
                                      // reset the temporary picker value
                                      form.setValue("tmpMonth", "");
                                    }}
                                  />

                                  {/* Selected month chips */}
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedMonths.map((m) => (
                                      <Badge
                                        key={m}
                                        className="flex items-center gap-2 text-white bg-orange-600 hover:bg-orange-600/80 px-2 py-1 rounded-md"
                                      >
                                        <span className="font-medium">{m}</span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setSelectedMonths((prev) =>
                                              prev.filter((x) => x !== m),
                                            )
                                          }
                                          className="ml-1 inline-flex items-center justify-center h-4 w-4 rounded-md bg-white text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm transition"
                                          aria-label={`Remove ${m}`}
                                          title={`Remove ${m}`}
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  {validationErrors.months && (
                                    <p className="text-red-600 text-sm mt-2">
                                      {validationErrors.months}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Amount field - placed after month selector */}
                              <FormFieldWrapper
                                name="amount"
                                label="Amount"
                                required={true}
                                placeholder="Enter amount"
                                type="number"
                              />
                              {validationErrors.amount && (
                                <p className="text-red-600 text-sm -mt-2">
                                  {validationErrors.amount}
                                </p>
                              )}
                              {form.watch("title") === "Others" && (
                                <div>
                                  <input
                                    type="text"
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="Enter your custom message"
                                    value={customMessage}
                                    onChange={(e) =>
                                      setCustomMessage(e.target.value)
                                    }
                                  />
                                </div>
                              )}
                            </div>

                            {/* Payment Breakdown Section */}
                            {selectedMonths.length > 0 &&
                              form.watch("amount") && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <h4 className="font-semibold text-sm text-blue-900 mb-3">
                                    Payment Breakdown
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                                    <div>
                                      <p className="text-gray-600 text-xs">
                                        Total Amount
                                      </p>
                                      <p className="font-bold text-blue-900">
                                        {Number(form.watch("amount")).toFixed(
                                          2,
                                        )}
                                        TK
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 text-xs">
                                        Months Selected
                                      </p>
                                      <p className="font-bold text-blue-900">
                                        {selectedMonths.length}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 text-xs">
                                        Amount per Month
                                      </p>
                                      <p className="font-bold text-blue-900">
                                        {(
                                          Number(form.watch("amount")) /
                                          selectedMonths.length
                                        ).toFixed(2)}
                                        TK
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    Distribution:
                                  </p>
                                  <div className="space-y-1 text-xs">
                                    {selectedMonths.map((month) => (
                                      <div
                                        key={month}
                                        className="flex justify-between items-center p-2 bg-white rounded border border-blue-100"
                                      >
                                        <span className="text-gray-700">
                                          {month}
                                        </span>
                                        <span className="font-semibold text-blue-900">
                                          {(
                                            Number(form.watch("amount")) /
                                            selectedMonths.length
                                          ).toFixed(2)}
                                          TK
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            <Button
                              variant="primaryGradient"
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
        <p className="text-center text-muted-foreground mt-10 text-sm sm:text-base">
          No data found
        </p>
      )}
    </div>
  );
};

export default MonthlyPayment;
