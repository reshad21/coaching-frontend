import { useCurrentToken } from "@/redux/features/authSlice/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PrivateRout = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; 
};

export default PrivateRout;
