
import { FormFieldWrapper } from "@/components/common/FormFieldWrapper"
import { SelectFieldWrapper } from "@/components/common/SelectFieldWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useAddExpenseMutation } from "@/redux/api/expense/expenseApi"
import generateMonthOptions from "@/utils/generateMonthOptions"
import { ChevronRight, DollarSign, Receipt } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const monthOptions = generateMonthOptions()

export const CreateExpense = () => {
  const navigate = useNavigate()
  const [adExpense] = useAddExpenseMutation()
  const form = useForm({
    defaultValues: {
      month: "", // Make sure it's empty or a valid 2025-XX
      instructorSalary: "",
      materialCost: "",
      rentAndUtilities: "",
      marketingCost: "",
      otherExpenses: "",
    },
  })

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      instructorSalary: Number.parseFloat(data.instructorSalary),
      materialCost: Number.parseFloat(data.materialCost),
      rentAndUtilities: Number.parseFloat(data.rentAndUtilities),
      marketingCost: Number.parseFloat(data.marketingCost),
      otherExpenses: Number.parseFloat(data.otherExpenses),
    }
    const res: any = await adExpense(payload).unwrap()
    if (res?.statusCode === 200) {
      toast.success(res?.message || "Expense added successfully!")
      navigate("/show-expense")
    } else {
      toast.error(res?.message || "something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Expense Overview</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Create Expense</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Expense</h1>
              <p className="text-muted-foreground">Add and track your monthly business expenses</p>
            </div>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">Expense Details</CardTitle>
            </div>
            <CardDescription>Enter the expense amounts for each category. All fields are required.</CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormFieldWrapper
                      name="instructorSalary"
                      label="Instructor Salary"
                      placeholder="0.00"
                      type="number"
                    />
                    <FormFieldWrapper name="materialCost" label="Material Cost" placeholder="0.00" type="number" />
                    <FormFieldWrapper
                      name="rentAndUtilities"
                      label="Rent & Utilities"
                      placeholder="0.00"
                      type="number"
                    />
                    <FormFieldWrapper name="marketingCost" label="Marketing Cost" placeholder="0.00" type="number" />
                    <FormFieldWrapper name="otherExpenses" label="Other Expenses" placeholder="0.00" type="number" />
                    <SelectFieldWrapper name="month" label="Month" options={monthOptions} control={form.control} />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="min-w-[200px] bg-primary hover:bg-primary/90 text-white font-semibold"
                  >
                    Create Expense Record
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
