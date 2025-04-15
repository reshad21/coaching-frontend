/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import Login from "@/page/Login/Login";
import ShiftCreate from "@/page/Shift/Create/ShiftCreate";
import ShiftUpdate from "@/page/Shift/Update/ShiftUpdate";
import ShiftView from "@/page/Shift/View/ShiftView";

import Test from "@/page/Test/Test";
import { createBrowserRouter } from "react-router-dom";


const componentMapping: Record<string, React.ElementType> = {
  // student routes
  "/test": Test,
  // login route 
  "/login": Login,
  "/shift":ShiftView,
  "/shift-create":ShiftCreate,
  "/shift-update":ShiftUpdate,
  
};

const routs = createBrowserRouter([
  {
    path: "/",
    element: (
      // <PrivateRout>
        <MainLayout />
      // </PrivateRout>
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
