import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import routs from "./routes/routes.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { persister, store } from "./redux/store.ts";
import  { Toaster } from 'react-hot-toast';

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //   <Provider store={store}>
  //   <RouterProvider router={routs} />
  //   </Provider>

  // </StrictMode>,

  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister}>
        <RouterProvider router={routs} />
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
