"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { 
  DollarSign, 
  Save, 
  Info, 
  Edit3, 
  Check, 
  TrendingUp,
  Percent,
  Coins
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, NETWORKS } from "@/lib/utils"

// Mock base bundles from admin
const baseBundles = [
  { id: 1, name: "1GB Data", basePrice: 12, network: "mtn", volume: "1GB" },
  { id: 2, name: "2GB Data", basePrice: 22, network: "mtn", volume: "2GB" },
  { id: 3, name: "5GB Data", basePrice: 50, network: "mtn", volume: "5GB" },
  { id: 4, name: "10GB Data", basePrice: 95, network: "mtn", volume: "10GB" },
  { id: 5, name: "1GB Data", basePrice: 11, network: "telecel", volume: "1GB" },
  { id: 6, name: "5GB Data", basePrice: 48, network: "telecel", volume: "5GB" },
  { id: 7, name: "2GB Data", basePrice: 20, network: "at", volume: "2GB" },
  { id: 8, name: "5GB Data", basePrice: 45, network: "at", volume: "5GB" },
]

// Preset commission options
const commissionPresets = [
  { id: "low", label: "Low Margin", amount: 2, description: "Add GHS 2.00 to all bundles" },
  { id: "medium", label: "Medium Margin", amount: 5, description: "Add GHS 5.00 to all bundles" },
  { id: "high", label: "High Margin", amount: 10, description: "Add GHS 10.00 to all bundles" },
]

export default function ResellerPricingPage() {
  const { toast } = useToast()
  const [pricingMode, setPricingMode] = useState("preset") // "preset" or "custom"
  const [selectedPreset, setSelectedPreset] = useState("medium")
  const [globalCommission, setGlobalCommission] = useState(5)
  const [customCommissions, setCustomCommissions] = useState(
    baseBundles.reduce((acc, bundle) => ({ ...acc, [bundle.id]: 5 }), {})
  )
  const [isSaving, setIsSaving] = useState(false)

  const getCommissionForBundle = (bundleId) => {
    if (pricingMode === "preset") {
      const preset = commissionPresets.find(p => p.id === selectedPreset)
      return preset?.amount || 5
    }
    return customCommissions[bundleId] || 0
  }

  const handleCustomCommissionChange = (bundleId, value) => {
    setCustomCommissions(prev => ({
      ...prev,
      [bundleId]: parseFloat(value) || 0
    }))
  }

  const applyGlobalCommission = () => {
    const newCommissions = baseBundles.reduce((acc, bundle) => ({
      ...acc,
      [bundle.id]: globalCommission
    }), {})
    setCustomCommissions(newCommissions)
    toast({
      title: "Global Commission Applied",
      description: `GHS ${globalCommission.toFixed(2)} commission applied to all bundles`,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Pricing Saved",
        description: "Your bundle pricing has been updated successfully.",
      })
    }, 1000)
  }

  const totalPotentialProfit = baseBundles.reduce((sum, bundle) => {
    return sum + getCommissionForBundle(bundle.id)
  }, 0)

  const avgCommission = totalPotentialProfit / baseBundles.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bundle Pricing</h1>
        <p className="text-slate-500 mt-1">Set your commission on each bundle to determine your selling prices</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Bundles</CardTitle>
            <Coins className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseBundles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for resale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Avg. Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(avgCommission)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per bundle sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pricing Mode</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{pricingMode}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pricingMode === "preset" ? "Using preset margins" : "Custom per bundle"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Pricing Mode Selection */}
        <div className="space-y-6">
          {/* Pricing Mode Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Mode
              </CardTitle>
              <CardDescription>Choose how you want to set your prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Custom Pricing</Label>
                  <p className="text-xs text-slate-500">Set individual commission per bundle</p>
                </div>
                <Switch 
                  checked={pricingMode === "custom"} 
                  onCheckedChange={(checked) => setPricingMode(checked ? "custom" : "preset")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preset Options */}
          {pricingMode === "preset" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Presets</CardTitle>
                <CardDescription>Select a commission level for all bundles</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPreset} onValueChange={setSelectedPreset} className="space-y-3">
                  {commissionPresets.map((preset) => (
                    <div 
                      key={preset.id}
                      className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPreset === preset.id 
                          ? "border-cyan-500 bg-cyan-50" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedPreset(preset.id)}
                    >
                      <RadioGroupItem value={preset.id} id={preset.id} className="sr-only" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={preset.id} className="font-medium cursor-pointer">
                            {preset.label}
                          </Label>
                          {selectedPreset === preset.id && (
                            <Check className="h-4 w-4 text-cyan-500" />
                          )}
                        </div>
                        <p className="text-xl font-bold text-green-600 mt-1">
                          +{formatCurrency(preset.amount)}
                        </p>
                        <p className="text-xs text-slate-500">{preset.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Global Commission for Custom Mode */}
          {pricingMode === "custom" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Apply Global Commission
                </CardTitle>
                <CardDescription>Set the same commission for all bundles at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Commission Amount (GHS)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.50"
                      min="0"
                      value={globalCommission}
                      onChange={(e) => setGlobalCommission(parseFloat(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <Button onClick={applyGlobalCommission} variant="outline">
                      Apply All
                    </Button>
                  </div>
                </div>
                
                {/* Quick amount buttons */}
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 5, 7, 10].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setGlobalCommission(amount)}
                      className={globalCommission === amount ? "border-cyan-500 bg-cyan-50" : ""}
                    >
                      +GHS {amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">How it works</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your selling price = Base price + Your commission. 
                    The commission you set is your profit per sale.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Bundle Pricing Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Bundle Prices</CardTitle>
                  <CardDescription>
                    {pricingMode === "preset" 
                      ? "Prices calculated using selected preset" 
                      : "Set custom commission for each bundle"}
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Prices"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bundle</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead className="whitespace-nowrap">Base Price</TableHead>
                      <TableHead className="whitespace-nowrap">Your Commission</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Selling Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {baseBundles.map((bundle) => {
                      const commission = getCommissionForBundle(bundle.id)
                      const sellingPrice = bundle.basePrice + commission
                      const net = NETWORKS?.find((n) => n.id === bundle.network)
                      
                      return (
                        <TableRow key={bundle.id}>
                          <TableCell className="whitespace-nowrap">
                            <div>
                              <p className="font-medium">{bundle.name}</p>
                              <p className="text-xs text-slate-500">{bundle.volume}</p>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {net?.logo && (
                                <img
                                  src={net.logo}
                                  alt={net.name}
                                  className="h-5 w-5 rounded-full border border-slate-200 bg-white object-contain"
                                />
                              )}
                              <Badge variant="outline" className="text-xs">
                                {net?.name ?? bundle.network.toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 whitespace-nowrap">
                            {formatCurrency(bundle.basePrice)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {pricingMode === "custom" ? (
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">+</span>
                                <Input
                                  type="number"
                                  step="0.50"
                                  min="0"
                                  value={customCommissions[bundle.id] || ""}
                                  onChange={(e) => handleCustomCommissionChange(bundle.id, e.target.value)}
                                  className="w-20 h-8 text-sm"
                                />
                              </div>
                            ) : (
                              <span className="text-green-600 font-medium">
                                +{formatCurrency(commission)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <span className="font-bold text-slate-900">
                              {formatCurrency(sellingPrice)}
                            </span>
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
      </div>
    </div>
  )
}
