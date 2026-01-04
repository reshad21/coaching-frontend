import { Users } from 'lucide-react'

const StudentHeader = () => {
  return (
    <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground">Manage and view all student records</p>
        </div>
      </div>
  )
}

export default StudentHeader
