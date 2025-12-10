/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLoginUserMutation } from "@/redux/api/login/login";
// import { useGetRoleFeatureByIdMutation } from "@/redux/api/roleManagement/roleManagement";
// import { setUserToken } from "@/redux/features/authSlice/authSlice";
// import { useAppDispatch } from "@/redux/hooks";
// import { AppDispatch } from "@/redux/store";
// import { delay } from "@/utils/delay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginAdminMutation } from "@/redux/api/auth/auth";
import { setUserToken } from "@/redux/features/authSlice/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
// import { jwtDecode, JwtPayload } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";


type LoginFormInputs = {
  email: string;
  password: string;
};
// interface CustomJwtPayload extends JwtPayload {
//   roleId: string;
//   designation?:string;
// }
const Login = () => {
  const [isShow, setShow] = useState(false);
  const [login] = useLoginAdminMutation();
  const dispatch = useAppDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await login(data).unwrap();
      if (res?.success) {
        dispatch(setUserToken({ token: res?.data?.token }));
        toast.success(res?.message);
        navigate("/");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl bg-white/90 dark:bg-slate-900/90">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="text-center pb-2">
            <h1 className="text-3xl font-bold text-primary mb-1 tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pt-2 pb-0">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                className="bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 rounded-lg text-base"
                {...register("email", { required: "Email is required" })}
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isShow ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 rounded-lg text-base pr-10"
                  {...register("password", { required: "Password is required" })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShow(!isShow)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={isShow ? "Hide password" : "Show password"}
                >
                  {isShow ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-2">
            <Button type="submit" className="w-full py-2 text-base font-semibold rounded-lg shadow-sm bg-primary hover:bg-primary/90 transition-colors text-white">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
