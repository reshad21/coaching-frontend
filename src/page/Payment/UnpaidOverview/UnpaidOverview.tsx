/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { months } from "@/constants/months";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useSendSingleMessageMutation } from "@/redux/api/auth/message/message";
import UnpaidOverviewFilters from "./_component/UnpaidOverviewFilters";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function UnpaidOverview() {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectClass, setSelectClass] = useState("");
  const [shift, setShift] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [isSendingBulkMessage, setIsSendingBulkMessage] = useState(false);

  const { data: studentsRes, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 99999 },
  ]);
  const [sendSingleMessage] = useSendSingleMessageMutation();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentMonthIndex = months.indexOf(currentMonth);

  const overview = useMemo(() => {
    const allStudents = studentsRes?.data ?? [];

    return allStudents
      .map((s: any) => {
        const paidMonths = (s?.Payment || []).map((p: any) => p.month);
        const dueMonths = currentMonthIndex >= 0 ? months.slice(0, currentMonthIndex + 1) : months;
        const unpaid = dueMonths.filter((m) => !paidMonths.includes(m));
        // Only mark the current month as the special highlighted unpaid month.
        const nextUnpaid = !paidMonths.includes(currentMonth) ? currentMonth : undefined;
        return {
          id: s.id,
          name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          studentId: s.studentId,
          className: s.className,
          batchName: s.batchName || s.Batch?.batchName || "",
          shiftName: s.shiftName || s.Shift?.shiftName || "",
          phone: s.phone,
          unpaidMonths: unpaid,
          nextUnpaidMonth: nextUnpaid,
        };
      })
      .filter((r: any) => r.unpaidMonths.length > 0);
  }, [studentsRes?.data, currentMonth, currentMonthIndex]);

  const filteredOverview = useMemo(() => {
    return overview.filter((row: any) => {
      const matchesBatch = selectedBatch ? row.batchName === selectedBatch : true;
      const matchesClass = selectClass ? row.className === selectClass : true;
      const matchesShift = shift ? row.shiftName === shift : true;

      return matchesBatch && matchesClass && matchesShift;
    });
  }, [overview, selectedBatch, selectClass, shift]);

  const clearFilters = () => {
    setSelectedBatch("");
    setSelectClass("");
    setShift("");
  };

  const dueStudentsWithPhone = useMemo(() => {
    return filteredOverview.filter((student: any) => Boolean(student.phone));
  }, [filteredOverview]);

  const handleSendBulkMessage = async () => {
    if (!bulkMessage.trim()) {
      toast.error("please write Message");
      return;
    }

    if (dueStudentsWithPhone.length === 0) {
      toast.error("No due students with phone numbers found");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Send this message to ${dueStudentsWithPhone.length} due student${dueStudentsWithPhone.length === 1 ? "" : "s"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#03A791",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send message!",
    });

    if (!result.isConfirmed) return;

    setIsSendingBulkMessage(true);

    try {
      let successCount = 0;
      let failedCount = 0;

      for (const student of dueStudentsWithPhone) {
        try {
          const response = await sendSingleMessage({
            message: bulkMessage,
            number: student.phone,
          }).unwrap();

          if (response?.data?.response_code == 202) {
            successCount += 1;
          } else {
            failedCount += 1;
          }
        } catch {
          failedCount += 1;
        }
      }

      if (successCount > 0) {
        toast.success(`Message sent to ${successCount} due student${successCount === 1 ? "" : "s"}`);
      }
      if (failedCount > 0) {
        toast.error(`Failed to send to ${failedCount} student${failedCount === 1 ? "" : "s"}`);
      }

      if (successCount > 0 && failedCount === 0) {
        setBulkMessage("");
      }
    } finally {
      setIsSendingBulkMessage(false);
    }
  };

  const printRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const el = printRef.current;
    const canvas = await html2canvas(el, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("unpaid-overview.pdf");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full min-w-0 overflow-x-hidden p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold">Unpaid Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredOverview.length} student{filteredOverview.length === 1 ? "" : "s"} with due records
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button onClick={handleDownloadPdf} className="bg-primary text-white">
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <UnpaidOverviewFilters
          selectedBatch={selectedBatch}
          selectClass={selectClass}
          shift={shift}
          onBatchChange={setSelectedBatch}
          onClassChange={setSelectClass}
          onShiftChange={setShift}
          onClearFilters={clearFilters}
        />
      </div>

      <Card className="mb-4 min-w-0 p-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">Send message to all due students</h3>
              <p className="text-xs text-muted-foreground">
                The message will be sent to every filtered student with a due payment and phone number.
              </p>
            </div>
            <span className="text-xs text-muted-foreground sm:text-right sm:whitespace-nowrap">
              {dueStudentsWithPhone.length} recipient{dueStudentsWithPhone.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-message">Message</Label>
            <textarea
              id="bulk-message"
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              placeholder="Write the message you want to send to all due students"
              className="border p-3 rounded w-full shadow-sm min-h-[120px] focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              onClick={() => setBulkMessage("")}
              variant="outline"
              disabled={!bulkMessage || isSendingBulkMessage}
            >
              Clear Message
            </Button>
            <Button
              type="button"
              onClick={handleSendBulkMessage}
              className="bg-primary text-white"
              disabled={isSendingBulkMessage || dueStudentsWithPhone.length === 0}
            >
              {isSendingBulkMessage ? "Sending..." : "Send to All Due Students"}
            </Button>
          </div>
        </div>
      </Card>

      <div ref={printRef}>
        <Card className="min-w-0 overflow-hidden p-4">
          <div className="max-h-[60vh] overflow-auto sm:max-h-[65vh] lg:max-h-[70vh]">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="sticky top-0 z-10 bg-muted/50 text-sm">
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Student</th>
                  <th className="text-left p-2 hidden sm:table-cell">ID</th>
                  <th className="text-left p-2 hidden sm:table-cell">Class</th>
                  <th className="text-left p-2 hidden sm:table-cell">Phone</th>
                  <th className="text-left p-2">Due Months</th>
                </tr>
              </thead>
              <tbody>
                {filteredOverview.map((row: any, idx: number) => (
                  <tr key={row.id} className="border-t align-top">
                    <td className="p-2 align-top w-6">{idx + 1}</td>
                    <td className="p-2 align-top">
                      <div className="font-medium">{row.name || "-"}</div>
                      <div className="text-xs text-muted-foreground mt-1 block sm:hidden">
                        <div>Id: {row.studentId || "-"}</div>
                        <div>Class: {row.className || "-"}</div>
                        <div>Batch: {row.batchName || "-"}</div>
                        <div>Shift: {row.shiftName || "-"}</div>
                        <div>Phone: {row.phone || "-"}</div>
                      </div>
                    </td>
                    <td className="p-2 align-top hidden sm:table-cell">{row.studentId || "-"}</td>
                    <td className="p-2 align-top hidden sm:table-cell">{row.className || "-"}</td>
                    <td className="p-2 align-top hidden sm:table-cell">{row.phone || "-"}</td>
                    <td className="p-2 align-top">
                      <div className="flex flex-wrap gap-2">
                        {row.unpaidMonths.map((m: string) => {
                          const mIdx = months.indexOf(m);
                          const currentIdx = months.indexOf(currentMonth);
                          const isOverdue = mIdx < currentIdx;
                          const isCurrent = mIdx === currentIdx && m === row.nextUnpaidMonth;
                          const classes = isCurrent
                            ? "px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs sm:text-sm"
                            : isOverdue
                            ? "px-2 py-1 bg-red-200 text-red-900 rounded text-xs sm:text-sm"
                            : "px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs sm:text-sm";
                          const title = isCurrent ? "Current unpaid month" : isOverdue ? "Overdue unpaid month" : undefined;

                          return (
                            <span key={m} className={classes} title={title}>
                              {m}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOverview.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">
                      No due records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
