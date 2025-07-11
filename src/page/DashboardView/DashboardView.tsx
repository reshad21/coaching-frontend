import BatchDetails from "./DashboardComponent/BatchDetails/BatchDetails";
import DashNavber from "./DashboardComponent/DashNavber/DashNavber";
import QuickView from "./DashboardComponent/QuickView/QuickView";
import ShiftChart from "./DashboardComponent/ShiftChart/ShiftChart";
import StudentChart from "./DashboardComponent/StudentChart/StudentChart";

export function DashboardOverview() {
  return (
    <>
      <DashNavber />
      <div className="space-y-6">
        <QuickView />

        <div className="grid gap-4 md:grid-cols-2">
          <StudentChart />
          <ShiftChart />
        </div>

        <BatchDetails />
      </div>
    </>
  );
}
