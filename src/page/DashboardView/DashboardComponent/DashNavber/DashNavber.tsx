import { Button } from '@/components/ui/button';
import { BookOpen, Clock, GraduationCap, Users } from 'lucide-react';
import React from 'react';

const DashNavber = () => {
    return (
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">
            Education Management Dashboard
          </h1>
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant="outline"
          >
            <Users className="mr-2 h-4 w-4" />
            Add Student
          </Button>
          <Button
            size="sm"
            variant="outline"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Add Batch
          </Button>
          <Button
            size="sm"
            variant="outline"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Add Class
          </Button>
          <Button
            size="sm"
            variant="outline"
          >
            <Clock className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>
    );
};

export default DashNavber;