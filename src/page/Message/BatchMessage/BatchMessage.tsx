/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const BatchMessage = () => {
  const { data: batchData } = useGetAllBatchQuery(undefined);
  const form = useForm();
  const selectedBatch = form.watch("batch");
  const message = form.watch("message");
  const batches = batchData?.data?.map((item: any) => ({
    value: item?.id,
    name: item?.batchName,
  }));

  const handelSendMessage = async (e: any) => {
    e.preventDefault();
    if (!selectedBatch || !message) {
      return toast.error("please select batch and write message");
    }
    Swal.fire({
      title: "Are you sure?",
      text: "send message for this batch",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#03A791",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send message!",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Message send successfully");
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
              {...form.register("batch")}
              className={`border p-2 rounded w-full shadow-sm ${
                selectedBatch ? "cursor-pointer border-gray-400" : ""
              }`}
            >
              <option value="">Select Batch</option>
              {batches?.map((item: any) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
            <Button
              className="w-full mt-4 text-white"
              disabled={!selectedBatch}
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

export default BatchMessage;
