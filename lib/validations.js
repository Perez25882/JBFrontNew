import * as z from "zod"

// Phone number validation (Ghana format)
export const phoneNumberSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number is too long")
  .regex(/^[0-9]+$/, "Phone number must contain only digits")

// Payout validation schema
export const payoutSchema = z.object({
  network: z.enum(["MTN", "AirtelTigo", "Vodafone"], {
    required_error: "Please select a network",
  }),
  phoneNumber: phoneNumberSchema,
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    })
    .refine((val) => parseFloat(val) >= 10, {
      message: "Minimum payout amount is GHS 10",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Ticket submission schema
export const ticketSchema = z.object({
  phoneNumber: phoneNumberSchema,
  orderId: z.string().min(1, "Please select an order"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
})

// Price selector schema
export const priceSchema = z.object({
  priceOption: z.enum(["suggested1", "suggested2", "custom"]),
  customPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        return !isNaN(parseFloat(val)) && parseFloat(val) > 0
      },
      { message: "Price must be a positive number" }
    ),
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Register schema
export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: phoneNumberSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Order tracking schema
export const trackOrderSchema = z.object({
  searchType: z.enum(["order", "phone"]),
  searchValue: z.string().min(1, "Please enter a search value"),
})

// Admin message reply schema
export const messageReplySchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message is too long"),
})

// Bulk action schema
export const bulkActionSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  action: z.enum(["export", "delete", "approve", "reject"]),
  selectedIds: z.array(z.string()).min(1, "Please select at least one item"),
})

// Payment information schema
export const paymentInfoSchema = z.object({
  paymentMethod: z.enum(["momo", "bank"]),
  momoNumber: phoneNumberSchema.optional(),
  momoName: z.string().min(2, "Account name is required").optional(),
  network: z.enum(["mtn", "telecel", "at"]).optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
})

// Export all schemas
export const schemas = {
  phoneNumber: phoneNumberSchema,
  payout: payoutSchema,
  ticket: ticketSchema,
  price: priceSchema,
  login: loginSchema,
  register: registerSchema,
  trackOrder: trackOrderSchema,
  messageReply: messageReplySchema,
  bulkAction: bulkActionSchema,
  paymentInfo: paymentInfoSchema,
}
