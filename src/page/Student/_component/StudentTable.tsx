/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import defaultImg from "@/assets/default.jpg";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Eye,
  Edit3,
  Trash2,
  GraduationCap,
  Clock,
  Phone,
  Hash,
} from "lucide-react";
import { Link } from "react-router-dom";
import SendMessage from "../View/SendMessage/SendMessage";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetSiteSettingQuery } from "@/redux/api/siteSettingApi/siteSettingApi";

interface StudentTableProps {
  students: any[];
  onDelete: (id?: string) => void;
}

const StudentTable = ({ students, onDelete }: StudentTableProps) => {
  //logo image as base64
  const { data, isLoading } = useGetSiteSettingQuery([]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const logo = data?.data[0].logo || "";
  const brandName = data?.data[0].brandName || "";

  //pdf download handler
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
    doc.text(brandName || "School Name", pageWidth / 2, 18, {
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

    const tableRows = students.map((student: any, index: number) => [
      index + 1,
      `${student?.firstName || ""} ${student?.lastName || ""}`,
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
      didDrawPage: (data) => {
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
    <div className="border border-border rounded-lg whitespace-nowrap">
      <div className="flex justify-end m-4">
        <Button onClick={handleDownloadPDF}>Download PDF</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-muted-foreground font-medium">
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                Student Details
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Student ID
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3 h-3" />
                Class
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Shift
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                Contact
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Batch
            </TableHead>
            <TableHead className="text-muted-foreground font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student: any, index: number) => (
            <TableRow
              key={student.id}
              className="border-border hover:bg-muted/30 transition-colors"
            >
              <TableCell className="whitespace-nowrap">
                <span className="text-muted-foreground font-mono text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={student?.image || defaultImg}
                      alt={`${student?.firstName} ${student?.lastName}`}
                      className="w-10 h-10 rounded-lg object-cover border border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-card"></div>
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground">
                      {student?.firstName} {student?.lastName}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="outline" className="font-mono">
                  {student?.studentId}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="secondary">
                  {student.Class?.className || "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">
                    {student?.shiftName || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm text-card-foreground font-mono">
                    {student?.phone || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="outline">
                  {student.Batch?.batchName || "N/A"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Link to={`/view-student/${student.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to={`/update-student/${student.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(student.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <SendMessage student={student} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
