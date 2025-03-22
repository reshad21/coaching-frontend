/* eslint-disable @typescript-eslint/no-explicit-any */
import { useController, Control } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface DatePickerFieldWrapperProps {
  name: string
  label: string
  control: Control<any> 
}

export const DatePickerFieldWrapper = ({ name, label, control }: DatePickerFieldWrapperProps) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control })

  return (
    <FormField
      name={name}
      control={control}
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel className="pb-[0.35rem]">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-start">
                  {value ? format(value, "PPP") : "Pick a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={value} onSelect={onChange} />
            </PopoverContent>
          </Popover>
          <FormMessage>{error?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}
