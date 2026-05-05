/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { months } from "@/constants/months";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
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

  const handleDownloadPdf = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Header section with background
      pdf.setFillColor(3, 167, 145); // Primary teal color
      pdf.rect(0, 0, pageWidth, 28, "F");

      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("Unpaid Overview Report", 15, 12);

      // Date
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      pdf.text(`Generated: ${currentDate} at ${currentTime}`, 15, 20);

      yPosition = 40;

      // Summary section
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Summary", 15, yPosition);

      yPosition += 8;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      // Summary details
      const summaryY = yPosition;
      pdf.text(`Total Students with Due Records: ${filteredOverview.length}`, 15, summaryY);

      const filterDetails = [];
      if (selectedBatch) filterDetails.push(`Batch: ${selectedBatch}`);
      if (selectClass) filterDetails.push(`Class: ${selectClass}`);
      if (shift) filterDetails.push(`Shift: ${shift}`);

      const filtersText = filterDetails.length > 0 ? `Filters: ${filterDetails.join(" • ")}` : "Filters: None";
      pdf.text(filtersText, 15, summaryY + 6);

      yPosition = summaryY + 16;

      // Table headers
      const headers = ["#", "Student Name", "ID", "Class", "Phone", "Due Months"];
      const colWidths = [7, 30, 18, 20, 24, 63];
      const headerHeight = 7;

      // Draw header background
      pdf.setFillColor(3, 167, 145);
      let xPos = 10;
      colWidths.forEach((width) => {
        pdf.rect(xPos, yPosition, width, headerHeight, "F");
        xPos += width;
      });

      // Draw header text
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      xPos = 10;
      headers.forEach((header, idx) => {
        pdf.text(header, xPos + 0.5, yPosition + 5, { maxWidth: colWidths[idx] - 1 });
        xPos += colWidths[idx];
      });

      yPosition += headerHeight;

      // Draw table rows
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      const lineHeight = 4;
      const cellPaddingY = 2;
      const cellPaddingX = 0.5;

      filteredOverview.forEach((row: any, idx: number) => {
        const rowData = [
          String(idx + 1),
          row.name || "-",
          row.studentId || "-",
          row.className || "-",
          row.phone || "-",
          row.unpaidMonths.join(", "),
        ];

        const wrappedRowData = rowData.map((cellText, colIdx) =>
          pdf.splitTextToSize(String(cellText), colWidths[colIdx] - 1)
        );
        const rowLineCount = Math.max(...wrappedRowData.map((lines) => lines.length || 1));
        const rowHeight = Math.max(8, rowLineCount * lineHeight + cellPaddingY * 2);

        // Check if we need a new page
        if (yPosition + rowHeight > pageHeight - 15) {
          // Add footer to current page
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(
            `Page ${pdf.getNumberOfPages()}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
          );

          // Add new page
          pdf.addPage();
          yPosition = 15;

          // Repeat header on new page
          pdf.setFillColor(3, 167, 145);
          xPos = 10;
          colWidths.forEach((width) => {
            pdf.rect(xPos, yPosition, width, headerHeight, "F");
            xPos += width;
          });

          pdf.setTextColor(255, 255, 255);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9);
          xPos = 10;
          headers.forEach((header) => {
            pdf.text(header, xPos + 0.5, yPosition + 5, { maxWidth: colWidths[headers.indexOf(header)] - 1 });
            xPos += colWidths[headers.indexOf(header)];
          });

          yPosition += headerHeight;
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
        }

        // Alternate row colors
        if (idx % 2 === 0) {
          pdf.setFillColor(240, 245, 245);
          xPos = 10;
          colWidths.forEach((width) => {
            pdf.rect(xPos, yPosition, width, rowHeight, "F");
            xPos += width;
          });
        }

        // Draw row border
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.1);
        xPos = 10;
        colWidths.forEach((width) => {
          pdf.rect(xPos, yPosition, width, rowHeight);
          xPos += width;
        });

        // Add row data
        pdf.setTextColor(0, 0, 0);
        xPos = 10;
        colWidths.forEach((width, colIdx) => {
          const cellLines = wrappedRowData[colIdx];
          pdf.text(cellLines, xPos + cellPaddingX, yPosition + 4);
          xPos += width;
        });

        yPosition += rowHeight;
      });

      // Add footer to last page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${pdf.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      // Add bottom info
      pdf.setFontSize(7);
      pdf.text(
        "This is an automatically generated report. For more details, contact your administrator.",
        pageWidth / 2,
        pageHeight - 4,
        { align: "center" }
      );

      pdf.save("unpaid-overview-report.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full p-4">
      <style>{`
        .table-scroll-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .table-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 6px;
        }
        .table-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 6px;
          border: 2px solid #f1f1f1;
        }
        .table-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .table-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f1f1;
        }
      `}</style>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
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

      <Card className="mb-4 p-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div>
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

      <Card className="overflow-hidden p-4">
        <div className="table-scroll-container overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh]">
          <table className="w-full table-auto border-collapse min-w-max">
            <thead>
              <tr className="sticky top-0 z-10 bg-muted/50 text-sm bg-white">
                <th className="text-left p-3 font-semibold text-gray-700">#</th>
                <th className="text-left p-3 font-semibold text-gray-700">Student</th>
                <th className="text-left p-3 font-semibold text-gray-700 hidden sm:table-cell">ID</th>
                <th className="text-left p-3 font-semibold text-gray-700 hidden sm:table-cell">Class</th>
                <th className="text-left p-3 font-semibold text-gray-700 hidden sm:table-cell">Phone</th>
                <th className="text-left p-3 font-semibold text-gray-700">Due Months</th>
              </tr>
            </thead>
            <tbody>
              {filteredOverview.map((row: any, idx: number) => (
                <tr key={row.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm w-8">{idx + 1}</td>
                  <td className="p-3 text-sm">
                    <div className="font-medium text-gray-900">{row.name || "-"}</div>
                    <div className="text-xs text-muted-foreground mt-1 block sm:hidden space-y-1">
                      <div>Id: {row.studentId || "-"}</div>
                      <div>Class: {row.className || "-"}</div>
                      <div>Phone: {row.phone || "-"}</div>
                    </div>
                  </td>
                  <td className="p-3 text-sm hidden sm:table-cell text-gray-700">{row.studentId || "-"}</td>
                  <td className="p-3 text-sm hidden sm:table-cell text-gray-700">{row.className || "-"}</td>
                  <td className="p-3 text-sm hidden sm:table-cell text-gray-700">{row.phone || "-"}</td>
                  <td className="p-3 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {row.unpaidMonths.map((m: string) => {
                        const mIdx = months.indexOf(m);
                        const currentIdx = months.indexOf(currentMonth);
                        const isOverdue = mIdx < currentIdx;
                        const isCurrent = mIdx === currentIdx && m === row.nextUnpaidMonth;
                        const classes = isCurrent
                          ? "px-3 py-1.5 bg-amber-100 text-amber-800 rounded font-medium text-xs sm:text-sm whitespace-nowrap"
                          : isOverdue
                          ? "px-3 py-1.5 bg-red-100 text-red-800 rounded font-medium text-xs sm:text-sm whitespace-nowrap"
                          : "px-3 py-1.5 bg-gray-100 text-gray-700 rounded font-medium text-xs sm:text-sm whitespace-nowrap";
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
                  <td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">
                    No due records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}