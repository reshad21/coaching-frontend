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

interface Option {
  value: string;
  name: string;
}

interface SelectFieldWrapperProps {
  name: string;
  label: string;
  options: Option[];
  control: any;
}

export const SelectFieldWrapper = ({
  name,
  label,
  options,
  control,
}: SelectFieldWrapperProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex justify-center items-start flex-col border p-[.35rem] rounded-md shadow-sm w-full relative">
            <ChevronDown
              strokeWidth={1}
              size={24}
              className="absolute right-0 text-gray-600 text-xs"
            />
            <div className="w-full">
              <FormControl className="w-full">
                <Select
                  onValueChange={field?.onChange}
                  defaultValue={field?.value} // <-- CHANGED FROM defaultValue to value
                >
                  <SelectTrigger className="w-full flex justify-start items-start ps-2">
                    <SelectValue
                      placeholder={`Select ${label?.toLowerCase()}`}
                      className="text-[#dedede] w-full"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    {options?.map((item: any) => (
                      <SelectItem key={item?.value} value={item?.value} className="cursor-pointer hover:bg-gray-100">
                        {item?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
