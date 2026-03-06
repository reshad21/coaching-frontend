import { Users } from 'lucide-react'

const StudentHeader = () => {
  // ✅ Responsive header with responsive spacing and font sizes
  return (
    <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-primary/10 flex-shrink-0">
          <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">Student Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Manage and view all student records</p>
        </div>
      </div>
  )
}

export default StudentHeader
