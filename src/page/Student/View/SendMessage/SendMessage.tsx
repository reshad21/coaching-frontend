/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSendSingleMessageMutation } from "@/redux/api/auth/message/message";

type FormValues = {
  message: string;
};

const SendMessage = ({ student }: any) => {
  const [open, setOpen] = useState(false);
  const [sendMessage] = useSendSingleMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(student?.phone);
      const res = await sendMessage({
        message: data?.message,
        number: student?.phone,
      }).unwrap();
      if (res?.data?.response_code == 202) {
        toast.success(`Message send to ${student?.firstName} successfully`);
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 bg-white hover:bg-white text-yellow-600 hover:text-yellow-700 border-blue-100 hover:border-blue-200">
          <Mail />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-center">Send message </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Send message to{" "}
              <span className="font-semibold">{student?.firstName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="shiftName" className="text-left">
                Your Message
              </Label>

              <textarea
                {...register("message", { required: "Message is required" })}
                placeholder="Wright your message"
                className="border p-2 rounded w-full shadow-sm mb-4"
                defaultValue={`Dear ${student?.firstName},`}
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm ml-[33%] -mt-2">
                {errors.message.message}
              </p>
            )}
          </div>
          <DialogFooter className="w-full">
            <Button type="submit" className="w-full text-white">
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessage;
