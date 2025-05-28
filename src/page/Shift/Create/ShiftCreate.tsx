/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddShiftMutation } from "@/redux/api/shiftApi/shiftApi";
import { formatTime12Hour } from "@/utils/formatTime12Hour";
import { Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormValues = {
  startTime: string;
  endTime: string;
};

const ShiftCreate = () => {
  const [addShift] = useAddShiftMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formattedStart = formatTime12Hour(data.startTime);
    const formattedEnd = formatTime12Hour(data.endTime);

    const shiftData = {
      shiftName: `${formattedStart} - ${formattedEnd}`,
    };

    const res: any = await addShift(shiftData).unwrap();

    if (res.statusCode === 200) {
      toast.success(res?.message || "Shift Create Successfully..!");
      reset();
      setOpen(false);
    } else {
      toast.error(res?.message || "Something went wrong..!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-white">
          <Plus className="h-4 w-4" />
          Add New Shift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Shift</DialogTitle>
            <DialogDescription>
              Create a shift with start and end times.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="startTime"
                  type="time"
                  className="pl-10"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            {errors.startTime && (
              <p className="text-red-500 text-sm ml-[33%] -mt-2">
                {errors.startTime.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="endTime"
                  type="time"
                  className="pl-10"
                  {...register("endTime", { required: "End time is required" })}
                />
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            {errors.endTime && (
              <p className="text-red-500 text-sm ml-[33%] -mt-2">
                {errors.endTime.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Save Shift</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftCreate;
