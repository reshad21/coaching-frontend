import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BatchMessage from "./BatchMessage/BatchMessage"
import ClassMessage from "./ClassMessage/ClassMessage"
import Shift from "./Shift/Shift"
import All from "./All/All"

interface TabItem {
  value: string
  label: string
  shortLabel: string
  component: React.ReactNode
}

const Message = () => {
  const [activeTab, setActiveTab] = useState("batch")

  const tabs: TabItem[] = [
    {
      value: "batch",
      label: "Batch Message",
      shortLabel: "Batch",
      component: <BatchMessage />,
    },
    {
      value: "class",
      label: "Class Message",
      shortLabel: "Class",
      component: <ClassMessage />,
    },
    {
      value: "shift",
      label: "Shift Message",
      shortLabel: "Shift",
      component: <Shift />,
    },
    {
      value: "all",
      label: "All Students",
      shortLabel: "All",
      component: <All />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-2 py-3 xs:px-3 xs:py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-3 xs:mb-4 sm:mb-6 md:mb-8 space-y-1">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight break-words">
              Messages
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              Send messages to different groups of students
            </p>
          </div>

          {/* Main Card */}
          <Card className="overflow-hidden shadow-none border-0 bg-transparent">
            <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* ============ MOBILE VIEW (< 640px) ============ */}
                <div className="block sm:hidden space-y-3">
                  {/* Mobile Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-2">
                      Message Type
                    </label>
                    <Select value={activeTab} onValueChange={setActiveTab}>
                      <SelectTrigger className="w-full h-10 text-xs font-medium bg-background mb-3">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[280px] w-[var(--radix-select-trigger-width)] min-w-0">
                        {tabs.map((tab) => (
                          <SelectItem key={tab.value} value={tab.value} className="text-xs">
                            <span className="font-medium">{tab.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ============ TABLET VIEW (640px - 1023px) ============ */}
                <div className="hidden sm:block lg:hidden mb-3 xs:mb-4 -mx-2 xs:-mx-3 sm:-mx-4 px-2 xs:px-3 sm:px-4">
                  <div className="overflow-x-auto">
                    <TabsList className="inline-flex gap-1 sm:gap-1.5 bg-muted/40 p-1 sm:p-1.5 rounded-lg w-auto">
                      {tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                           className="py-1.5 sm:py-2 px-2 sm:px-3 text-2xs sm:text-xs font-medium rounded-md whitespace-nowrap transition-all duration-200 hover:bg-muted/70 active:scale-95 bg-background/90 data-[state=active]:text-white"
                           style={{
                             background: activeTab === tab.value ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" : undefined,
                             color: activeTab === tab.value ? "white" : "inherit",
                             fontWeight: activeTab === tab.value ? "600" : "500",
                             boxShadow: activeTab === tab.value ? "0 2px 8px rgba(6, 182, 212, 0.2)" : "none",
                           }}
                        >
                          {tab.shortLabel}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>

                {/* ============ DESKTOP VIEW (>= 1024px) ============ */}
                <div className="hidden lg:block mb-6">
                  <TabsList className="grid w-full grid-cols-4 gap-2 bg-muted/40 p-1.5 rounded-lg">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                         className="py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 hover:bg-muted/70 active:scale-95 bg-background/90 data-[state=active]:text-white"
                         style={{
                           background: activeTab === tab.value ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" : undefined,
                           color: activeTab === tab.value ? "white" : "inherit",
                           fontWeight: activeTab === tab.value ? "600" : "500",
                           boxShadow: activeTab === tab.value ? "0 4px 12px rgba(6, 182, 212, 0.3)" : "none",
                         }}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* ============ CONTENT AREA ============ */}
                <div className="min-h-[280px] xs:min-h-[320px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
                  {tabs.map((tab) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-50 duration-300"
                    >
                      {/* Content wrapper with proper spacing for all devices */}
                      <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 pb-4">
                        {tab.component}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Message