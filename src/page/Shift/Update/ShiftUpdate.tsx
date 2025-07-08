import { useGetShiftByIdQuery } from "@/redux/api/shiftApi/shiftApi";
import { useParams } from "react-router-dom";

const ShiftUpdate = () => {
  const { id } = useParams();
  // const navigate = useNavigate();
  const { data: shiftData } = useGetShiftByIdQuery(id as string);

  console.log("singleShift =>", shiftData?.data);

  // const form = useForm({
  //   defaultValues: {
  //     ShiftName: "",
  //   },
  // });

  return (
    <div>
      <h1>Hello,This is ShiftUpdate Route!</h1>
    </div>
  );
};

export default ShiftUpdate;
