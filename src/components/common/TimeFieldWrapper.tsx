/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const TimeFieldWrapper = ({
  name,
  label,
  control,
  placeholder,
  defaultValue,
  isDisabled = false,
}: any) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value ? new Date(field.value) : null
        const formattedValue = value
          ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
          : ""

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                type="time"
                value={formattedValue}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":")
                  const date = new Date()
                  date.setHours(Number(hours))
                  date.setMinutes(Number(minutes))
                  date.setSeconds(0)
                  date.setMilliseconds(0)

                  // ✅ Convert to ISO string
                  field.onChange(date.toISOString())

                  e.target.blur()
                }}
                placeholder={placeholder}
                disabled={isDisabled}
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

