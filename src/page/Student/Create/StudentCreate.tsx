/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileUpload } from "@/components/common/FileUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const StudentCreate = () => {
  // Initialize React Hook Form
  const form = useForm({
    defaultValues: {
      title: "",
      file: null,
    },
  });
  const onSubmit = async (data: any) => {
    console.log("show all data", data);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SelectFieldWrapper
            name="title"
            label="Exam type"
            options={[
              { value: "FIRST_PROF", name: "1st prof" },
              { value: "SECOND_PROF", name: "2nd porf" },
              { value: "THIRD_PROF", name: "3rd prof" },
              { value: "FOURTH_PROF", name: "4th prof" },
            ]}
            control={form.control}
          />
          <FileUpload name="file" label="Upload file" control={form.control} />
          <Button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white"
          >
            Create exam schedule
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentCreate;
