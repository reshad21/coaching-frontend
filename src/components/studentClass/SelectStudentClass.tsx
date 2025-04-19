/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";

const SelectStudentClass = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) => {
  const { data: classData, isLoading } = useGetAllClassQuery(undefined);
  if (isLoading) return "";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full ">
        <SelectValue placeholder="Select Student Class" />
      </SelectTrigger>
      <SelectContent className="bg-slate-100 text-slate-700 font-semibold">
        <SelectGroup>
          {classData?.data?.map((item: any) => (
            <SelectItem key={item.id} value={item.className}>
              <span className="text-slate-800 font-semibold">
                {item.className}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectStudentClass;
