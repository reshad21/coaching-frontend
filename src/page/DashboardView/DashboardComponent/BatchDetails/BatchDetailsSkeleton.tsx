import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BatchDetailsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
        <CardDescription>
          Detailed view of each batch with class and shift information
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="space-y-2 text-center">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BatchDetailsSkeleton;
