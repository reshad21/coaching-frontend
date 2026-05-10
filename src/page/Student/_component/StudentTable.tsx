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
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center m-3 sm:m-6 pb-3 sm:pb-4 border-b gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Students</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total Students: {students.length}
          </p>
        </div>

        <p className="text-xs text-muted-foreground hidden md:block">
          ← Scroll horizontally →
        </p>

        <StudentPDFGenerator
          students={students}
          logo={logo}
          brandName={brandName}
        />
      </div>

      {/* Table Container */}
      <div className="flex-1 rounded-xl border shadow mx-3 sm:mx-6 mb-4 bg-card">
        
        {/* Mobile: Card Layout */}
        <div className="md:hidden overflow-y-auto h-[calc(100vh-320px)] pb-4">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            {students.map((student: any, index: number) => (
              <div
                key={student.id}
                className="bg-muted/20 rounded-lg border border-border p-4 space-y-3 hover:bg-muted/30 transition-colors"
              >
                {/* Student Info Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-border">
                  <img
                    src={student?.image || defaultImg}
                    className="w-12 h-12 rounded-lg flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {student?.firstName} {student?.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {student?.studentId}
                    </p>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Class</p>
                    <p className="font-medium text-foreground text-sm">{student?.className}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Shift</p>
                    <p className="font-medium text-foreground text-sm">{student?.shiftName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Contact</p>
                    <p className="font-medium text-foreground text-sm">{student?.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">Batch</p>
                    <p className="font-medium text-foreground text-sm">{student?.Batch?.batchName || "N/A"}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-3 border-t border-border flex-wrap">
                  <Link to={`/view-student/${student.id}`}>
                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="ml-1 hidden xs:inline">View</span>
                    </Button>
                  </Link>

                  <Link to={`/update-student/${student.id}`}>
                    <Button size="sm" variant="outline" className="h-8 px-3 text-xs border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="ml-1 hidden xs:inline">Edit</span>
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    onClick={() => onDelete(student.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="ml-1 hidden xs:inline">Delete</span>
                  </Button>

                  <SendMessage student={student} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden md:flex md:flex-col overflow-x-auto overflow-y-auto h-[calc(100vh-320px)] pb-4">
          
          {/* FORCE WIDTH (IMPORTANT) */}
          <div className="min-w-[1400px]">
            
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead className="px-4 whitespace-nowrap text-center">
                    <Hash className="w-4 h-4 mx-auto" />
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    <Users className="w-4 h-4 inline mr-2" />
                    Student Details
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    Student ID
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Class
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Shift
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap">
                    Batch
                  </TableHead>

                  <TableHead className="px-4 whitespace-nowrap text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {students.map((student: any, index: number) => (
                  <TableRow key={student.id}>
                    
                    <TableCell className="px-4 whitespace-nowrap text-center">
                      {index + 1}
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={student?.image || defaultImg}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold whitespace-nowrap">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-xs whitespace-nowrap">
                            {student?.studentId}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      <Badge variant="outline">
                        {student?.studentId}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      {student?.className}
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      {student?.shiftName}
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      {student?.phone}
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap">
                      {student?.Batch?.batchName}
                    </TableCell>

                    <TableCell className="px-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/view-student/${student.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link to={`/update-student/${student.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
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

        </div>
      </div>
    </div>
  );
};

export default StudentTable;