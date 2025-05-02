/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import BatchCreate from "@/page/Batch/Create/BatchCreate";
import BatchView from "@/page/Batch/View/BatchView";
import ClassCreate from "@/page/Class/Create/ClassCreate";
import ClassView from "@/page/Class/View/ClassView";
import Login from "@/page/Login/Login";
import AdmissionPayment from "@/page/Payment/AdmissionPayment/AdmissionPayment";
import MonthlyPayment from "@/page/Payment/MonthlyPayment/MonthlyPayment";
import PaymentStatus from "@/page/Payment/PaymentStatus/PaymentStatus";
import ShiftCreate from "@/page/Shift/Create/ShiftCreate";
import ShiftUpdate from "@/page/Shift/Update/ShiftUpdate";
import ShiftView from "@/page/Shift/View/ShiftView";
import StudentCreate from "@/page/Student/Create/StudentCreate";
import SingleStdView from "@/page/Student/SingleStdView/SingleStdView";
import StudentUpdate from "@/page/Student/Update/StudentUpdate";
import Student from "@/page/Student/View/Student";
import Test from "@/page/Test/Test";
import PrivateRout from "@/PrivateRout/PrivateRout";
import { createBrowserRouter } from "react-router-dom";

const componentMapping: Record<string, React.ElementType> = {
  "/test": Test,
  // login route
  "/login": Login,

  // shift routes
  "/shift": ShiftView,
  "/shift-create": ShiftCreate,
  "/shift-update": ShiftUpdate,
  
  // student routes
  "/view-student": Student,
  "/create-student": StudentCreate,
  "/update-student/:id": StudentUpdate,
  "/view-student/:id": SingleStdView,

  // payment routes
  "/admission-payment": AdmissionPayment,
  "/monthly-payment": MonthlyPayment,
  "/payment-status": PaymentStatus,

  //class routes
  "/class":ClassView,
  "class-create":ClassCreate,


  //Batch routes
  "/batch":BatchView,
  "batch-create":BatchCreate,

  
};

const routs = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRout>
        <MainLayout />
      </PrivateRout>
    ),
    children: navMain.flatMap((section) =>
      section.items?.map((item: any) => {
        const Component = componentMapping[item?.url] as React.ElementType;
        return {
          path: item?.url,
          element: Component ? <Component /> : "not found",
        };
      })
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default routs;
