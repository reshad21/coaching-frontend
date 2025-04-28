import { useParams } from "react-router-dom";

const StudentUpdate = () => {
  const { id } = useParams();
  return <div>Update student: {id}</div>;
};

export default StudentUpdate;
