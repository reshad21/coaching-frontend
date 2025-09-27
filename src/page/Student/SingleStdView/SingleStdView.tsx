import defaultImg from "@/assets/default.jpg"
import { Button } from "@/components/ui/button"
import { useGetStudentByIdQuery } from "@/redux/api/studentApi/studentApi"
import { ArrowLeft, GraduationCap, Heart, MapPin, Phone, Users } from "lucide-react"
import type React from "react"
import { useNavigate, useParams } from "react-router-dom"

const SingleStdView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: studentData } = useGetStudentByIdQuery(id as string)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <img
                    src={studentData?.data?.image || defaultImg}
                    alt={`${studentData?.data?.firstName} ${studentData?.data?.lastName}`}
                    className="w-40 h-40 object-cover rounded-2xl border-4 border-background shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-background"></div>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
                  {studentData?.data?.firstName} {studentData?.data?.lastName}
                </h1>

                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">{studentData?.data?.schoolName}</span>
                </div>

                <div className="space-y-3 text-sm">
                  {studentData?.data?.phone && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="w-4 h-4 text-accent" />
                      <span>{studentData.data.phone}</span>
                    </div>
                  )}
                  {studentData?.data?.address && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-left">{studentData.data.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Academic Information */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                Academic Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <InfoCard
                  label="Class"
                  value={studentData?.data?.className}
                  icon={<GraduationCap className="w-4 h-4" />}
                />
                <InfoCard label="Batch" value={studentData?.data?.batchName} icon={<Users className="w-4 h-4" />} />
              </div>
            </div>

            {/* Family Information */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Family Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <InfoCard label="Father's Name" value={studentData?.data?.fatherName} />
                <InfoCard label="Mother's Name" value={studentData?.data?.motherName} />
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <InfoCard label="Gender" value={studentData?.data?.gender} />
                <InfoCard label="Religion" value={studentData?.data?.religion} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number | undefined
  icon?: React.ReactNode
}) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-accent">{icon}</span>}
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{value || "—"}</p>
  </div>
)

export default SingleStdView
