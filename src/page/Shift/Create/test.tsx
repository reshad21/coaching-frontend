import { useAddShiftMutation } from "@/redux/api/shiftApi/shiftApi";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

type FormValues = {
  shiftName: string;
};

const ShiftCreate = () => {
  const [addShift] = useAddShiftMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await addShift(data).unwrap();
      toast.success("Shift added successfully");
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add shift:", error);
      toast.error("Failed to add shift");
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
              Create a new shift here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftName" className="text-right">
                Shift Name
              </Label>
              <Input
                id="shiftName"
                placeholder="Morning Shift"
                className="col-span-3"
                {...register("shiftName", { required: "Shift name is required" })}
              />
            </div>
            {errors.shiftName && (
              <p className="text-red-500 text-sm ml-[33%] -mt-2">
                {errors.shiftName.message}
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
