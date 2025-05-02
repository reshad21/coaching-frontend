/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
  
  const SelectBatch = ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (val: string) => void;
  }) => {
    const { data: batchData, isLoading } = useGetAllBatchQuery(undefined);
    if (isLoading) return "";
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Select Batch" />
        </SelectTrigger>
        <SelectContent className="bg-slate-100 text-slate-700 font-semibold">
          <SelectGroup>
            {batchData?.data?.map((item: any) => (
              <SelectItem key={item.id} value={item.batchName}>
                <span className="text-slate-800 font-semibold">
                  {item.batchName}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };
  
  export default SelectBatch;
  