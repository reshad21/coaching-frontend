/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetPaymentByIdQuery } from "@/redux/api/payment/paymentApi";
import { useParams } from "react-router-dom";

const PaymentDetails = () => {
  const { id } = useParams();

  const { data: payments } = useGetPaymentByIdQuery(id);
  console.log("get payment data==>", payments);

  return (
    <>
      <div className="p-4 md:p-8 space-y-6">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.data?.Payment?.map((payment: any) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.title}</TableCell>
                  <TableCell className="capitalize">{payment.type}</TableCell>
                  <TableCell>{payment.month || "—"}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
