/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import Login from "@/page/Login/Login";
import ShiftCreate from "@/page/Shift/Create/ShiftCreate";
import ShiftUpdate from "@/page/Shift/Update/ShiftUpdate";
import ShiftView from "@/page/Shift/View/ShiftView";
import StudentCreate from "@/page/Student/Create/StudentCreate";
import StudentUpdate from "@/page/Student/Update/StudentUpdate";
import Student from "@/page/Student/View/Student";
import Test from "@/page/Test/Test";
import PrivateRout from "@/PrivateRout/PrivateRout";
import { createBrowserRouter } from "react-router-dom";

const componentMapping: Record<string, React.ElementType> = {
  // student routes
  "/test": Test,
  // login route
  "/login": Login,
  "/shift": ShiftView,
  "/shift-create": ShiftCreate,
  "/shift-update": ShiftUpdate,

  "/view-student": Student,
  "/create-student": StudentCreate,
  "/update-student": StudentUpdate,
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
