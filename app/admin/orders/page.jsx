"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, CheckCircle, XCircle, Eye, Download, TrendingUp, TrendingDown, ArrowUpDown, Filter } from "lucide-react"
import { BulkTimestampSelector } from "@/components/admin/bulk-timestamp-selector"
import { FulfillmentBadge } from "@/components/ui/fulfillment-status"

// Mock Data with cost and selling prices
const initialOrders = [
  {
    id: "ORD-001",
    customer: "024 555 0101",
    bundle: "5GB MTN",
    network: "MTN",
    costPrice: 50.00,
    sellingPrice: 60.00,
    status: "processing",
    date: "2024-10-22T10:30:00Z",
    dateDisplay: "2 mins ago",
  },
  {
    id: "ORD-002",
    customer: "050 123 4567",
    bundle: "10GB Telecel",
    network: "Telecel",
    costPrice: 85.00,
    sellingPrice: 100.00,
    status: "delivered",
    date: "2024-10-22T10:25:00Z",
    dateDisplay: "5 mins ago",
  },
  {
    id: "ORD-003",
    customer: "024 987 6543",
    bundle: "1GB MTN",
    network: "MTN",
    costPrice: 12.00,
    sellingPrice: 15.00,
    status: "failed",
    date: "2024-10-22T10:20:00Z",
    dateDisplay: "10 mins ago",
  },
  {
    id: "ORD-004",
    customer: "027 111 2222",
    bundle: "2GB AT",
    network: "AT",
    costPrice: 20.00,
    sellingPrice: 25.00,
    status: "delivered",
    date: "2024-10-22T10:15:00Z",
    dateDisplay: "15 mins ago",
  },
  {
    id: "ORD-005",
    customer: "055 555 5555",
    bundle: "5GB MTN",
    network: "MTN",
    costPrice: 50.00,
    sellingPrice: 60.00,
    status: "accepted",
    date: "2024-10-22T10:10:00Z",
    dateDisplay: "20 mins ago",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [networkFilter, setNetworkFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedOrders, setSelectedOrders] = useState([])
  const [dateRange, setDateRange] = useState(null)

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
  }

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Search filter
    if (searchQuery) {
      result = result.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.includes(searchQuery) ||
        o.bundle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Network filter
    if (networkFilter !== "all") {
      result = result.filter(o => o.network === networkFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(o => o.status === statusFilter)
    }

    // Date range filter
    if (dateRange) {
      result = result.filter(o => {
        const orderDate = new Date(o.date)
        return orderDate >= dateRange.start && orderDate <= dateRange.end
      })
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "amount":
          comparison = a.sellingPrice - b.sellingPrice
          break
        case "profit":
          comparison = (a.sellingPrice - a.costPrice) - (b.sellingPrice - b.costPrice)
          break
        default:
          comparison = 0
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [orders, searchQuery, networkFilter, statusFilter, sortBy, sortOrder, dateRange])

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const completedOrders = filteredOrders.filter(o => o.status === "delivered" || o.status === "completed")
    const totalCost = completedOrders.reduce((sum, o) => sum + o.costPrice, 0)
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.sellingPrice, 0)
    const totalProfit = totalRevenue - totalCost
    
    return { totalCost, totalRevenue, totalProfit, orderCount: completedOrders.length }
  }, [filteredOrders])

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Bundle", "Network", "Cost Price", "Selling Price", "Profit", "Status", "Date"]
    const dataToExport = selectedOrders.length > 0 
      ? filteredOrders.filter(o => selectedOrders.includes(o.id))
      : filteredOrders
    
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((o) => [
        o.id, 
        o.customer, 
        o.bundle, 
        o.network,
        o.costPrice.toFixed(2),
        o.sellingPrice.toFixed(2),
        (o.sellingPrice - o.costPrice).toFixed(2),
        o.status, 
        o.dateDisplay
      ].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "orders-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleBulkAction = (action) => {
    if (action === "export") {
      exportCSV()
    }
    // Add more bulk actions as needed
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Order Fulfillment</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Orders</p>
            <p className="text-2xl font-bold">{filteredOrders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Cost</p>
            <p className="text-2xl font-bold">GHS {summaryStats.totalCost.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold">GHS {summaryStats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total Profit</p>
            <p className={`text-2xl font-bold flex items-center gap-1 ${summaryStats.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {summaryStats.totalProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              GHS {summaryStats.totalProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection */}
      <BulkTimestampSelector
        onSelect={setDateRange}
        onBulkAction={handleBulkAction}
        selectedCount={selectedOrders.length}
        totalCount={filteredOrders.length}
        actions={["export"]}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Network Filter */}
              <Select value={networkFilter} onValueChange={setNetworkFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  <SelectItem value="MTN">MTN</SelectItem>
                  <SelectItem value="Telecel">Telecel</SelectItem>
                  <SelectItem value="AT">AT</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Order ID</TableHead>
                  <TableHead className="whitespace-nowrap">Customer</TableHead>
                  <TableHead className="whitespace-nowrap">Bundle</TableHead>
                  <TableHead className="whitespace-nowrap">Network</TableHead>
                  <TableHead className="whitespace-nowrap">Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Profit</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Time</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const profit = order.sellingPrice - order.costPrice
                  return (
                    <TableRow key={order.id} className={selectedOrders.includes(order.id) ? "bg-slate-50" : ""}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{order.id}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                      <TableCell className="whitespace-nowrap">{order.bundle}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">{order.network}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">GHS {order.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className={`flex items-center gap-1 font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {profit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          GHS {profit.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <FulfillmentBadge status={order.status} size="sm" />
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{order.dateDisplay}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          {(order.status === "accepted" || order.status === "processing") && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                title="Mark Delivered"
                                onClick={() => handleStatusChange(order.id, "delivered")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Mark Failed"
                                onClick={() => handleStatusChange(order.id, "failed")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
