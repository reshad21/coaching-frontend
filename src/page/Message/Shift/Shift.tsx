/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Shift = () => {
  const { data: batchData } = useGetAllBatchQuery(undefined);
//   const [sendMessage] = useSendMessageMutation();
  const form = useForm();
  const selectedShift = form.watch("shift");
  const message = form.watch("message");
  const batches = batchData?.data?.map((item: any) => ({
    value: item?.id,
    name: item?.batchName,
  }));

  const handelSendMessage = async (e: any) => {
    e.preventDefault();
    if (!message) {
      return toast.error("please write Message");
    }
    if (!selectedShift ) {
      return toast.error("please Select Shift");
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Send message for this Shift",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#03A791",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send message!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const res = await sendMessage({
        //   id: selectedClass,
        //   message,
        // }).unwrap();
        // if (res?.data?.response_code == 202) {
        //   toast.success("Message send successfully");
        // }
        // if (res?.data?.error_message) {
        //   toast.error(res?.data?.error_message);
        // }
        console.log(selectedShift);
        console.log(message);
        
      }
    });
  };
  return (
    <div>
      <Card className="p-6 w-full">
        <Form {...form}>
          <form className="">
            <textarea
              {...form.register("message")}
              placeholder="Wright your message"
              className="border p-2 rounded w-full shadow-sm mb-4"
            />
            <select
              {...form.register("shift")}
              className={`border p-2 rounded w-full shadow-sm ${
                selectedShift ? "cursor-pointer border-gray-400" : ""
              }`}
            >
              <option value="">Select Shift</option>
              {batches?.map((item: any) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            <Button
              className="w-full mt-4 text-white"
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

export default Shift;
