/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { ImageUpload } from "@/components/common/ImageUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
import { useAddStudentMutation } from "@/redux/api/studentApi/studentApi";
import { ChevronsRight, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentCreate = () => {
  const navigate = useNavigate();
  const { data: batchData } = useGetAllBatchQuery(undefined);
  const { data: classData } = useGetAllClassQuery(undefined);
  const { data: shiftData } = useGetAllShiftQuery(undefined);
  const [addStudent] = useAddStudentMutation();

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
      image: null,
      gender: "",
      classId: "",
      shiftId: "",
      batchId: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("form adta-->",data);
    try {
      const isoDateOfBirth = new Date(data.dateOfBirth).toISOString();
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dateOfBirth", isoDateOfBirth);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("fatherName", data.fatherName);
      formData.append("motherName", data.motherName);
      formData.append("religion", data.religion);
      formData.append("schoolName", data.schoolName);
      formData.append("address", data.address);
      formData.append("gender", data.gender);
      formData.append("image", data.image);
      formData.append("batchId", data.batchId);
      formData.append("shiftId", data.shiftId);
      formData.append("classId", data.classId);

      // 🔽 Add corresponding names manually
      const batchName = batchData?.data?.find((item: any) => item.id === data.batchId)?.batchName;
      const shiftName = shiftData?.data?.find((item: any) => item.id === data.shiftId)?.shiftName;
      const className = classData?.data?.find((item: any) => item.id === data.classId)?.className;

      if (batchName) formData.append("batchName", batchName);
      if (shiftName) formData.append("shiftName", shiftName);
      if (className) formData.append("className", className);

      const res = await addStudent(formData);
      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "Student added successfully!");
        form.reset();
        navigate("/view-student");
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
      <div className="border-1 border-slate-500 rounded-lg shadow-md p-5">
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
                  { value: "Islam", name: "Islam" },
                  { value: "Hinduism", name: "Hinduism" },
                  { value: "Christianity", name: "Christianity" },
                  { value: "Buddhism", name: "Buddhism" },
                  { value: "Others", name: "Others" },
                ]}
                control={form.control}
              />
              <SelectFieldWrapper
                name="gender"
                label="Gender"
                options={[
                  { value: "male", name: "Male" },
                  { value: "female", name: "Female" },
                  { value: "others", name: "Others" },
                ]}
                control={form.control}
              />
              <FormFieldWrapper
                name="address"
                label="Address"
                placeholder="Enter your Address"
              />
              <FormFieldWrapper
                name="schoolName"
                label="School Name"
                placeholder="Enter your School Name"
              />

              <SelectFieldWrapper
                name="batchId"
                label="Select Batch"
                options={
                  batchData?.data?.map((item: any) => ({
                    value: item.id,
                    name: item.batchName,
                  })) || []
                }
                control={form.control}
              />

              <SelectFieldWrapper
                name="shiftId"
                label="Select Shift"
                options={
                  shiftData?.data?.map((item: any) => ({
                    value: item.id,
                    name: item.shiftName,
                  })) || []
                }
                control={form.control}
              />

              <SelectFieldWrapper
                name="classId"
                label="Select Class"
                options={
                  classData?.data?.map((item: any) => ({
                    value: item.id,
                    name: item.className,
                  })) || []
                }
                control={form.control}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-cyan-800 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-md transition"
            >
              <Plus className="w-5 h-5" />
              Add Student
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentCreate;
