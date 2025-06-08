import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Sample data for demonstration with time-based shifts
const studentDistributionData = [
  { batch: "Batch A", "8:00-10:30": 25, "11:00-1:30": 15, class: "Grade 10" },
  { batch: "Batch B", "8:00-10:30": 30, "11:00-1:30": 20, class: "Grade 11" },
  { batch: "Batch C", "2:00-4:30": 20, "5:00-7:30": 25, class: "Grade 12" },
  { batch: "Batch D", "2:00-4:30": 35, "5:00-7:30": 10, class: "Grade 9" },
];
const BatchDetails = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Batch Details</CardTitle>
          <CardDescription>
            Detailed view of each batch with class and shift information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentDistributionData.map((batch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{batch.batch}</h3>
                  <p className="text-sm text-muted-foreground">{batch.class}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  {batch["8:00-10:30"] > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {batch["8:00-10:30"]}
                      </div>
                      <div className="text-muted-foreground">8:00-10:30</div>
                    </div>
                  )}
                  {batch["11:00-1:30"] > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {batch["11:00-1:30"]}
                      </div>
                      <div className="text-muted-foreground">11:00-1:30</div>
                    </div>
                  )}
                  {batch["2:00-4:30"] > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">
                        {batch["2:00-4:30"]}
                      </div>
                      <div className="text-muted-foreground">2:00-4:30</div>
                    </div>
                  )}
                  {batch["5:00-7:30"] > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">
                        {batch["5:00-7:30"]}
                      </div>
                      <div className="text-muted-foreground">5:00-7:30</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold">
                      {(batch["8:00-10:30"] || 0) +
                        (batch["11:00-1:30"] || 0) +
                        (batch["2:00-4:30"] || 0) +
                        (batch["5:00-7:30"] || 0)}
                    </div>
                    <div className="text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BatchDetails;
