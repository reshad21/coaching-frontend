import { useGetStudentByIdQuery } from "@/redux/api/studentApi/studentApi";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // make sure you have lucide-react installed
import { Button } from "@/components/ui/button";

const SingleStdView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: studentData } = useGetStudentByIdQuery(id as string);

  console.log("singleStudent =>", studentData?.data);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full shadow-md rounded-lg p-8 border border-gray-300 relative">
        
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex justify-center items-center text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200 transition rounded-full"
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="w-5 h-5 font-bold" />
        </Button>

        <div className="flex flex-col items-center mt-8">
          <img
            src={`http://localhost:3000${studentData?.data?.image}`}
            alt={`${studentData?.data?.firstName} ${studentData?.data?.lastName}`}
            className="w-32 h-32 object-cover rounded-full mb-6"
          />
          <h1 className="text-2xl font-bold mb-2">
            {studentData?.data?.firstName} {studentData?.data?.lastName}
          </h1>
          <p className="text-gray-600 mb-4">{studentData?.data?.schoolName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-between">
          <Info label="Father's Name" value={studentData?.data?.fatherName} />
          <Info label="Mother's Name" value={studentData?.data?.motherName} />
          <Info label="Class" value={studentData?.data?.class} />
          <Info label="Batch" value={studentData?.data?.batchName} />
          <Info label="Email" value={studentData?.data?.email} />
          <Info label="Phone" value={studentData?.data?.phone} />
          <Info label="Address" value={studentData?.data?.address} />
          <Info label="Religion" value={studentData?.data?.religion} />
          <Info label="Gender" value={studentData?.data?.gender} />
          <Info
            label="Date of Birth"
            value={
              studentData?.data?.dateOfBirth
                ? new Date(studentData?.data?.dateOfBirth).toLocaleDateString()
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-gray-800 font-semibold">{value || "-"}</p>
  </div>
);

export default SingleStdView;
