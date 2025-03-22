import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AppDispatch } from "@/redux/store";
import { setUserToken, useCurrentToken } from "@/redux/features/authSlice/authSlice";
import { useLoginUserMutation } from "@/redux/api/login/login";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginFn = ({ user }: { user: string }) => {
  console.log(user);
  const [isShow,setShow] = useState(false)
  const [login] = useLoginUserMutation();
  const dispatch = useAppDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async(data: LoginFormInputs) => {
    const res = await login( data).unwrap();
    dispatch(setUserToken({ token: res?.data?.token }));
    
    navigate('/')
    toast.success('Successfully Login!')
  };

  return (
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
  );
};

export default LoginFn;
