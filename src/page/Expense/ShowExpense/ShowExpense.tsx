import Loading from "@/components/Loading"
import { useGetAllExpenseQuery } from "@/redux/api/expense/expenseApi"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, DollarSign, TrendingDown } from "lucide-react"

export const ShowExpense = () => {
  const { data, isLoading: loadCosting } = useGetAllExpenseQuery(undefined)
  const costing = data?.data || []

  const formattedData = costing.map((item: any) => ({
    ...item,
    formattedMonth: new Date(item.month + "-01").toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
    totalRevenue: Number(item.totalRevenue),
    totalCost: Number(item.totalCost),
    profit: Number(item.profit),
  }))

  const totalRevenue = formattedData.reduce((sum: number, item: { totalRevenue: number }) => sum + item.totalRevenue, 0)
  const totalCosts = formattedData.reduce((sum: number, item: { totalCost: number }) => sum + item.totalCost, 0)
  const totalProfit = formattedData.reduce((sum: number, item: { profit: number }) => sum + item.profit, 0)
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0"

  const chartConfig = {
    totalRevenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    totalCost: {
      label: "Costs",
      color: "hsl(var(--chart-2))",
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-3))",
    },
  }

  if (loadCosting) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loading />
      </div>
    )
  }

  if (formattedData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No expense data available to display.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Financial Overview</h1>
        <p className="text-muted-foreground text-pretty">
          Monthly revenue, costs, and profit analysis for your business performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} BDT</div>
            <p className="text-xs text-muted-foreground">Across all periods</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCosts.toLocaleString()} BDT</div>
            <p className="text-xs text-muted-foreground">Operating expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
            <p className="text-xs text-muted-foreground">Net profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Financial Performance</CardTitle>
          <CardDescription>Revenue, costs, and profit trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="formattedMonth"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()}BDT`}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />
                <Bar dataKey="totalRevenue" fill="var(--color-totalRevenue)" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalCost" fill="var(--color-totalCost)" name="Costs" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="var(--color-profit)" name="Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
