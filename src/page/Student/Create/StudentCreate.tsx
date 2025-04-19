/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { ImageUpload } from "@/components/common/ImageUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import { useAddStudentMutation } from "@/redux/api/student/student";
import { ChevronsRight, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const StudentCreate = () => {
  //fetch batch data from redux store
  const { data: batchData } = useGetAllBatchQuery(undefined);
  console.log("see all batch data", batchData);
  const [addStudent] = useAddStudentMutation();
  // Initialize React Hook Form
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      religion: "",
      schoolName: "",
      phone: "",
      email: "",
      address: "",
      image: "",
      gender: "",
      class: "",
      Payment: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const isoDateOfBirth = new Date(data.dateOfBirth).toISOString();
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dateOfBirth", isoDateOfBirth);
      formData.append("idNumber", data.idNumber);
      formData.append("regNumber", data.regNumber);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("fatherName", data.fatherName);
      formData.append("motherName", data.motherName);
      formData.append("religion", data.religion);
      formData.append("schoolName", data.schoolName);
      formData.append("batch", data.batch);
      formData.append("address", data.address);
      formData.append("image", data.image);
      formData.append("gender", data.gender);
      formData.append("class", data.class);
      formData.append("Payment", data.Payment);

      const res = await addStudent(formData);
      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "Student added successfully!");
        form.reset();
        // navigate("/students");
      } else {
        toast.error("An error occurred while adding the student.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.data?.error || "An error occurred while adding the student."
      );
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-700">Student</h1>
        <span>
          <ChevronsRight />
        </span>
        <h1 className="text-2xl font-bold text-slate-600">Create Student</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ImageUpload
            name="image"
            fileTypes="image/jpeg,image/png,image/gif"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormFieldWrapper
              name="firstName"
              label="First Name"
              placeholder="Enter your First Name"
            />
            <FormFieldWrapper
              name="lastName"
              label="Last Name"
              placeholder="Enter your Last Name"
            />
            <FormFieldWrapper
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              placeholder="Enter your Date of Birth"
            />
            <FormFieldWrapper
              name="idNumber"
              label="ID Number"
              placeholder="Enter your ID Number"
            />
            <FormFieldWrapper
              name="regNumber"
              label="Reg Number"
              placeholder="Enter your Reg Number"
            />
            <FormFieldWrapper
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your Email"
            />
            <FormFieldWrapper
              name="phone"
              label="Phone"
              placeholder="Enter your Phone Number"
            />
            <FormFieldWrapper
              name="fatherName"
              label="Father's Name"
              placeholder="Enter your Father's Name"
            />
            <FormFieldWrapper
              name="motherName"
              label="Mother's Name"
              placeholder="Enter your Mother's Name"
            />
            <SelectFieldWrapper
              name="religion"
              label="Religion"
              options={[
                { value: "islam", name: "Islam" },
                { value: "hindu", name: "Hindu" },
                { value: "christian", name: "Christian" },
                { value: "buddhist", name: "Buddhist" },
                { value: "others", name: "Others" },
              ]}
              control={form.control}
            />
            <FormFieldWrapper
              name="address"
              label="Address"
              placeholder="Enter your Address"
            />
            <SelectFieldWrapper
              name="batch"
              label="Batch"
              options={batchData?.data}
              control={form.control}
            />
          </div>

          <Button
            type="submit"
            // disabled={!passwordsMatch}
            className="w-full bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-md transition"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentCreate;
