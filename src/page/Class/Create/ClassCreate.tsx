
import { useAddClassMutation } from "@/redux/api/class/classApi";
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
  className: string;
};

const ClassCreate = () => {
  const [addClass] = useAddClassMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await addClass(data).unwrap();
      toast.success("Class added successfully");
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
      toast.error("Failed to add class");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto gap-2 text-white text-xs sm:text-sm h-9 sm:h-10">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">CREATE CLASS</span>
          <span className="sm:hidden">New Class</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] mx-4 sm:mx-0 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">Add New Class</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Create a new class here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-4 sm:py-6">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="className" className="text-xs sm:text-sm font-medium">
                Class Name
              </Label>
              <Input
                id="className"
                placeholder="Class 6"
                className="h-9 sm:h-11 text-xs sm:text-sm"
                {...register("className", { required: "Class name is required" })}
              />
            </div>
            {errors.className && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.className.message}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 pt-2 sm:pt-4 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
              Save Class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassCreate;

