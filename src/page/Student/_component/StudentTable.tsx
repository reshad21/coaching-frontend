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
import StudentPDFGenerator from "./StudentPDFGenerator";
import { useGetSiteSettingQuery } from "@/redux/api/siteSettingApi/siteSettingApi";
import Loading from "@/components/Loading";

interface StudentTableProps {
  students: any[];
  onDelete: (id?: string) => void;
}

const StudentTable = ({ students, onDelete }: StudentTableProps) => {
  const { data, isLoading } = useGetSiteSettingQuery([]);
  
  if (isLoading) {
    return <Loading />;
  }
  
  const logo = data?.data[0].logo || "";
  const brandName = data?.data[0].brandName || "";

  return (
    <div className="border border-border rounded-lg whitespace-nowrap">
      <div className="flex justify-end m-4">
        <StudentPDFGenerator 
          students={students}
          logo={logo}
          brandName={brandName}
        />
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