/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectTrigger } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Control } from "react-hook-form"; 

interface Option {
  value: string;
  name: string;
}

interface SelectFieldWrapperProps {
  name: string;
  label: string;
  options: Option[];
  control: Control<any>;
  required?: boolean;
  rules?: Record<string, any>; 
}
export const SelectFieldWrapper = ({
  name,
  label,
  options,
  control,
  required = false,
  rules = {},
}: SelectFieldWrapperProps) => {
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
          <div className="flex justify-center items-start flex-col border p-[.35rem] rounded-md shadow-sm w-full relative">
            <ChevronDown
              strokeWidth={2}
              size={16}
              className="absolute right-2 top-2 text-gray-600"
            />
            <div className="w-full">
              <FormControl className="w-full">
                <Select
                  onValueChange={field?.onChange}
                  value={field?.value}
                >
                  <SelectTrigger className="w-full flex justify-start items-start ps-2">
                    <SelectValue
                      placeholder={`Select ${label?.toLowerCase()}`}
                      className="text-[#dedede] w-full"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    {options?.map((item: Option) => (
                      <SelectItem
                        key={item?.value}
                        value={item?.value}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {item?.name?.substring(0, 35)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
          </div>
          <FormMessage className="text-red-500 text-xs"/>
        </FormItem>
      )}
    />
  );
};

