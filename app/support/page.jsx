"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, MessageSquare, AlertCircle, CheckCircle, ArrowRight, Phone as PhoneIcon, Loader2, Clock, Package } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SupportPage() {
  const [step, setStep] = useState(1) // 1: phone input, 2: select order, 3: message, 4: confirmation
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [orderHistory, setOrderHistory] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { toast } = useToast()

  // Mock order data
  const mockOrders = [
    { id: "ORD-001", date: "Oct 22, 2024", bundle: "5GB MTN Data Bundle", status: "delivered", amount: 60.0 },
    { id: "ORD-002", date: "Oct 23, 2024", bundle: "10GB Telecel Data Bundle", status: "processing", amount: 100.0 },
    { id: "ORD-003", date: "Oct 24, 2024", bundle: "2GB AT Data Bundle", status: "accepted", amount: 25.0 },
  ]

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    // Simulate API call to fetch orders
    setTimeout(() => {
      setOrderHistory(mockOrders)
      setStep(2)
      setIsLoading(false)
    }, 1500)
  }

  const handleOrderSelect = (order) => {
    setSelectedOrder(order)
    setStep(3)
  }

  const handleTicketSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please describe your issue",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    // Simulate API call to submit ticket
    setTimeout(() => {
      const newTicketNumber = `TKT-${Math.floor(10000 + Math.random() * 90000)}`
      setTicketNumber(newTicketNumber)
      setStep(4)
      setIsLoading(false)
    }, 2000)
  }

  const resetForm = () => {
    setStep(1)
    setPhoneNumber("")
    setMessage("")
    setOrderHistory([])
    setSelectedOrder(null)
    setTicketNumber("")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>
      case "accepted":
        return <Badge className="bg-blue-500">Accepted</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-md" />
            <span className="font-bold text-xl text-slate-900 hidden sm:inline-block">Joy Data Bundles</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Back Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="bg-cyan-50 border border-cyan-100 rounded-full p-3 inline-flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-3">Contact Support</h1>
            <p className="text-lg text-slate-600">
              Have an issue with your order? We're here to help.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step > s ? "bg-cyan-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Phone Number Input */}
          {step === 1 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Find Your Orders</CardTitle>
                <CardDescription>Enter your phone number to view your recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">+233</span>
                      </div>
                      <Input
                        type="tel"
                        id="phone"
                        placeholder="24 123 4567"
                        className="pl-14"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Enter the phone number used for your order
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-cyan-500 hover:bg-cyan-600" 
                    disabled={isLoading || !phoneNumber.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Find My Orders
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Order */}
          {step === 2 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Select an Order</CardTitle>
                <CardDescription>Choose the order you need help with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className="p-4 border rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{order.bundle}</p>
                          <p className="text-sm text-slate-500">Order #{order.id} • {order.date}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-sm font-medium text-slate-900 mt-1">GHS {order.amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No orders found for this phone number</p>
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-4" onClick={() => setStep(1)}>
                  Back
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Enter Message */}
          {step === 3 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Describe Your Issue</CardTitle>
                <CardDescription>
                  Order: {selectedOrder?.bundle} ({selectedOrder?.id})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                      How can we help you?
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Please provide as much detail as possible
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setStep(2)}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                      disabled={isLoading || !message.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Ticket"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card className="shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="bg-green-50 border border-green-200 rounded-full p-4 inline-flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Ticket Submitted!</h2>
                <p className="text-slate-600 mb-6">
                  We've received your support request and will get back to you soon.
                </p>
                
                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-500 mb-1">Ticket Number</p>
                  <p className="text-2xl font-mono font-bold text-cyan-600">{ticketNumber}</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Our support team will review your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>You'll receive a response within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Check your phone for SMS updates</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                    onClick={resetForm}
                  >
                    Submit Another Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Need immediate help?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Call Us</p>
                  <p className="text-sm text-slate-500">+233 24 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Response Time</p>
                  <p className="text-sm text-slate-500">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
