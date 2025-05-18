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
import { useUpdateShiftMutation } from "@/redux/api/shiftApi/shiftApi";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const ShiftModal = ({
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
          <DialogTitle className="text-center text-slate-800 font-semibold">
            UPDATE SHIFT
          </DialogTitle>
        </DialogHeader>
        <ShiftFormModal data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

// This component is used to update the batch information
function ShiftFormModal({
  data,
  setOpen,
}: {
  data: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  console.log("pass shift data-->", data);
  // update hook for subject config
  const [updateShift] = useUpdateShiftMutation();

  // Initialize React Hook Form with default values from data
  const form = useForm({
    defaultValues: {
      shiftName: data?.shiftName || "",
    },
  });

  // Handle form submission
  const onSubmit = async (submitData: any) => {
    try {
      // Convert FormData to an object for API submission
      const updatedData = {
        id: data.id,
        data: {
          shiftName: submitData?.shiftName,
        },
      };

      // Send the updated data to the API
      const res: any = await updateShift(updatedData);

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
          name="shiftName"
          label="SHIFT NAME"
          placeholder="Enter Shift Name"
        />
        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white"
        >
          UPDATE SHIFT
        </Button>
      </form>
    </Form>
  );
}
