// import React from 'react'

// const StudentUpdateHeader = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default StudentUpdateHeader



import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StudentHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const StudentUpdateHeader = ({
  title,
  description,
  breadcrumbItems = [],
}: StudentHeaderProps) => {
  return (
    <div className="mb-6">
      {/* Breadcrumb Navigation */}
      {breadcrumbItems.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm mb-4">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-foreground font-medium flex items-center gap-1.5">
                  {index === 0 && <Home className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="mt-6 border-b border-border"></div>
    </div>
  );
};

export default StudentUpdateHeader;
