// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { Edit, Trash2, Plus } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const ShiftView = () => {
//   const { data: shift, isLoading } = useGetAllShiftQuery(undefined);
//   const shiftData = shift?.data;

//   return (
//     <div className="container mx-auto ">
//       <Card>
//         <CardHeader className="px-6 pt-6 pb-4">
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-2xl font-semibold text-gray-800">
//               Shift Management
//             </CardTitle>

//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button className="gap-2 text-white">
//                   <Plus className="h-4 w-4" />
//                   Add New Shift
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Add New Shift</DialogTitle>
//                   <DialogDescription>
//                     Create a new shift here. Click save when you're done.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <Label htmlFor="shiftName" className="text-right">
//                       Shift Name
//                     </Label>
//                     <Input
//                       id="shiftName"
//                       placeholder="Morning Shift"
//                       className="col-span-3"
//                     />
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit">Save Shift</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent className="px-6 pb-6">
//           <Table>
//             <TableHeader className="bg-gray-50">
//               <TableRow>
//                 <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
//                 <TableHead className="text-gray-600">Shift Name</TableHead>
//                 <TableHead className="text-gray-600 text-right">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {shiftData?.map((shiftItem: any, index: number) => (
//                 <TableRow key={shiftItem.id} className="hover:bg-gray-50">
//                   <TableCell className="font-medium text-gray-700">
//                     {index + 1}
//                   </TableCell>
//                   <TableCell className="text-gray-600">
//                     {shiftItem.shiftName}
//                   </TableCell>
//                   <TableCell className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       className="h-8 w-8 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ShiftView;

import { useGetAllShiftQuery } from "@/redux/api/shiftApi/shiftApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShiftCreate from "../Create/ShiftCreate";


const ShiftView = () => {
  const { data: shift, isLoading } = useGetAllShiftQuery(undefined);
  const shiftData = shift?.data;

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Shift Management
            </CardTitle>
            <ShiftCreate />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[60px] text-gray-600">S.N</TableHead>
                <TableHead className="text-gray-600">Shift Name</TableHead>
                <TableHead className="text-gray-600 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shiftData?.map((shiftItem: any, index: number) => (
                <TableRow key={shiftItem.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {shiftItem.shiftName}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 border-blue-100 hover:border-blue-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftView;
