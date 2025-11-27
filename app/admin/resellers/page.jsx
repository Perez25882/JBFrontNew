"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, MoreHorizontal, Plus, Search, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BulkTimestampSelector } from "@/components/admin/bulk-timestamp-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Mock Data
const initialResellers = [
  { id: "RES-001", name: "John Doe", email: "john@example.com", status: "active", sales: 1500, joined: "2024-01-15" },
  { id: "RES-002", name: "Jane Smith", email: "jane@example.com", status: "pending", sales: 0, joined: "2024-02-20" },
  {
    id: "RES-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "active",
    sales: 3200,
    joined: "2023-12-10",
  },
  {
    id: "RES-004",
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "suspended",
    sales: 450,
    joined: "2024-01-05",
  },
]

export default function ResellersPage() {
  const [resellers, setResellers] = useState(initialResellers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const { toast } = useToast()

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedResellers, setSelectedResellers] = useState([])

  const updateStatus = (id, newStatus) => {
    setResellers(resellers.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const handleInvite = () => {
    toast({
      title: "Invitation Sent",
      description: `An invite has been sent to ${inviteEmail}`,
    })
    setInviteEmail("")
    setIsInviteOpen(false)
  }

  // Filter and sort resellers
  const filteredResellers = useMemo(() => {
    let result = [...resellers]

    // Search filter
    if (searchQuery) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(r => r.status === statusFilter)
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "sales":
          comparison = a.sales - b.sales
          break
        case "joined":
          comparison = new Date(a.joined) - new Date(b.joined)
          break
        default:
          comparison = 0
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [resellers, searchQuery, statusFilter, sortBy, sortOrder])

  const toggleSelectReseller = (resellerId) => {
    setSelectedResellers(prev => 
      prev.includes(resellerId) 
        ? prev.filter(id => id !== resellerId)
        : [...prev, resellerId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedResellers.length === filteredResellers.length) {
      setSelectedResellers([])
    } else {
      setSelectedResellers(filteredResellers.map(r => r.id))
    }
  }

  const handleBulkAction = (action) => {
    if (action === "approve") {
      setResellers(resellers.map(r => 
        selectedResellers.includes(r.id) && r.status === "pending" 
          ? { ...r, status: "active" } 
          : r
      ))
      toast({
        title: "Resellers Approved",
        description: `${selectedResellers.length} reseller(s) have been approved.`,
      })
      setSelectedResellers([])
    } else if (action === "reject") {
      setResellers(resellers.map(r => 
        selectedResellers.includes(r.id) && r.status === "pending" 
          ? { ...r, status: "suspended" } 
          : r
      ))
      toast({
        title: "Resellers Rejected",
        description: `${selectedResellers.length} reseller(s) have been rejected.`,
      })
      setSelectedResellers([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reseller Management</h2>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-white/95 shadow-2xl border border-slate-200">
            <DialogHeader>
              <DialogTitle>Invite New Reseller</DialogTitle>
              <DialogDescription>Send an invitation email to add a new reseller to your platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="reseller@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                className="min-w-[90px] justify-center"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                className="min-w-[130px] justify-center"
              >
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Resellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {resellers.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 5,150</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection */}
      <BulkTimestampSelector
        onBulkAction={handleBulkAction}
        selectedCount={selectedResellers.length}
        totalCount={filteredResellers.length}
        actions={["approve", "reject"]}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>All Resellers</CardTitle>
              <CardDescription>Manage reseller accounts and approvals.</CardDescription>
            </div>
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

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="joined">Joined Date</SelectItem>
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
                      checked={selectedResellers.length === filteredResellers.length && filteredResellers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Total Sales</TableHead>
                  <TableHead className="whitespace-nowrap">Joined Date</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResellers.map((reseller) => (
                  <TableRow key={reseller.id} className={selectedResellers.includes(reseller.id) ? "bg-slate-50" : ""}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedResellers.includes(reseller.id)}
                        onChange={() => toggleSelectReseller(reseller.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{reseller.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{reseller.email}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant={
                          reseller.status === "active"
                            ? "default"
                            : reseller.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          reseller.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : reseller.status === "pending"
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : ""
                        }
                      >
                        {reseller.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">GHS {reseller.sales}</TableCell>
                    <TableCell className="whitespace-nowrap">{reseller.joined}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {reseller.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:bg-green-50"
                              title="Approve"
                              onClick={() => updateStatus(reseller.id, "active")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              title="Reject"
                              onClick={() => updateStatus(reseller.id, "suspended")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
