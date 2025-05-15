/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useUpdateBatchMutation } from "@/redux/api/batch/batch";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
export function BatchModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
        </DialogHeader>
        <BatchForm data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function BatchForm({
  data,
  setOpen,
}: {
  data: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // update hook for subject config
  const [updateBatch] = useUpdateBatchMutation();

  // Initialize React Hook Form with default values from data
  const form = useForm({
    defaultValues: {
      batchNumber: data?.batchNumber || "",
      batchSession: data?.batchSession || "",
      totalStudent: data?.totalStudent || "",
    },
  });

  // Handle form submission
  const onSubmit = async (submitData: any) => {
    try {
      // Convert FormData to an object for API submission
      const updatedData = {
        id: data.id,
        data: {
          batchNumber: submitData?.batchNumber,
          batchSession: submitData?.batchSession,
          totalStudent: Number(submitData?.totalStudent),
        },
      };

      // Send the updated data to the API
      const res: any = await updateBatch(updatedData);

      if (res?.data?.success) {
        toast.success(
          res.data.message || "Batch updated successfully!"
        );
        form.reset();
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.data?.error ||
          "An error occurred while updating the Batch."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldWrapper
          name="batchNumber"
          label="Batch Number"
          placeholder="Enter Batch Number"
        />
        <FormFieldWrapper
          name="batchSession"
          label="Batch Session"
          placeholder="Enter Batch Session"
        />
        <FormFieldWrapper
          name="totalStudent"
          label="Total Student"
          placeholder="Enter Total Student"
        />

        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white"
        >
          Update Subject
        </Button>
      </form>
    </Form>
  );
}
