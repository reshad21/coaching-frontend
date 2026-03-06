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

  if (isLoading) return <Loading />;

  const logo = data?.data[0].logo || "";
  const brandName = data?.data[0].brandName || "";

  return (
    <div className="w-full">
      {/* ✅ Responsive button container: Responsive padding and size */}
      <div className="flex justify-end m-2 sm:m-4">
        <StudentPDFGenerator
          students={students}
          logo={logo}
          brandName={brandName}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-muted-foreground font-medium w-8 sm:w-10 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
              </div>
            </TableHead>
            <TableHead className="text-muted-foreground font-medium min-w-[140px] sm:min-w-[180px] text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span className="hidden sm:inline">Student Details</span>
                <span className="sm:hidden">Student</span>
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell text-muted-foreground font-medium min-w-[120px] text-xs sm:text-sm">
              Student ID
            </TableHead>
            <TableHead className="hidden md:table-cell text-muted-foreground font-medium min-w-[100px] text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                <span className="hidden lg:inline">Class</span>
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell text-muted-foreground font-medium min-w-[160px] text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 flex-shrink-0" />
                Shift
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell text-muted-foreground font-medium min-w-[150px] text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span className="hidden lg:inline">Contact</span>
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell text-muted-foreground font-medium min-w-[130px] text-xs sm:text-sm">
              Batch
            </TableHead>
            <TableHead className="text-muted-foreground font-medium min-w-[100px] sm:min-w-[140px] text-xs sm:text-sm">
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
              {/* # */}
              <TableCell className="text-xs sm:text-sm">
                <span className="text-muted-foreground font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </TableCell>

              {/* ✅ Responsive Student Details: Show image and name on mobile, hide on smaller screens */}
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={student?.image || defaultImg}
                      alt={`${student?.firstName} ${student?.lastName}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover border border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full border-2 border-card" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground text-xs sm:text-sm truncate">
                      {student?.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">
                      {student?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground block sm:hidden">
                      ID: {student?.studentId}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* ✅ Student ID - Hidden on mobile */}
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className="font-mono text-xs">
                  {student?.studentId}
                </Badge>
              </TableCell>

              {/* ✅ Class - Hidden on mobile and tablet */}
              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary" className="text-xs">
                  {student.Class?.className || "N/A"}
                </Badge>
              </TableCell>

              {/* ✅ Shift - Hidden on mobile and tablet */}
              <TableCell className="hidden lg:table-cell whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-card-foreground">
                    {student?.shiftName || "N/A"}
                  </span>
                </div>
              </TableCell>

              {/* ✅ Contact - Hidden on mobile */}
              <TableCell className="hidden md:table-cell whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-card-foreground font-mono">
                    {student?.phone || "N/A"}
                  </span>
                </div>
              </TableCell>

              {/* ✅ Batch - Hidden on mobile and tablet */}
              <TableCell className="hidden lg:table-cell max-w-[130px]">
                <Badge
                  variant="outline"
                  className="whitespace-nowrap overflow-hidden text-ellipsis truncate block max-w-full text-xs"
                  title={student.Batch?.batchName || "N/A"}
                >
                  {student.Batch?.batchName || "N/A"}
                </Badge>
              </TableCell>

              {/* ✅ Responsive Actions */}
              <TableCell>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Link to={`/view-student/${student.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent/10 hover:text-accent"
                    >
                      <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                    </Button>
                  </Link>
                  <Link to={`/update-student/${student.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit3 className="w-3 sm:w-4 h-3 sm:h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDelete(student.id)}
                  >
                    <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
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