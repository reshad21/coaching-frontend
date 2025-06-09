import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ShiftChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          {/* Pie chart skeleton */}
          <div className="relative">
            {/* Main circle skeleton */}
            <Skeleton className="w-40 h-40 rounded-full" />

            {/* Inner circle to create donut effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-background rounded-full" />
            </div>

            {/* Segment indicators around the circle */}
            <div className="absolute inset-0">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-8 bg-muted-foreground/20 rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                    transform: `translate(-50%, -50%) rotate(${index * 60}deg) translateY(-60px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-8 ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ShiftChartSkeleton
