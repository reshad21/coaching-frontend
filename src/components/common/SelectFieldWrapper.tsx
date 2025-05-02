/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";

type Option = {
  value: string;
  name: string;
};

interface SelectFieldWrapperProps {
  name: string;
  label: string;
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
  onChange,
}: SelectFieldWrapperProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);      // update form state
              onChange?.(value);          // external handler (like setting class)
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
