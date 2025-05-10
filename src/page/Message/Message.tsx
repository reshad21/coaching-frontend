import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchMessage from "./BatchMessage/BatchMessage";
import ClassMessage from "./ClassMessage/ClassMessage";
import Shift from "./Shift/Shift";

const Message = () => {
  return (
    <div>
      <Tabs defaultValue="batch" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-[22px]">
          <TabsTrigger
            value="batch"
            className="py-4 data-[state=active]:bg-[#03a79150] data-[state=active]:text-[#03A791] data-[state=active]:border-b-2 data-[state=active]:border-[#03A791]"
          >
            Batch Message
          </TabsTrigger>
          <TabsTrigger
            value="class"
            className="py-4 data-[state=active]:bg-[#03a79150] data-[state=active]:text-[#03A791] data-[state=active]:border-b-2 data-[state=active]:border-[#03A791]"
          >
            Class Message
          </TabsTrigger>
          <TabsTrigger
            value="shift"
            className="py-4 data-[state=active]:bg-[#03a79150]  data-[state=active]:text-[#03A791] data-[state=active]:border-b-2 data-[state=active]:border-[#03A791]"
          >
            Shift Message
          </TabsTrigger>
        </TabsList>
        <hr />
        <TabsContent value="batch">
          <BatchMessage />
        </TabsContent>
        <TabsContent value="class">
          <ClassMessage />
        </TabsContent>
        <TabsContent value="shift">
          <Shift />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Message;
