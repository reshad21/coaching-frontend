
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginAdminMutation } from "@/redux/api/auth/auth";
import { setUserToken } from "@/redux/features/authSlice/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
import { jwtDecode, JwtPayload } from "jwt-decode";
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
interface CustomJwtPayload extends JwtPayload {
  roleId: string;
  designation?:string;
}
const Login = () => {
  const [isShow,setShow] = useState(false)
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
      console.log(res?.success);
      if (res?.success) {
        dispatch(setUserToken({ token: res?.data?.token }));
      toast.success(res?.message)
      navigate('/');
      }
      
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    }
  };
  return (
   <div className="flex justify-center items-center h-screen w-full">
    <Card className="p-5 w-[35%] ">
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-2 px-0">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your Email"
            className="bg-[#d1d5db41]"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
          <Input
            id="password"
            type={`${isShow ? "text" : "password"}`}
            placeholder="Enter your Password"
            className="bg-[#d1d5db41] "
            {...register("password", { required: "Password is required" })}
          />
          <span onClick={() => setShow(!isShow)} className="absolute top-3 right-2">
            {
                isShow ? <EyeOff size={16}/>: <Eye size={16} />
            }
          </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
      </CardContent>
      <CardFooter className="px-0 pb-0">
        <Button type="submit" className="bg-[#09733D] text-white w-full px-0">
          Login
        </Button>
      </CardFooter>
    </form>
    </Card>
   </div>
  );
};

export default Login;
