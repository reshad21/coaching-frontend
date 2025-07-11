import { Card, CardContent, CardHeader } from "@/components/ui/card";

const QuickViewSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-4 bg-gray-300 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-20 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickViewSkeleton;
