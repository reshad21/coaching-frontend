/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import BatchDetailsSkeleton from "./BatchDetailsSkeleton";

const BatchDetails = () => {
  const { data: batchData, isLoading } = useGetAllBatchQuery(undefined);
  const batches = batchData?.data || [];
  return (
    <>
      {isLoading ? (
        <BatchDetailsSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>
              Detailed view of each batch with class and shift information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batches?.map((batch: any, index: any) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold text-orange-600">
                      {batch?.batchName}
                    </h3>
                    <p className="text-sm text-blue-600 font-semibold">
                      Class {batch?.Class?.className}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {batch?.Shift?.shiftName}
                      </div>
                      <div className="text-red-600 font-semibold">
                        Total {batch?.students?.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default BatchDetails;
