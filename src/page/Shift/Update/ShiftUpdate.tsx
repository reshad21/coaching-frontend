import { useGetShiftByIdQuery } from "@/redux/api/shiftApi/shiftApi";
import { useNavigate, useParams } from "react-router-dom";

const ShiftUpdate = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const {data: shiftData} = useGetShiftByIdQuery(id as string);

  return (
    <div>
      <h1>Hello,This is ShiftUpdate Route!</h1>
    </div>
  );
};

export default ShiftUpdate;