"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Search, Package, CheckCircle, Clock, XCircle, Home, Phone, Calendar, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

// Fulfillment Status Component
function FulfillmentStatus({ status }) {
  const statuses = [
    { key: "accepted", label: "Accepted", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Loader2 },
    { key: "delivered", label: "Delivered", icon: Package },
  ]

  const getStatusIndex = () => {
    if (status === "delivered" || status === "completed") return 2
    if (status === "processing" || status === "pending") return 1
    if (status === "accepted") return 0
    return -1
  }

  const currentIndex = getStatusIndex()

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 mx-8" />
        <div 
          className="absolute top-5 left-0 h-1 bg-cyan-500 mx-8 transition-all duration-500"
          style={{ width: `${Math.max(0, (currentIndex / 2) * 100)}%` }}
        />
        
        {statuses.map((s, index) => {
          const Icon = s.icon
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={s.key} className="flex flex-col items-center z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? isCurrent 
                      ? "bg-cyan-500 text-white ring-4 ring-cyan-100" 
                      : "bg-cyan-500 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${isCurrent && s.key === "processing" ? "animate-spin" : ""}`} />
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? "text-cyan-600" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  const [searchValue, setSearchValue] = useState("")
  const [searchType, setSearchType] = useState("order") // "order" or "phone"
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [error, setError] = useState("")

  // Mock data with fulfillment statuses
  const mockOrders = [
    {
      id: "ORD-001",
      status: "delivered",
      statusHistory: [
        { status: "accepted", timestamp: "Oct 22, 2024 - 10:30 AM" },
        { status: "processing", timestamp: "Oct 22, 2024 - 10:35 AM" },
        { status: "delivered", timestamp: "Oct 22, 2024 - 12:45 PM" },
      ],
      date: "Oct 22, 2024 - 10:30 AM",
      bundle: "5GB MTN Data Bundle",
      phone: "0245550101",
      amount: 60.0,
      network: "MTN",
    },
    {
      id: "ORD-002",
      status: "processing",
      statusHistory: [
        { status: "accepted", timestamp: "Oct 22, 2024 - 10:45 AM" },
        { status: "processing", timestamp: "Oct 22, 2024 - 10:50 AM" },
      ],
      date: "Oct 22, 2024 - 10:45 AM",
      bundle: "10GB Telecel Data Bundle",
      phone: "0501234567",
      amount: 100.0,
      network: "Telecel",
    },
    {
      id: "ORD-003",
      status: "accepted",
      statusHistory: [
        { status: "accepted", timestamp: "Oct 22, 2024 - 11:00 AM" },
      ],
      date: "Oct 22, 2024 - 11:00 AM",
      bundle: "2GB AT Data Bundle",
      phone: "0271112222",
      amount: 25.0,
      network: "AT",
    },
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    setIsSearching(true)
    setError("")
    setSearchResult(null)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)

      const normalizedSearch = searchValue.replace(/\s/g, "").toUpperCase()
      
      let result = null
      if (searchType === "order") {
        result = mockOrders.find(o => o.id.toUpperCase() === normalizedSearch)
      } else {
        // Search by phone number
        const phoneSearch = searchValue.replace(/\s/g, "")
        result = mockOrders.find(o => o.phone.includes(phoneSearch))
      }

      if (result) {
        setSearchResult(result)
      } else {
        setError(searchType === "order" 
          ? "Order not found. Please check your Order ID and try again."
          : "No orders found for this phone number. Please check and try again."
        )
      }
    }, 1500)
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

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Track Your Order</h1>
          <p className="text-lg text-slate-600">
            Enter your Order ID or Phone Number to check the current status of your data bundle delivery.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Order Lookup</CardTitle>
            <CardDescription>Search by Order ID or Phone Number</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Type Toggle */}
              <div className="flex rounded-lg border p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setSearchType("order")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    searchType === "order"
                      ? "bg-white shadow text-cyan-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Search className="h-4 w-4 inline mr-2" />
                  Order ID
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType("phone")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    searchType === "phone"
                      ? "bg-white shadow text-cyan-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </button>
              </div>

              <div className="flex space-x-2">
                <div className="relative flex-1">
                  {searchType === "order" ? (
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  ) : (
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  )}
                  <Input
                    placeholder={searchType === "order" ? "e.g. ORD-001" : "e.g. 024 555 0101"}
                    className="pl-9"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching || !searchValue}>
                  {isSearching ? "Searching..." : "Track"}
                </Button>
              </div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {searchResult && (
          <Card className="w-full max-w-md mt-8 shadow-lg border-t-4 border-t-cyan-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-4 border-b bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Order Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {(searchResult.status === "delivered" || searchResult.status === "completed") && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-base px-3 py-1">
                        <CheckCircle className="mr-1.5 h-4 w-4" /> Delivered
                      </Badge>
                    )}
                    {(searchResult.status === "processing" || searchResult.status === "pending") && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-base px-3 py-1">
                        <Clock className="mr-1.5 h-4 w-4" /> Processing
                      </Badge>
                    )}
                    {searchResult.status === "accepted" && (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-base px-3 py-1">
                        <CheckCircle className="mr-1.5 h-4 w-4" /> Accepted
                      </Badge>
                    )}
                    {searchResult.status === "failed" && (
                      <Badge variant="destructive" className="text-base px-3 py-1">
                        <XCircle className="mr-1.5 h-4 w-4" /> Failed
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Order ID</p>
                  <p className="font-mono font-bold text-lg">{searchResult.id}</p>
                </div>
              </div>
            </CardHeader>
            
            {/* Fulfillment Status Timeline */}
            <div className="px-6 py-4 border-b">
              <FulfillmentStatus status={searchResult.status} />
            </div>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-0.5">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Bundle Details</p>
                    <p className="font-semibold text-slate-900">{searchResult.bundle}</p>
                    <p className="text-sm text-slate-600">{formatCurrency(searchResult.amount)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Recipient Number</p>
                    <p className="font-semibold text-slate-900">{searchResult.phone}</p>
                    <p className="text-xs text-slate-500 uppercase">{searchResult.network}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-full text-slate-600 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Date & Time</p>
                    <p className="text-sm text-slate-900">{searchResult.date}</p>
                  </div>
                </div>
              </div>

              {searchResult.status === "pending" && (
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
                  <p className="font-medium mb-1">Your order is being processed.</p>
                  <p>This usually takes 1-5 minutes. You will receive an SMS once the bundle is delivered.</p>
                </div>
              )}

              {searchResult.status === "failed" && (
                <div className="bg-red-50 p-4 rounded-lg text-sm text-red-700 border border-red-100">
                  <p className="font-medium mb-1">Delivery failed.</p>
                  <p>
                    Please check if the recipient number is correct. If money was deducted, it will be refunded to your
                    wallet automatically.
                  </p>
                  <Link href="/support" className="font-medium underline mt-2 inline-block">
                    Contact Support
                  </Link>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t p-4">
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setSearchResult(null)}>
                Check Another Order
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 Joy Data Bundles. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
