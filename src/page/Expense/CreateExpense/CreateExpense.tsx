/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import generateMonthOptions from "@/utils/generateMonthOptions";
import { ChevronsRight } from "lucide-react";
import { useForm } from "react-hook-form";

const monthOptions = generateMonthOptions();

export const CreateExpense = () => {
  const form = useForm({
    defaultValues: {
      month: "", // Make sure it's empty or a valid 2025-XX
      instructorSalary: "",
      materialCost: "",
      rentAndUtilities: "",
      marketingCost: "",
      otherExpenses: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Form Submitted:", data);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Expense</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">Create Expense</h1>
      </div>
      <div className="border-2 border-slate-200 rounded-lg  p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormFieldWrapper
                name="instructorSalary"
                label="Instructor Salary"
                placeholder="Enter amount"
              />
              <FormFieldWrapper
                name="materialCost"
                label="Material Cost"
                placeholder="Enter amount"
              />
              <FormFieldWrapper
                name="rentAndUtilities"
                label="Rent & Utilities"
                placeholder="Enter amount"
              />
              <FormFieldWrapper
                name="marketingCost"
                label="Marketing Cost"
                placeholder="Enter amount"
              />
              <FormFieldWrapper
                name="otherExpenses"
                label="Other Expenses"
                placeholder="Enter amount"
              />
              <SelectFieldWrapper
                name="month"
                label="Month"
                options={monthOptions}
                control={form.control}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white"
            >
              SUBMIT
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
