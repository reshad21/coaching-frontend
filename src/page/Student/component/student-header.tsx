import { Users } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

interface StudentHeaderProps {
  title: string
  description: string
  breadcrumbItems?: Array<{
    label: string
    href?: string
  }>
}

export function StudentHeader({ title, description, breadcrumbItems = [] }: StudentHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Breadcrumb Navigation */}
      {breadcrumbItems.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href} className="font-medium">
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Main Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
