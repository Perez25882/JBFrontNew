"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, AlertCircle, Wallet, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Validation schema
const payoutSchema = z.object({
  network: z.string().min(1, "Please select a network"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9\s]+$/, "Phone number must contain only digits"),
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

export function PayoutPopup({ availableBalance = 0, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(payoutSchema),
    mode: "onChange",
    defaultValues: {
      network: "",
      phoneNumber: "",
      amount: "",
      password: "",
    },
  })

  const watchAmount = watch("amount")
  const payoutCharge = watchAmount && parseFloat(watchAmount) > 0 ? Math.max(1, parseFloat(watchAmount) * 0.01) : 0
  const netAmount = watchAmount && parseFloat(watchAmount) > 0 ? Math.max(0, parseFloat(watchAmount) - payoutCharge) : 0

  const onSubmit = async (data) => {
    if (parseFloat(data.amount) > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this payout.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      
      toast({
        title: "Payout Requested",
        description: `GHS ${netAmount.toFixed(2)} will be sent to your ${data.network} number.`,
      })

      if (onSuccess) {
        onSuccess(data)
      }

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false)
        setOpen(false)
        reset()
        setSelectedNetwork("")
      }, 2000)
    }, 2000)
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
      setSelectedNetwork("")
      setIsSuccess(false)
    }
  }

  const handleNetworkChange = (value) => {
    setSelectedNetwork(value)
    setValue("network", value, { shouldValidate: true })
  }

  // Success State
  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            <Wallet className="mr-2 h-4 w-4" />
            Request Payout
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Payout Requested!</h3>
            <p className="text-slate-500 text-center">
              Your payout request has been submitted successfully.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <Wallet className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">Request Payout</DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Available balance: <span className="font-semibold text-green-600">GHS {availableBalance.toFixed(2)}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          {/* Network Selection */}
          <div className="space-y-2">
            <Label htmlFor="network" className="text-sm font-medium">
              Network <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
              <SelectTrigger className={`w-full h-11 ${errors.network ? "border-red-500 focus:ring-red-500" : ""}`}>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
                <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
              </SelectContent>
            </Select>
            {errors.network && (
              <p className="text-xs text-red-500 mt-1">{errors.network.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g. 024 123 4567"
              {...register("phoneNumber")}
              className={`h-11 ${errors.phoneNumber ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (GHS) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="10"
              placeholder="Enter amount"
              {...register("amount")}
              className={`h-11 ${errors.amount ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Payout Charge Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Payout Charge Notice</p>
                <p className="text-xs text-amber-700 mt-1">
                  A 1% charge will be deducted from the requested amount.
                </p>
                {watchAmount && parseFloat(watchAmount) > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200 space-y-1">
                    <div className="flex justify-between text-xs text-amber-700">
                      <span>Payout Charge (1%):</span>
                      <span>- GHS {payoutCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-amber-900">
                      <span>You will receive:</span>
                      <span>GHS {netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`h-11 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-slate-500">
              Enter your account password to confirm this request
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-cyan-500 hover:bg-cyan-600"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Request Payout"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
