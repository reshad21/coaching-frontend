/* eslint-disable @typescript-eslint/no-explicit-any */

import MainLayout from "@/components/layouts/MainLayout";
import { navMain } from "@/components/Routs/Routs";
import Test from "@/page/Test/Test";
import PrivateRout from "@/PrivateRout/PrivateRout";
import { LogIn } from "lucide-react";
import { createBrowserRouter } from "react-router-dom";


const componentMapping: Record<string, React.ElementType> = {
  // student routes
  "/test": Test,
  
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
    element: <LogIn />,
  },
]);

export default routs;
