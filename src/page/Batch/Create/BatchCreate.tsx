/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddBatchMutation } from "@/redux/api/batch/batchApi";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const BatchCreate = () => {
  const [open, setOpen] = useState(false);
  const [addBatch] = useAddBatchMutation();

  const { data: classData } = useGetAllClassQuery(undefined);
  const { data: shiftData } = useGetAllShiftQuery(undefined);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res: any = await addBatch(data).unwrap();
      if (res.statusCode == 200) {
        toast.success(res?.message || "Batch added successfully");
        reset();
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Failed to add batch:", error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong..!"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-white">
          <Plus className="h-4 w-4" />
          Add New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-center text-slate-800">Add New Batch</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="batchName" className="text-slate-700">
                BATCH NAME:
              </Label>
              <Input
                id="batchName"
                placeholder="Batch A"
                className="col-span-3"
                {...register("batchName", {
                  required: "Batch name is required",
                })}
              />
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="classId" className="text-slate-700">
                SELECT CLASS:
              </Label>
              <select
                id="classId"
                className="col-span-3 border rounded px-2 py-1"
                {...register("classId", { required: "Class is required" })}
              >
                <option value="">Select Class</option>
                {classData?.data?.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="shiftId" className="text-slate-700">
                SELECT SHIFT:
              </Label>
              <select
                id="shiftId"
                className="col-span-3 border rounded px-2 py-1"
                {...register("shiftId", { required: "Shift is required" })}
              >
                <option value="">Select Shift</option>
                {shiftData?.data?.map((shift: any) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.shiftName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button className="text-white" type="submit">
              CREATE BATCH
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCreate;
