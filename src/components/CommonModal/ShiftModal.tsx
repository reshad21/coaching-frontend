/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateShiftMutation } from "@/redux/api/shiftApi/shiftApi"
import { convertTo24Hour } from "@/utils/convertTo24Hour"
import { AlertCircle, Clock } from "lucide-react"
import type * as React from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const ShiftModal = ({
  open,
  setOpen,
  data,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  data: any
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">Update Shift</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify the start and end times for this shift schedule.
          </DialogDescription>
        </DialogHeader>
        <ShiftFormModal data={data} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

type TFormData = {
  startTime: string
  endTime: string
}

const formatTime12Hour = (time: string): string => {
  const [hourStr, minuteStr] = time.split(":")
  const hour = Number.parseInt(hourStr, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const adjustedHour = hour % 12 || 12
  return `${adjustedHour}:${minuteStr} ${ampm}`
}

function ShiftFormModal({
  data,
  setOpen,
}: {
  data: any
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [updateShift, { isLoading }] = useUpdateShiftMutation()

  const initialTimes = data?.shiftName?.split(" - ") || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: {
      startTime: initialTimes[0] ? convertTo24Hour(initialTimes[0]) : "",
      endTime: initialTimes[1] ? convertTo24Hour(initialTimes[1]) : "",
    },
  })

  const onSubmit = async (formData: TFormData) => {
    try {
      const shiftName = `${formatTime12Hour(formData.startTime)} - ${formatTime12Hour(formData.endTime)}`

      const updatedData = {
        id: data.id,
        data: {
          shiftName,
        },
      }

      const res: any = await updateShift(updatedData).unwrap()

      if (res.statusCode === 200) {
        toast.success(res.message || "Shift updated successfully!")
        reset()
        setOpen(false)
      } else {
        toast.error(res.message || "Something went wrong!")
      }
    } catch (error) {
      toast.error("Failed to update shift")
    }
  }

  return (
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
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="flex-1 sm:flex-none"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Shift"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default ShiftFormModal
