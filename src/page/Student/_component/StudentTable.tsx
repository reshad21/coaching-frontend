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
      <div className="flex justify-between items-center m-4 sm:m-6 pb-4 border-b">
        <div>
          <h2 className="text-lg font-bold">Students</h2>
          <p className="text-sm text-muted-foreground">
            Total Students: {students.length}
          </p>
        </div>

        <p className="text-xs text-muted-foreground hidden sm:block">
          ← Scroll horizontally →
        </p>

        <StudentPDFGenerator
          students={students}
          logo={logo}
          brandName={brandName}
        />
      </div>

      {/* Table Container */}
      <div className="flex-1 rounded-xl border shadow mx-4 sm:mx-6 mb-4 bg-card">
        
        {/* SCROLL AREA */}
        <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-320px)] pb-4">
          
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
                          className="w-12 h-12 rounded"
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
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link to={`/update-student/${student.id}`}>
                          <Button size="sm" variant="ghost">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
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