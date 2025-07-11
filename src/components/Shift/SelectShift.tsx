/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";

const SelectShift = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) => {
  const { data: shiftData, isLoading } = useGetAllShiftQuery(undefined);
  if (isLoading) return "";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full ">
        <SelectValue placeholder="Select Shift" />
      </SelectTrigger>
      <SelectContent className="bg-slate-100 text-slate-700 font-semibold">
        <SelectGroup>
          {shiftData?.data?.map((item: any) => (
            <SelectItem key={item.id} value={item.shiftName}>
              <span className="text-slate-800 font-semibold">
                {item.shiftName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectShift;
