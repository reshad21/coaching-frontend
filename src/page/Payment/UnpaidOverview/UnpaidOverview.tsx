/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { months } from "@/constants/months";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
import { useSendSingleMessageMutation } from "@/redux/api/auth/message/message";
import UnpaidOverviewFilters from "./_component/UnpaidOverviewFilters";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AlertCircle, Download, Send, Trash2, Users, PhoneCall, Settings } from "lucide-react";

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
      toast.error("Please write a message");
      return;
    }

    if (dueStudentsWithPhone.length === 0) {
      toast.error("No due students with phone numbers found");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Message Send",
      text: `Send this message to ${dueStudentsWithPhone.length} due student${dueStudentsWithPhone.length === 1 ? "" : "s"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06B6D4",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Send Message",
      cancelButtonText: "Cancel",
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
        toast.success(`Message sent to ${successCount} student${successCount === 1 ? "" : "s"}`);
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

      // Header section
      pdf.setFillColor(6, 182, 212);
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
      pdf.setFillColor(6, 182, 212);
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

        if (yPosition + rowHeight > pageHeight - 15) {
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth / 2, pageHeight - 8, { align: "center" });

          pdf.addPage();
          yPosition = 15;

          pdf.setFillColor(6, 182, 212);
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

        if (idx % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          xPos = 10;
          colWidths.forEach((width) => {
            pdf.rect(xPos, yPosition, width, rowHeight, "F");
            xPos += width;
          });
        }

        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.1);
        xPos = 10;
        colWidths.forEach((width) => {
          pdf.rect(xPos, yPosition, width, rowHeight);
          xPos += width;
        });

        pdf.setTextColor(0, 0, 0);
        xPos = 10;
        colWidths.forEach((width, colIdx) => {
          const cellLines = wrappedRowData[colIdx];
          pdf.text(cellLines, xPos + cellPaddingX, yPosition + 4);
          xPos += width;
        });

        yPosition += rowHeight;
      });

      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth / 2, pageHeight - 8, { align: "center" });

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
    <div className="w-full p-4 md:p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        * {
          font-family: 'DM Sans', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }

        .table-scroll-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .table-scroll-container::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 6px;
        }
        .table-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #0891b2);
          border-radius: 6px;
        }
        .table-scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #0e7490);
        }
        .table-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #06b6d4 #f5f5f5;
        }

        .stat-card {
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #06b6d4, #0891b2);
        }

        .stat-card:hover {
          border-color: #06b6d4;
          box-shadow: 0 10px 25px rgba(6, 182, 212, 0.1);
          transform: translateY(-2px);
        }

        .gradient-text {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .button-primary {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 12px;
          padding: 12px 24px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
        }

        .button-primary:active {
          transform: translateY(0);
        }

        .button-secondary {
          background: white;
          border: 2px solid #e5e7eb;
          color: #374151;
          font-weight: 600;
          border-radius: 12px;
          padding: 10px 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .button-secondary:hover {
          border-color: #06b6d4;
          color: #06b6d4;
        }

        .table-header-cell {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.05) 100%);
          border-bottom: 2px solid #e5e7eb;
          font-weight: 700;
          color: #1f2937;
        }

        .table-row-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid #f3f4f6;
        }

        .table-row-hover:hover {
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%);
        }

        .month-badge {
          transition: all 0.2s ease;
          font-weight: 600;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          display: inline-block;
        }

        .month-badge-current {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .month-badge-overdue {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .month-badge-upcoming {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .month-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-down {
          animation: slideInDown 0.5s ease-out;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out 0.1s backwards;
        }

        .card-modern {
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .card-modern:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: #d1d5db;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-slide-in-down">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Unpaid Overview
              </h1>
              <p className="text-gray-600 text-lg">
                Track and manage student payment records
              </p>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="button-primary flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Download size={20} />
              Download Report
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card animate-slide-in-up">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">Total Due Students</p>
                  <p className="text-4xl font-bold gradient-text mt-2">{filteredOverview.length}</p>
                </div>
                <Users className="text-cyan-500 opacity-60" size={40} />
              </div>
            </div>

            <div className="stat-card animate-slide-in-up">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">With Phone Numbers</p>
                  <p className="text-4xl font-bold gradient-text mt-2">{dueStudentsWithPhone.length}</p>
                </div>
                <PhoneCall className="text-cyan-500 opacity-60" size={40} />
              </div>
            </div>

            <div className="stat-card animate-slide-in-up">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">Active Filters</p>
                  <p className="text-4xl font-bold gradient-text mt-2">
                    {[selectedBatch, selectClass, shift].filter(Boolean).length}
                  </p>
                </div>
                <Settings className="text-cyan-500 opacity-60" size={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 animate-slide-in-up">
          <div className="card-modern">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
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
        </div>

        {/* Messaging Section */}
        <div className="mb-6 animate-slide-in-up">
          <div className="card-modern">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Send Bulk Message</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {dueStudentsWithPhone.length} student{dueStudentsWithPhone.length !== 1 ? "s" : ""} ready to receive messages
                </p>
              </div>
              <Send className="text-cyan-500 opacity-60" size={28} />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="bulk-message" className="text-gray-900 font-semibold block mb-3">
                  Message Content
                </Label>
                <textarea
                  id="bulk-message"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Type your message here... (e.g., 'Dear Student, please pay your pending dues...')"
                  className="w-full border border-gray-300 rounded-12 p-4 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 resize-none min-h-[120px] transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setBulkMessage("")}
                  disabled={!bulkMessage || isSendingBulkMessage}
                  className="button-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                  Clear Message
                </button>
                <button
                  type="button"
                  onClick={handleSendBulkMessage}
                  disabled={isSendingBulkMessage || dueStudentsWithPhone.length === 0}
                  className="button-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                  {isSendingBulkMessage ? "Sending..." : `Send to ${dueStudentsWithPhone.length}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="animate-slide-in-up">
          <div className="card-modern">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Student Details</h3>
            <div className="table-scroll-container overflow-x-auto overflow-y-auto max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] rounded-lg border border-gray-200">
              <table className="w-full table-auto border-collapse min-w-max">
                <thead>
                  <tr>
                    <th className="table-header-cell text-left p-4 font-bold text-sm">#</th>
                    <th className="table-header-cell text-left p-4 font-bold text-sm">Student Name</th>
                    <th className="table-header-cell text-left p-4 font-bold text-sm hidden sm:table-cell">ID</th>
                    <th className="table-header-cell text-left p-4 font-bold text-sm hidden sm:table-cell">Class</th>
                    <th className="table-header-cell text-left p-4 font-bold text-sm hidden md:table-cell">Phone</th>
                    <th className="table-header-cell text-left p-4 font-bold text-sm">Due Months</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOverview.map((row: any, idx: number) => (
                    <tr key={row.id} className="table-row-hover">
                      <td className="p-4 text-gray-900 text-sm font-semibold">{idx + 1}</td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">{row.name || "-"}</div>
                        <div className="text-xs text-gray-500 mt-2 space-y-1 sm:hidden">
                          <div>ID: {row.studentId || "-"}</div>
                          <div>Class: {row.className || "-"}</div>
                          <div>Phone: {row.phone || "-"}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 text-sm hidden sm:table-cell">{row.studentId || "-"}</td>
                      <td className="p-4 text-gray-700 text-sm hidden sm:table-cell">{row.className || "-"}</td>
                      <td className="p-4 text-gray-700 text-sm hidden md:table-cell">{row.phone || "-"}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {row.unpaidMonths.map((m: string) => {
                            const mIdx = months.indexOf(m);
                            const currentIdx = months.indexOf(currentMonth);
                            const isOverdue = mIdx < currentIdx;
                            const isCurrent = mIdx === currentIdx && m === row.nextUnpaidMonth;

                            let badgeClass = "month-badge";
                            if (isCurrent) {
                              badgeClass += " month-badge-current";
                            } else if (isOverdue) {
                              badgeClass += " month-badge-overdue";
                            } else {
                              badgeClass += " month-badge-upcoming";
                            }

                            const title = isCurrent ? "Current unpaid month" : isOverdue ? "Overdue unpaid month" : "Upcoming month";

                            return (
                              <span key={m} className={badgeClass} title={title}>
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
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="text-gray-400 mb-3" size={48} />
                          <p className="text-gray-600 font-medium">No due records found</p>
                          <p className="text-gray-500 text-sm mt-1">Adjust your filters to see more results</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}