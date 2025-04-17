/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import Login from "@/page/Login/Login";
import StudentCreate from "@/page/Student/Create/StudentCreate";
import StudentUpdate from "@/page/Student/Update/StudentUpdate";
import Student from "@/page/Student/View/Student";
import PrivateRout from "@/PrivateRout/PrivateRout";
import { createBrowserRouter } from "react-router-dom";

const componentMapping: Record<string, React.ElementType> = {
  // student routes
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
