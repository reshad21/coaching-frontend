/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useSendAllStudentsMessageMutation } from "@/redux/api/auth/message/message";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const All = () => {
  const [sendMessage] = useSendAllStudentsMessageMutation();
  const form = useForm();
  const message = form.watch("message");
  
  const handelSendMessage = async (e: any) => {
    e.preventDefault();
    if (!message) {
      return toast.error("please write Message");
    }
    
    Swal.fire({
      title: "Are you sure?",
      text: "Send message to all students",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#03A791",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send message!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await sendMessage({
          message,
        }).unwrap();
        if (res?.success === true) {
          toast.success("Message send successfully");
        }
        if (res?.error_message) {
          toast.error(res?.error_message);
        }
      }
    });
  };
  return (
    <div>
      <Card className="p-3 sm:p-6 w-full">
        <Form {...form}>
          <form className="space-y-3 sm:space-y-4">
            <textarea
              {...form.register("message")}
              placeholder="Wright your message"
              className="border p-2 sm:p-3 rounded w-full shadow-sm text-xs sm:text-sm min-h-[120px] sm:min-h-[150px] focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button
              variant="primaryGradient"
              className="w-full mt-2 sm:mt-4 text-xs sm:text-sm h-9 sm:h-10"
              // disabled={!selectedBatch}
              onClick={(e) => handelSendMessage(e)}
            >
              Send Message
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default All;
