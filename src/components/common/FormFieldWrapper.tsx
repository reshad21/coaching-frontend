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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {isPassword ? (
              <div className="relative">
                <Input
                  type={show ? "text" : type}
                  {...field}
                  placeholder={placeholder}
                  disabled={isDisabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            ) : (
              <Input
                type={type}
                {...field}
                placeholder={placeholder}
                defaultValue={defaultValue}
                disabled={isDisabled}
              />
            )}
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )}
    />
  )
}
