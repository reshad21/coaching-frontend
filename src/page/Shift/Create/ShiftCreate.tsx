
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddShiftMutation } from "@/redux/api/shiftApi/shiftApi"
import { formatTime12Hour } from "@/utils/formatTime12Hour"
import { Clock, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

type FormValues = {
  startTime: string
  endTime: string
}

const ShiftCreate = () => {
  const [addShift] = useAddShiftMutation()
  const [open, setOpen] = useState(false)

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
  })

  const onSubmit = async (data: FormValues) => {
    const formattedStart = formatTime12Hour(data.startTime)
    const formattedEnd = formatTime12Hour(data.endTime)

    const shiftData = {
      shiftName: `${formattedStart} - ${formattedEnd}`,
    }

    try {
      const res: any = await addShift(shiftData).unwrap()

      if (res.statusCode === 200) {
        toast.success(res?.message || "Shift created successfully!")
        reset()
        setOpen(false)
      } else {
        toast.error(res?.message || "Something went wrong!")
      }
    } catch {
      toast.error("Failed to create shift")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="h-4 w-4" />
          Add New Shift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Create New Shift</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set the start and end times for your new shift schedule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Start Time Field */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-sm font-medium text-foreground">
                Start Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  className={`pl-10 h-11 ${errors.startTime ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Select start time"
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                />
              </div>
              {errors.startTime && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.startTime.message}</span>
                </div>
              )}
            </div>

            {/* End Time Field */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium text-foreground">
                End Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  className={`pl-10 h-11 ${errors.endTime ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  placeholder="Select end time"
                  {...register("endTime", {
                    required: "End time is required",
                  })}
                />
              </div>
              {errors.endTime && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.endTime.message}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white shadow-sm">
              Create Shift
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ShiftCreate
