/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { ImageUpload } from "@/components/common/ImageUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  useGetAllBatchQuery,
  useGetBatchInfoByIdQuery,
} from "@/redux/api/batch/batchApi";
import { useGetAllClassQuery } from "@/redux/api/class/classApi";
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
import { useAddStudentMutation } from "@/redux/api/studentApi/studentApi";
import { uploadImageToImgbb } from "@/utils/uploadImageToImgbb";
import { ChevronsRight, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const StudentCreate = () => {
  const navigate = useNavigate();
  const { data: batchData } = useGetAllBatchQuery(undefined);
  const { data: classData } = useGetAllClassQuery(undefined);
  const { data: shiftData } = useGetAllShiftQuery(undefined);
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
      admissionFees: "",
      address: "",
      image: null,
      gender: "",
      classId: "",
      shiftId: "",
      batchId: "",
    },
  });

  const batchId = form.watch("batchId");
  const { data: batchInfo } = useGetBatchInfoByIdQuery(batchId);
  const [addStudent] = useAddStudentMutation();

  const onSubmit = async (data: any) => {
    const image = await uploadImageToImgbb(data.image);

    try {
      const batchName = batchData?.data?.find(
        (item: any) => item.id === data.batchId
      )?.batchName;
      const shiftName = shiftData?.data?.find(
        (item: any) => item.id === data.shiftId
      )?.shiftName;
      const className = classData?.data?.find(
        (item: any) => item.id === data.classId
      )?.className;

      const studentData = {
        firstName: data.firstName,
        lastName: data.lastName,
        admissionFees: data.admissionFees,
        phone: data.phone,
        fatherName: data.fatherName,
        motherName: data.motherName,
        religion: data.religion,
        schoolName: data.schoolName,
        address: data.address,
        gender: data.gender,
        image: image,
        batchId: data.batchId,
        shiftId: batchInfo?.data?.Shift?.id,
        classId: batchInfo?.data?.Class?.id,
        batchName: batchName,
        shiftName: shiftName,
        className: className,
      };

      const res = await addStudent(studentData);
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
        <h1 className="text-2xl font-bold text-blue-700">
          <Link to="/view-student">Student</Link>
        </h1>
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
                rules={{ required: "First Name Required" }}
              />
              <FormFieldWrapper
                name="lastName"
                label="Last Name"
                placeholder="Enter your Last Name"
                rules={{ required: "Last Name Required" }}
              />
              {/* <FormFieldWrapper
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
              /> */}
              <FormFieldWrapper
                name="admissionFees"
                label="AdmissionFees"
                type="number"
                placeholder="Enter your AdmissionFees"
              />
              <FormFieldWrapper
                name="phone"
                label="Phone"
                placeholder="Enter your Phone Number"
                rules={{ required: "Phone Name Required" }}
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
            </div>

            <Button
              disabled={
                !batchInfo?.data?.Shift?.id || !batchInfo?.data?.Class?.id
              }
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
