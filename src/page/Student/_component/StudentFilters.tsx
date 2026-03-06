import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, RotateCcw } from "lucide-react"
import SearchInputField from "@/components/CommonSearch/SearchInputField"
import SelectBatch from "@/components/Batch/SelectBatch"
import SelectStudentClass from "@/components/studentClass/SelectStudentClass"
import SelectShift from "@/components/Shift/SelectShift"

interface StudentFiltersProps {
  search: string
  selectedBatch: string
  selectClass: string
  shift: string
  onSearchChange: (value: string) => void
  onBatchChange: (value: string) => void
  onClassChange: (value: string) => void
  onShiftChange: (value: string) => void
  onClearFilters: () => void
}

const StudentFilters = ({
  search,
  selectedBatch,
  selectClass,
  shift,
  onSearchChange,
  onBatchChange,
  onClassChange,
  onShiftChange,
  onClearFilters,
}: StudentFiltersProps) => {
  const hasActiveFilters = search || selectedBatch || selectClass || shift
  const activeFilterCount = [search, selectedBatch, selectClass, shift].filter(Boolean).length

  return (
    // ✅ Responsive filters: w-full + min-w-0 prevents card from stretching, proper spacing for mobile
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
        {/* ✅ Responsive grid: 1 col on mobile, 2 on sm, 5 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          <div className="relative">
            <SearchInputField value={search} onChange={onSearchChange} onSearch={onSearchChange} />
          </div>
          <SelectBatch value={selectedBatch} onChange={onBatchChange} />
          <SelectStudentClass value={selectClass} onChange={onClassChange} />
          <SelectShift value={shift} onChange={onShiftChange} />
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full border-border bg-primary text-white cursor-pointer text-sm"
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
  )
}

export default StudentFilters