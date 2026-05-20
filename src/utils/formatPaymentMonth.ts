/**
 * Format payment month display with proper handling for null months
 * @param month - The month value (can be null or string)
 * @param title - The payment title (e.g., "Monthly", "ModelTest", "Others")
 * @returns Formatted month string for display
 */
export function formatPaymentMonth(month: string | null | undefined, title?: string): string {
  if (month) {
    return month
  }

  // Handle null month based on payment title
  if (title === "ModelTest") {
    return "N/A"
  }

  if (title === "Others") {
    return "N/A"
  }

  return "N/A"
}

/**
 * Get display label for payment month that's more user-friendly
 * @param payment - Payment object containing month and title
 * @returns Display-friendly month label
 */
export function getPaymentMonthDisplay(payment: { month: string | null; title?: string }): string {
  return formatPaymentMonth(payment.month, payment.title)
}
