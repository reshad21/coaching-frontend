/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import BatchCreate from "@/page/Batch/Create/BatchCreate";
import BatchUpdate from "@/page/Batch/update/BatchUpdate";
import BatchView from "@/page/Batch/View/BatchView";
import ClassCreate from "@/page/Class/Create/ClassCreate";
import ClassUpdate from "@/page/Class/Update/ClassUpdate";
import ClassView from "@/page/Class/View/ClassView";
import DashboardView from "@/page/DashboardView/DashboardView";
import { CreateExpense } from "@/page/Expense/CreateExpense/CreateExpense";
import ShowExpense from "@/page/Expense/ShowExpense/ShowExpense";
import Login from "@/page/Login/Login";
import Message from "@/page/Message/Message";
import MonthlyPayment from "@/page/Payment/MonthlyPayment/MonthlyPayment";
import PaymentDetails from "@/page/Payment/PaymentDetails/PaymentDetails";
import PaymentStatus from "@/page/Payment/PaymentStatus/PaymentStatus";
import ShiftCreate from "@/page/Shift/Create/ShiftCreate";
import ShiftUpdate from "@/page/Shift/Update/ShiftUpdate";
import ShiftView from "@/page/Shift/View/ShiftView";
import StudentCreate from "@/page/Student/Create/StudentCreate";
import SingleStdView from "@/page/Student/SingleStdView/SingleStdView";
import StudentUpdate from "@/page/Student/Update/StudentUpdate";
import Student from "@/page/Student/View/Student";
import PrivateRout from "@/PrivateRout/PrivateRout";
import { createBrowserRouter } from "react-router-dom";

const componentMapping: Record<string, React.ElementType> = {
  // login route
  "/login": Login,

  // Dashborad overview
  "/": DashboardView,

  // shift routes
  "/shift": ShiftView,
  "/shift-create": ShiftCreate,
  "/shift-update/:id": ShiftUpdate,

  // student routes
  "/view-student": Student,
  "/create-student": StudentCreate,
  "/update-student/:id": StudentUpdate,
  "/view-student/:id": SingleStdView,

  // payment routes
  "/payment/:id": PaymentDetails,
  "/monthly-payment": MonthlyPayment,
  "/payment-status": PaymentStatus,

  // coachingcost routes
  "/create-expense":CreateExpense,
  "/show-expense":ShowExpense,

  //class routes
  "/class": ClassView,
  "/class-create": ClassCreate,
  "class-update/:id": ClassUpdate,

  //Batch routes
  "/batch": BatchView,
  "/batch-create": BatchCreate,
  "/batch-update/:id": BatchUpdate,

  //message routes
  "/message": Message,
};

const routs = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRout>
        <MainLayout />
      </PrivateRout>
    ),
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
      ...navMain.flatMap((section) =>
        section.items?.map((item: any) => {
          const Component = componentMapping[item?.url] as React.ElementType;
          return {
            path: item?.url,
            element: Component ? <Component /> : "not found",
          };
        })
      ),
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);


export default routs;
