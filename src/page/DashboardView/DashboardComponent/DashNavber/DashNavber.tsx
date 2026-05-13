import { Button } from "@/components/ui/button";
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const DashNavber = () => {
  return (
    <div className="mb-5 border-b px-4 py-4 sm:h-16 sm:py-0">
      <div className="flex flex-col gap-3 sm:h-16 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold sm:text-2xl">
          Dashboard
        </h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row">
        <Link to="/create-student">
          <Button size="sm" variant="primaryGradient" className="w-full sm:w-auto">
            <Users className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Link>
        <Link to="/batch">
          <Button size="sm" variant="primaryGradient" className="w-full sm:w-auto">
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Batch
          </Button>
        </Link>
        <Link to="/class">
          <Button size="sm" variant="primaryGradient" className="w-full sm:w-auto">
            <BookOpen className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </Link>
        <Link to="/shift">
          <Button size="sm" variant="primaryGradient" className="w-full sm:w-auto">
            <Clock className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default DashNavber;
