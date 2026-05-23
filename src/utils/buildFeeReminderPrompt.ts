export interface FeeReminderPromptFields {
  studentName?: string;
  dueDate?: string;
  amount?: string;
  className?: string;
  tone?: string;
}

export const buildFeeReminderPrompt = ({
  studentName,
  dueDate,
  amount,
  className,
  tone,
}: FeeReminderPromptFields) => {
  const lines = [
    "Write a fee reminder message for a school student.",
    studentName ? `Student name: ${studentName}.` : "Student name: not provided.",
    className ? `Class: ${className}.` : "Class: not provided.",
    dueDate ? `Due date: ${dueDate}.` : "Due date: not provided.",
    amount ? `Due amount: ${amount}.` : "Due amount: not provided.",
    tone ? `Tone: ${tone}.` : "Tone: polite and professional.",
    "Keep it short, clear, and suitable for SMS. Do not add extra explanation.",
  ];

  return lines.join("\n");
};