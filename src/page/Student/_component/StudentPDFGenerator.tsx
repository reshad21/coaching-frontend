import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Student {
  id: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  phone?: string;
  shiftName?: string;
  Class?: {
    className?: string;
  };
  Batch?: {
    batchName?: string;
  };
}

interface StudentPDFGeneratorProps {
  students: Student[];
  logo?: string;
  brandName?: string;
  className?: string;
}

const StudentPDFGenerator = ({
  students,
  logo = "",
  brandName = "School Name",
  className = "",
}: StudentPDFGeneratorProps) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /* ---------- HEADER ---------- */
    if (logo) {
      // Try to detect image type from base64 string, fallback to PNG
      const imageType = logo.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(logo, imageType, 14, 10, 20, 20);
    }

    doc.setFontSize(16);
    doc.text(brandName, pageWidth / 2, 18, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Student Information Report", pageWidth / 2, 25, {
      align: "center",
    });

    const date = new Date().toLocaleDateString();
    doc.text(`Generated: ${date}`, pageWidth - 14, 15, { align: "right" });

    /* ---------- TABLE ---------- */
    const tableColumn = [
      "SL",
      "Name",
      "Student ID",
      "Class",
      "Shift",
      "Phone",
      "Batch",
    ];

    const tableRows = students.map((student: Student, index: number) => [
      index + 1,
      `${student?.firstName || ""} ${student?.lastName || ""}`.trim(),
      student?.studentId || "N/A",
      student?.Class?.className || "N/A",
      student?.shiftName || "N/A",
      student?.phone || "N/A",
      student?.Batch?.batchName || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 76, 48],
        textColor: 255,
      },
      didDrawPage: () => {
        /* ---------- FOOTER ---------- */
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      },
    });

    doc.save("student-list.pdf");
  };

  return (
    <Button className={`text-white ${className}`} onClick={handleDownloadPDF}>
      Download PDF
    </Button>
  );
};

export default StudentPDFGenerator;