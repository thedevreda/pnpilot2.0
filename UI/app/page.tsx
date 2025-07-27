"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Download,
  Mail,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Database,
  Search,
  FileText,
  Settings,
  Zap,
} from "lucide-react"
import { SettingsModal } from "./components/settings-modal"
import { ContactModal } from "./components/contact-modal"

const platforms = [
  { id: "partbase", name: "Partbase", status: "active", color: "bg-green-500" },
  { id: "ils", name: "ILS", status: "active", color: "bg-blue-500" },
  { id: "locatory", name: "Locatory", status: "active", color: "bg-purple-500" },
  { id: "avitrader", name: "AviTrader", status: "maintenance", color: "bg-orange-500" },
  { id: "aircraft24", name: "Aircraft24", status: "active", color: "bg-teal-500" },
]

const mockBuyerOffers = [
  { partNumber: "ABC123", description: "Engine Component", quantity: 5, platform: "Partbase", status: "Active" },
  { partNumber: "XYZ789", description: "Landing Gear Part", quantity: 2, platform: "ILS", status: "Active" },
  { partNumber: "DEF456", description: "Avionics Module", quantity: 1, platform: "Locatory", status: "Pending" },
]

const mockSellerDeals = [
  { partNumber: "ABC123", supplier: "AeroSupply Co", price: "$1,250", availability: "In Stock", match: "100%" },
  { partNumber: "XYZ789", supplier: "Parts Direct", price: "$850", availability: "2-3 days", match: "95%" },
  { partNumber: "DEF456", supplier: "Aviation Parts Inc", price: "$2,100", availability: "1 week", match: "98%" },
]

export default function PNPilotDashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [scrapingStatus, setScrapingStatus] = useState<"idle" | "scraping" | "completed" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [email, setEmail] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("buyer-offers")
  const [showSettings, setShowSettings] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactData, setContactData] = useState<any>(null)

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId)
  }

  const handleScrapeBuyerOffers = async () => {
    if (!selectedPlatform) return

    setScrapingStatus("scraping")
    setProgress(0)

    // Simulate scraping progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScrapingStatus("completed")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setUploadedFile(file)
    }
  }

  const handleScrapeSellerDeals = async () => {
    if (!uploadedFile) return

    setScrapingStatus("scraping")
    setProgress(0)

    // Simulate scraping progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScrapingStatus("completed")
          return 100
        }
        return prev + 15
      })
    }, 400)
  }

  const downloadCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    const csv = [headers, ...rows].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const sendEmail = async (data: any[], type: string) => {
    // Simulate email sending
    alert(`${type} data sent to ${email}`)
  }

  const handleContactDealer = (dealerData: any, type: "buyer" | "seller") => {
    setContactData({ ...dealerData, type })
    setShowContactModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">PNPilot</h1>
                <p className="text-sm text-slate-500">Aviation Parts Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Select Platforms
            </CardTitle>
            <CardDescription>Choose which platforms you want to scrape data from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPlatform === platform.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  } ${platform.status === "maintenance" ? "opacity-50" : ""}`}
                  onClick={() => platform.status === "active" && handlePlatformSelect(platform.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                    {selectedPlatform === platform.id && <CheckCircle className="h-4 w-4 text-blue-500" />}
                  </div>
                  <h3 className="font-medium text-slate-900">{platform.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{platform.status}</p>
                  {platform.status === "maintenance" && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                      Maintenance
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            {selectedPlatform && (
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Selected platform: {platforms.find((p) => p.id === selectedPlatform)?.name}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buyer-offers" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Buyer Offers
            </TabsTrigger>
            <TabsTrigger value="seller-deals" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Seller Deals
            </TabsTrigger>
          </TabsList>

          {/* Buyer Offers Tab */}
          <TabsContent value="buyer-offers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scrape Buyer Offers</CardTitle>
                <CardDescription>
                  Extract buyer offers from selected platforms and download or email the results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scrapingStatus === "scraping" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Scraping in progress...</span>
                      <span className="text-sm text-slate-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleScrapeBuyerOffers}
                    disabled={!selectedPlatform || scrapingStatus === "scraping"}
                    className="flex-1"
                  >
                    {scrapingStatus === "scraping" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Scraping
                      </>
                    )}
                  </Button>
                </div>

                {scrapingStatus === "completed" && (
                  <div className="space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Successfully scraped {mockBuyerOffers.length} buyer offers from{" "}
                        {platforms.find((p) => p.id === selectedPlatform)?.name}
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Part Number</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Contact</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockBuyerOffers.map((offer, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{offer.partNumber}</TableCell>
                              <TableCell>{offer.description}</TableCell>
                              <TableCell>{offer.quantity}</TableCell>
                              <TableCell>{offer.platform}</TableCell>
                              <TableCell>
                                <Badge variant={offer.status === "Active" ? "default" : "secondary"}>
                                  {offer.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" onClick={() => handleContactDealer(offer, "buyer")}>
                                  <Mail className="h-3 w-3 mr-1" />
                                  Contact
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => downloadCSV(mockBuyerOffers, "buyer-offers.csv")}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                      <div className="flex-1 flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={() => sendEmail(mockBuyerOffers, "Buyer Offers")} disabled={!email}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seller Deals Tab */}
          <TabsContent value="seller-deals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scrape Seller Deals</CardTitle>
                <CardDescription>
                  Upload your buyer offers CSV file to find matching seller deals across platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-upload" className="text-sm font-medium">
                      Upload Buyer Offers CSV
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {uploadedFile && (
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        File uploaded: {uploadedFile.name}
                      </p>
                    )}
                  </div>

                  {scrapingStatus === "scraping" && activeTab === "seller-deals" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Searching seller deals...</span>
                        <span className="text-sm text-slate-500">{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}

                  <Button
                    onClick={handleScrapeSellerDeals}
                    disabled={!uploadedFile || scrapingStatus === "scraping"}
                    className="w-full"
                  >
                    {scrapingStatus === "scraping" && activeTab === "seller-deals" ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Seller Deals
                      </>
                    )}
                  </Button>
                </div>

                {scrapingStatus === "completed" && activeTab === "seller-deals" && (
                  <div className="space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Found {mockSellerDeals.length} matching seller deals across all platforms
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Part Number</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Match %</TableHead>
                            <TableHead>Contact</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockSellerDeals.map((deal, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{deal.partNumber}</TableCell>
                              <TableCell>{deal.supplier}</TableCell>
                              <TableCell className="font-semibold text-green-600">{deal.price}</TableCell>
                              <TableCell>{deal.availability}</TableCell>
                              <TableCell>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  {deal.match}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="outline" onClick={() => handleContactDealer(deal, "seller")}>
                                  <Mail className="h-3 w-3 mr-1" />
                                  Contact
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => downloadCSV(mockSellerDeals, "seller-deals.csv")}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Results
                      </Button>
                      <div className="flex-1 flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={() => sendEmail(mockSellerDeals, "Seller Deals")} disabled={!email}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showSettings && <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />}
      {showContactModal && (
        <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} contactData={contactData} />
      )}
    </div>
  )
}
