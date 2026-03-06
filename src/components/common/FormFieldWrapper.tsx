/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export const FormFieldWrapper = ({
  name,
  label,
  type = "text",
  isPassword = false,
  control,
  placeholder,
  defaultValue,
  isDisabled = false,
  required = false, 
  rules = {},      
}: any) => {
  const [show, setShow] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: required ? `${label} is required` : false,
        ...rules, 
      }}
      render={({ field }) => (
        <FormItem>
          {/* ✅ Responsive label sizing */}
          <FormLabel className="text-xs sm:text-sm">{label}</FormLabel>
          <FormControl>
            {isPassword ? (
              <div className="relative">
                <Input
                  type={show ? "text" : type}
                  {...field}
                  placeholder={placeholder}
                  disabled={isDisabled}
                  className="text-sm sm:text-base pr-10 h-10 sm:h-auto"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={16} className="sm:w-[20px] sm:h-[20px]" /> : <Eye size={16} className="sm:w-[20px] sm:h-[20px]" />}
                </Button>
              </div>
            ) : (
              <Input
                type={type}
                {...field}
                placeholder={placeholder}
                defaultValue={defaultValue}
                disabled={isDisabled}
                className="text-sm sm:text-base h-10 sm:h-auto"
              />
            )}
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )}
    />
  )
}
