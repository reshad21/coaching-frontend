/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { ImageUpload } from "@/components/common/ImageUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} from "@/redux/api/studentApi/studentApi";
import { ChevronsRight, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const StudentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //*fetch batch data from and student mutation redux store
  const { data: student, isLoading } = useGetStudentByIdQuery(id as string);
  console.log("get single student inforfmation==>", student?.data);
  const { data: batchData } = useGetAllBatchQuery(undefined);
  const [updateStudent] = useUpdateStudentMutation();
  

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      religion: "",
      schoolName: "",
      studentId: "",
      phone: "",
      email: "",
      address: "",
      image: "",
      gender: "",
      class: "",
      batchId: "",
    },
  });

  const { reset } = form;
  // Update form values when student data comes
  useEffect(() => {
    if (student?.data) {
      const dateOfBirth = student.data.dateOfBirth
        ? new Date(student.data.dateOfBirth).toISOString().split("T")[0]
        : "";
      reset({
        firstName: student.data.firstName || "",
        lastName: student.data.lastName || "",
        fatherName: student.data.fatherName || "",
        motherName: student.data.motherName || "",
        dateOfBirth: dateOfBirth || "",
        religion: student.data.religion || "",
        schoolName: student.data.schoolName || "",
        studentId: student.data.studentId || "",
        phone: student.data.phone || "",
        email: student.data.email || "",
        address: student.data.address || "",
        image: `http://localhost:3000${student.data?.image}`,
        gender: student.data.gender || "",
        class: student.data.class || "",
        batchId: student.data.batchId || "",
      });
    }
  }, [student?.data, reset]);

  if (isLoading) return <p>Loading..</p>;

  //handle form submission
  const onSubmit = async (data: any) => {
    try {
      const isoDateOfBirth = new Date(data.dateOfBirth).toISOString();
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dateOfBirth", isoDateOfBirth);
      formData.append("studentId", data.studentId
);
      formData.append("regNumber", data.regNumber);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("fatherName", data.fatherName);
      formData.append("motherName", data.motherName);
      formData.append("religion", data.religion);
      formData.append("schoolName", data.schoolName);
      formData.append("address", data.address);
      formData.append("image", data.image);
      formData.append("gender", data.gender);
      formData.append("class", data.class);
      formData.append("batchId", data.batchId);

      // console.log("student data", Object.fromEntries(formData));

      const res = await updateStudent({ data: formData, id });
      // console.log("response", res);
      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "Student update successfully!");
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
        <h1 className="text-2xl font-bold text-slate-600">Update Student</h1>
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
                placeholder="Enter your Date of Birth"
              />
              <FormFieldWrapper
                name="studentId"
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
              <FormFieldWrapper
                name="class"
                label="Enter Class"
                placeholder="Enter your class"
              />
              <SelectFieldWrapper
                name="batchId"
                label="Batch"
                options={
                  batchData?.data?.map((batch: any) => ({
                    value: batch?.id,
                    name: batch?.batchName,
                  })) || []
                }
                control={form.control}
              />
            </div>

            <Button
              type="submit"
              // disabled={!passwordsMatch}
              className="w-full bg-primary hover:bg-green-800 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-md transition"
            >
              <Plus className="w-5 h-5" />
              Update Student
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentUpdate;
