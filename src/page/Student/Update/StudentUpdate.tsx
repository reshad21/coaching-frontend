/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper";
import { ImageUpload } from "@/components/common/ImageUpload";
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetAllBatchQuery } from "@/redux/api/batch/batchApi";
import {
  useGetStudentByIdQuery,
  useUpdateStudentMutation,
} from "@/redux/api/studentApi/studentApi";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

// --- Define types
type TStudentFormData = {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  religion: string;
  schoolName: string;
  studentId: string;
  phone: string;
  address: string;
  image: File | string;
  gender: string;
  batchId: string;
};

type TBatch = {
  id: string;
  batchName: string;
};

const StudentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: student, isLoading } = useGetStudentByIdQuery(id!);
  const { data: batchData } = useGetAllBatchQuery(undefined);
  const [updateStudent] = useUpdateStudentMutation();

  const form = useForm<TStudentFormData>();
  const { reset } = form;

  useEffect(() => {
    if (student?.data) {
      reset({
        firstName: student?.data?.firstName || "",
        lastName: student?.data?.lastName || "",
        fatherName: student?.data?.fatherName || "",
        motherName: student?.data?.motherName || "",
        religion: student?.data?.religion || "",
        schoolName: student?.data?.schoolName || "",
        studentId: student?.data?.studentId || "",
        phone: student?.data?.phone || "",
        address: student?.data?.address || "",
        image: student?.data?.image || "",
        gender: student?.data?.gender || "",
        batchId: student?.data?.batchId || "",
      });
    }
  }, [student?.data, reset]);

  if (isLoading) return <Loading />;

  const onSubmit: SubmitHandler<TStudentFormData> = async (data) => {
    const formData = new FormData();

    formData.append("image", data?.image);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("studentId", data.studentId);
    formData.append("phone", data.phone);
    formData.append("fatherName", data.fatherName);
    formData.append("motherName", data.motherName);
    formData.append("religion", data.religion);
    formData.append("schoolName", data.schoolName);
    formData.append("address", data.address);
    formData.append("gender", data.gender);
    formData.append("batchId", data.batchId);

    const payload = Object.fromEntries(formData);
    const res: any = await updateStudent({
      data: payload,
      id: id,
    });
    console.log("update response", res);
    if ("data" in res && res?.data?.success) {
      toast.success(res?.data?.message || "Student updated successfully!");
      form.reset();
      navigate("/view-student");
    } else {
      toast.error(
        res?.data?.message || "An error occurred while updating the student."
      );
    }
  };

  return (
    <div>
      
      {/* <StudentHeader
        title="Update Student"
        description="Modify student information and academic records"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Student Management", href: "/view-student" },
          { label: "Update Student" },
        ]}
      /> */}

      <div className="border-1 border-slate-500 rounded-lg shadow-md p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUpload
              name="image"
              fileTypes="image/jpeg,image/png,image/gif"
              defaultUrl={
                typeof student?.data?.image === "string"
                  ? student.data.image
                  : undefined
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormFieldWrapper
                name="firstName"
                label="FIRST NAME"
                placeholder="Enter your First Name"
              />
              <FormFieldWrapper
                name="lastName"
                label="LAST NAME"
                placeholder="Enter your Last Name"
              />
              <FormFieldWrapper
                name="studentId"
                label="ID NUMBER"
                placeholder="Enter your ID Number"
                isDisabled="true"
              />

              <FormFieldWrapper
                name="phone"
                label="PHONE"
                placeholder="Enter your Phone Number"
              />
              <FormFieldWrapper
                name="fatherName"
                label="FATHER NAME"
                placeholder="Enter your Father's Name"
              />
              <FormFieldWrapper
                name="motherName"
                label="MOTHER NAME"
                placeholder="Enter your Mother's Name"
              />

              <SelectFieldWrapper
                name="religion"
                label="RELIGION"
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
                label="GENDER"
                options={[
                  { value: "male", name: "Male" },
                  { value: "female", name: "Female" },
                  { value: "others", name: "Others" },
                ]}
                control={form.control}
              />

              <FormFieldWrapper
                name="address"
                label="ADDRESS"
                placeholder="Enter your Address"
              />
              <FormFieldWrapper
                name="schoolName"
                label="SCHOOL NAME"
                placeholder="Enter your School Name"
              />

              <SelectFieldWrapper
                name="batchId"
                label="BATCH"
                options={
                  batchData?.data?.map((batch: TBatch) => ({
                    value: batch.id,
                    name: batch.batchName,
                  })) || []
                }
                control={form.control}
              />
            </div>

            <Button
              type="submit"
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
