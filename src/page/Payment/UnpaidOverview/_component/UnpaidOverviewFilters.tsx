import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";
import SelectBatch from "@/components/Batch/SelectBatch";
import SelectStudentClass from "@/components/studentClass/SelectStudentClass";
import SelectShift from "@/components/Shift/SelectShift";

interface UnpaidOverviewFiltersProps {
  selectedBatch: string;
  selectClass: string;
  shift: string;
  onBatchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onShiftChange: (value: string) => void;
  onClearFilters: () => void;
}

const UnpaidOverviewFilters = ({
  selectedBatch,
  selectClass,
  shift,
  onBatchChange,
  onClassChange,
  onShiftChange,
  onClearFilters,
}: UnpaidOverviewFiltersProps) => {
  const hasActiveFilters = selectedBatch || selectClass || shift;
  const activeFilterCount = [selectedBatch, selectClass, shift].filter(Boolean).length;

  return (
    <Card className="w-full min-w-0 border-border bg-card">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-3 sm:w-4 h-3 sm:h-4 text-muted-foreground flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-medium text-card-foreground truncate">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <SelectBatch value={selectedBatch} onChange={onBatchChange} />
          <SelectStudentClass value={selectClass} onChange={onClassChange} />
          <SelectShift value={shift} onChange={onShiftChange} />
          <Button
            onClick={onClearFilters}
            variant="primaryGradient"
            className="w-fit px-3 sm:px-4 text-sm sm:text-base"
            disabled={!hasActiveFilters}
            size="sm"
          >
            <RotateCcw className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="hidden sm:inline">Clear Filters</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnpaidOverviewFilters;