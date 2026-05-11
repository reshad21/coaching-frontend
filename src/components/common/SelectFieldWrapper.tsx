/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";

type Option = {
  value: string;
  name: string;
  disabled?: boolean;
};

interface SelectFieldWrapperProps {
  name: string;
  label?: string;
  options: Option[];
  control: any;
  required?: boolean;
  rules?: Record<string, any>;
  onChange?: (value: string) => void; // <-- Added this
}

export const SelectFieldWrapper = ({
  name,
  label,
  options,
  control,
  rules,
  required,
  onChange,
}: SelectFieldWrapperProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          {/* ✅ Responsive label sizing with optional required indicator */}
          <FormLabel className="text-xs sm:text-sm">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);      // update form state
              onChange?.(value);          // external handler (like setting class)
            }}
          >
            <FormControl>
              <SelectTrigger className="text-xs sm:text-sm h-10 sm:h-auto">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white text-xs sm:text-sm">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="text-xs sm:text-sm"
                >
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription />
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
