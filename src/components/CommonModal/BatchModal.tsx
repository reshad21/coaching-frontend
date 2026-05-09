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
import { useUpdateBatchMutation } from "@/redux/api/batch/batchApi";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const BatchModal = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-slate-700 font-semibold">
            UPDATE BATCH NAME
          </DialogTitle>
        </DialogHeader>
        <BatchFormModal data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

// This component is used to update the batch information
function BatchFormModal({
  data,
  setOpen,
}: {
  data: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // console.log("pass data-->", data);

  const [updateBatch] = useUpdateBatchMutation();

  const form = useForm({
    defaultValues: {
      batchName: data?.batchName || "",
    },
  });

  // Handle form submission
  const onSubmit = async (submitData: any) => {
    try {
      const updatedData = {
        id: data.id,
        data: {
          batchName: submitData?.batchName,
        },
      };

      // Send the updated data to the API
      const res: any = await updateBatch(updatedData);

      if (res?.data?.success) {
        toast.success(res.data.message || "Batch updated successfully!");
        form.reset();
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.data?.error || "An error occurred while updating the Batch."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldWrapper
          name="batchName"
          label="BATCH NAME"
          placeholder="Enter Batch Number"
        />
        <Button
          type="submit"
          variant="primaryGradient"
          className="w-full"
        >
          UPDATE BATCH
        </Button>
      </form>
    </Form>
  );
}
