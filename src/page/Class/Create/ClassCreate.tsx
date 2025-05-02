// import { useAddClassMutation } from "@/redux/api/class/classApi";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const ClassCreate = () => {
//   const [addClass] = useAddClassMutation();
//   const [className, setClassName] = useState("");
//   const [open, setOpen] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await addClass({ className }).unwrap();
//       setClassName("");
//       toast.success("Class added successfully");
//       setOpen(false);
//     } catch (error) {
//       console.error("Failed to add class:", error);
//       toast.error("Failed to add class");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-2 text-white">
//           <Plus className="h-4 w-4" />
//           Add New Class
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Add New Class</DialogTitle>
//             <DialogDescription>
//               Create a new class here. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="className" className="text-right">
//                 Class Name
//               </Label>
//               <Input
//                 id="className"
//                 placeholder="Class 6"
//                 className="col-span-3"
//                 value={className}
//                 onChange={(e) => setClassName(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save Class</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ClassCreate;



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
        <Button className="gap-2 text-white">
          <Plus className="h-4 w-4" />
          Add New Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Create a new class here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Class Name
              </Label>
              <Input
                id="className"
                placeholder="Class 6"
                className="col-span-3"
                {...register("className", { required: "Class name is required" })}
              />
            </div>
            {errors.className && (
              <p className="text-red-500 text-sm ml-[33%] -mt-2">
                {errors.className.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassCreate;

