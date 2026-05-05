/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import { useGetAllStudentQuery } from "@/redux/api/studentApi/studentApi";
import { months } from "@/constants/months";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loading from "@/components/Loading";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import UnpaidOverviewFilters from "./_component/UnpaidOverviewFilters";

export default function UnpaidOverview() {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectClass, setSelectClass] = useState("");
  const [shift, setShift] = useState("");

  const { data: studentsRes, isLoading } = useGetAllStudentQuery([
    { name: "limit", value: 99999 },
  ]);

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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Unpaid Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredOverview.length} student{filteredOverview.length === 1 ? "" : "s"} with due records
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      <div ref={printRef}>
        <Card className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-muted/50 text-sm">
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
