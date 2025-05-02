/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAddBatchMutation } from "@/redux/api/batch/batchApi";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi"; // Adjust path if needed
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
import { useState } from "react";
import toast from "react-hot-toast";

const BatchCreate = () => {
  const [addBatch] = useAddBatchMutation();
  const [batchName, setBatchName] = useState("");
  const [classId, setClassId] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [open, setOpen] = useState(false);

  const { data: classData } = useGetAllClassQuery(undefined);
  const { data: shiftData } = useGetAllShiftQuery(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBatch({ batchName, classId, shiftId }).unwrap();
      setBatchName("");
      setClassId("");
      setShiftId("");
      toast.success("Batch added successfully");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add batch:", error);
      toast.error("Failed to add batch");
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
            <DialogDescription>
              Create a new batch by selecting class and shift.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchName" className="text-right">
                Batch Name
              </Label>
              <Input
                id="batchName"
                placeholder="Batch A"
                className="col-span-3"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classId" className="text-right">
                Class
              </Label>
              <select
                id="classId"
                className="col-span-3 border rounded px-2 py-1"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
              >
                <option value="">Select Class</option>
                {classData?.data?.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftId" className="text-right">
                Shift
              </Label>
              <select
                id="shiftId"
                className="col-span-3 border rounded px-2 py-1"
                value={shiftId}
                onChange={(e) => setShiftId(e.target.value)}
                required
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
            <Button type="submit">Save Batch</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCreate;
