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
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-card-foreground">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <SearchInputField value={search} onChange={onSearchChange} onSearch={onSearchChange} />
          </div>
          <SelectBatch value={selectedBatch} onChange={onBatchChange} />
          <SelectStudentClass value={selectClass} onChange={onClassChange} />
          <SelectShift value={shift} onChange={onShiftChange} />
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="border-border bg-primary text-white cursor-pointer"
            disabled={!hasActiveFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentFilters