import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Copy, Loader2, Sparkles, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { buildFeeReminderPrompt } from "@/utils/buildFeeReminderPrompt";
import {
  clearFeeReminderState,
  generateFeeReminderMessage,
  selectFeeReminderState,
} from "@/redux/features/feeReminderSlice/feeReminderSlice";
import toast from "react-hot-toast";

const initialFields = {
  studentName: "",
  dueDate: "",
  amount: "",
  className: "",
  tone: "polite and professional",
};

const FeeReminderDraft = () => {
  const dispatch = useAppDispatch();
  const { loading, error, generatedText } = useAppSelector(selectFeeReminderState);
  const [fields, setFields] = useState(initialFields);
  const [prompt, setPrompt] = useState(
    buildFeeReminderPrompt(initialFields),
  );

  const canGenerate = useMemo(() => prompt.trim().length > 0, [prompt]);

  const handleFieldChange = (
    key: keyof typeof initialFields,
    value: string,
  ) => {
    const nextFields = {
      ...fields,
      [key]: value,
    };

    setFields(nextFields);
    setPrompt(buildFeeReminderPrompt(nextFields));
  };

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canGenerate) {
      return;
    }

    await dispatch(generateFeeReminderMessage(prompt));
  };

  const handleCopy = async () => {
    if (!generatedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedText);
      toast.success("Generated message copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleReset = () => {
    setFields(initialFields);
    setPrompt(buildFeeReminderPrompt(initialFields));
    dispatch(clearFeeReminderState());
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base sm:text-lg">Fee reminder draft</CardTitle>
          <CardDescription>
            Build a structured prompt, send it to Gemini, and review the drafted reminder before using it anywhere else.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleGenerate}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Student name</label>
                <Input
                  value={fields.studentName}
                  onChange={(event) => handleFieldChange("studentName", event.target.value)}
                  placeholder="Ayesha Khan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Class</label>
                <Input
                  value={fields.className}
                  onChange={(event) => handleFieldChange("className", event.target.value)}
                  placeholder="Class 8"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Due date</label>
                <Input
                  value={fields.dueDate}
                  onChange={(event) => handleFieldChange("dueDate", event.target.value)}
                  placeholder="25 May 2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount</label>
                <Input
                  value={fields.amount}
                  onChange={(event) => handleFieldChange("amount", event.target.value)}
                  placeholder="BDT 2,500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tone</label>
              <Input
                value={fields.tone}
                onChange={(event) => handleFieldChange("tone", event.target.value)}
                placeholder="polite and professional"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Prompt</label>
              <Textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Write a fee reminder message..."
                className="min-h-[180px] resize-y"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading || !canGenerate} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating..." : "Generate message"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base sm:text-lg">Generated text</CardTitle>
          <CardDescription>
            The backend response is shown here. This feature stops at drafting only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="rounded-xl border bg-muted/30 p-4">
            {generatedText ? (
              <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{generatedText}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your drafted reminder will appear here after generation.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={handleCopy} disabled={!generatedText} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy text
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeReminderDraft;