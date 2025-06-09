import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const StudentChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-80" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {/* Chart container skeleton */}
          <div className="relative h-full w-full">
            {/* Y-axis skeleton */}
            <div className="absolute left-0 top-0 h-full w-8 flex flex-col justify-between py-4">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-4" />
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-4" />
              <Skeleton className="h-3 w-6" />
            </div>

            {/* Chart area skeleton */}
            <div className="ml-12 mr-4 h-full">
              {/* Grid lines skeleton */}
              <div className="relative h-full w-full">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-px w-full" />
                  ))}
                </div>

                {/* Bars skeleton */}
                <div className="absolute bottom-8 left-0 right-0 flex items-end justify-around gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      {/* Multiple bars per group */}
                      <div className="flex items-end gap-1 w-full justify-center">
                        <Skeleton className="w-3 h-16 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        <Skeleton className="w-3 h-12 animate-pulse" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                        <Skeleton className="w-3 h-20 animate-pulse" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* X-axis labels skeleton */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-12" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend skeleton */}
          <div className="flex justify-center gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-sm" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentChartSkeleton
