import BatchDetails from "./DashboardComponent/BatchDetails/BatchDetails";
import DashNavber from "./DashboardComponent/DashNavber/DashNavber";
import StudentChart from "./DashboardComponent/StudentChart/StudentChart";

export function DashboardOverview() {
  return (
    <>
      <DashNavber />
      <div className="space-y-6">

        <div className="">
          <StudentChart />
        </div>

        <BatchDetails />
      </div>
    </>
  );
}
