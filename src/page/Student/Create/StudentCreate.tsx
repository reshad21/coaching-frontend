"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper"
import { ImageUpload } from "@/components/common/ImageUpload"
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useGetAllBatchQuery, useGetBatchInfoByIdQuery } from "@/redux/api/batch/batchApi"
import { useGetAllClassQuery } from "@/redux/api/class/classApi"
import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi"
import { useAddStudentMutation } from "@/redux/api/studentApi/studentApi"
import { useSendSingleMessageMutation } from "@/redux/api/auth/message/message"
import { uploadImageToImgbb } from "@/utils/uploadImageToImgbb"
import { ChevronRight, Plus, GraduationCap } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

const StudentCreate = () => {
  const navigate = useNavigate()
  const { data: batchData } = useGetAllBatchQuery(undefined)
  const { data: classData } = useGetAllClassQuery(undefined)
  const { data: shiftData } = useGetAllShiftQuery(undefined)
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
  })

  const batchId = form.watch("batchId")
  const { data: batchInfo } = useGetBatchInfoByIdQuery(batchId)
  const [addStudent] = useAddStudentMutation()
  const [sendMessage] = useSendSingleMessageMutation()

  const onSubmit = async (data: any) => {
    const image = await uploadImageToImgbb(data.image)

    try {
      const batchName = batchData?.data?.find((item: any) => item.id === data.batchId)?.batchName
      const shiftName = shiftData?.data?.find((item: any) => item.id === data.shiftId)?.shiftName
      const className = classData?.data?.find((item: any) => item.id === data.classId)?.className

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
      }

      const res = await addStudent(studentData)
      if ("data" in res && res.data?.success) {
        toast.success(res.data.message || "Student added successfully!")
        
        // Send welcome SMS to the student's phone number
        const welcomeMessage = `Welcome ${data.firstName} ${data.lastName}! You have been successfully registered. Thank you for joining us!`
        
        try {
          const msgRes = await sendMessage({
            message: welcomeMessage,
            number: data.phone,
          }).unwrap()
          
          if (msgRes?.data?.response_code == 202) {
            toast.success("Welcome message sent successfully!")
          }
        } catch (msgError) {
          console.error("Failed to send welcome message:", msgError)
        }
        
        form.reset()
        navigate("/view-student")
      } else {
        toast.error("An error occurred while adding the student.")
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error(error?.data?.error || "An error occurred while adding the student.")
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/view-student" className="hover:text-foreground transition-colors font-medium">
                Students
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">New Registration</span>
            </nav>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Registration</h1>
            <p className="text-muted-foreground">Complete the form below to register a new student in the system.</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Profile Image Section */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Profile Photo</h2>
                  <ImageUpload name="image" fileTypes="image/jpeg,image/png,image/gif" />
                </div>

                {/* Personal Information */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormFieldWrapper
                      name="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                      rules={{ required: "First name is required" }}
                    />
                    <FormFieldWrapper
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                      rules={{ required: "Last name is required" }}
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
                    <FormFieldWrapper
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      rules={{ required: "Phone number is required" }}
                    />
                    <FormFieldWrapper name="address" label="Address" placeholder="Enter full address" />
                  </div>
                </div>

                {/* Family Information */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Family Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormFieldWrapper name="fatherName" label="Father's Name" placeholder="Enter father's name" />
                    <FormFieldWrapper name="motherName" label="Mother's Name" placeholder="Enter mother's name" />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b border-border pb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-6">Academic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormFieldWrapper
                      name="schoolName"
                      label="School Name"
                      placeholder="Enter previous school name"
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
                    <FormFieldWrapper
                      name="admissionFees"
                      label="Admission Fees"
                      type="number"
                      placeholder="Enter admission fees"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    disabled={!batchInfo?.data?.Shift?.id || !batchInfo?.data?.Class?.id}
                    type="submit"
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-md transition-colors flex items-center justify-center gap-2 text-white"
                  >
                    <Plus className="w-5 h-5" />
                    Register Student
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCreate
