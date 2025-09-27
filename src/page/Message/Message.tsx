import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import BatchMessage from "./BatchMessage/BatchMessage"
import ClassMessage from "./ClassMessage/ClassMessage"
import Shift from "./Shift/Shift"
import All from "./All/All"

const Message = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Send messages to different groups of students</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="batch" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger
              value="batch"
              className="py-3 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              Batch Message
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="py-3 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              Class Message
            </TabsTrigger>
            <TabsTrigger
              value="shift"
              className="py-3 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              Shift Message
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="py-3 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
            >
              All Students
            </TabsTrigger>
          </TabsList>

          <div className="border-t border-border mb-6"></div>

          <div className="min-h-[400px]">
            <TabsContent value="batch" className="mt-0">
              <BatchMessage />
            </TabsContent>
            <TabsContent value="class" className="mt-0">
              <ClassMessage />
            </TabsContent>
            <TabsContent value="shift" className="mt-0">
              <Shift />
            </TabsContent>
            <TabsContent value="all" className="mt-0">
              <All />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}

export default Message
