"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Send,
  MessageSquare,
  User,
  Building,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Clock,
} from "lucide-react"

interface ContactData {
  partNumber?: string
  description?: string
  quantity?: number
  platform?: string
  supplier?: string
  price?: string
  buyerInfo?: string
  type: "buyer" | "seller"
  email?: string
  phone?: string
  company?: string
  location?: string
  contactPerson?: string
}

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contactData: ContactData | null
}

export function ContactModal({ isOpen, onClose, contactData }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState("direct-email")
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    message: "",
    attachQuote: false,
    requestUrgent: false,
  })
  const [rfqForm, setRfqForm] = useState({
    partNumber: "",
    quantity: "",
    targetPrice: "",
    deliveryDate: "",
    specifications: "",
    paymentTerms: "NET30",
    shippingTerms: "FOB",
    certificationRequired: false,
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Mock contact information based on scraped data
  const mockContactInfo = {
    email: contactData?.type === "buyer" ? "buyer@airline-xyz.com" : "sales@aerosupply.com",
    phone: contactData?.type === "buyer" ? "+1 (555) 123-4567" : "+1 (555) 987-6543",
    company: contactData?.type === "buyer" ? "Airline XYZ" : contactData?.supplier || "AeroSupply Co",
    location: contactData?.type === "buyer" ? "Miami, FL" : "Dallas, TX",
    contactPerson:
      contactData?.type === "buyer" ? "John Smith - Procurement Manager" : "Sarah Johnson - Sales Director",
  }

  const handleSendEmail = async () => {
    setSending(true)

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSending(false)
    setSent(true)

    setTimeout(() => {
      setSent(false)
      onClose()
    }, 2000)
  }

  const handleSendRFQ = async () => {
    setSending(true)

    // Simulate sending RFQ through platform
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setSending(false)
    setSent(true)

    setTimeout(() => {
      setSent(false)
      onClose()
    }, 2000)
  }

  const generateEmailTemplate = () => {
    if (contactData?.type === "buyer") {
      return `Dear ${mockContactInfo.contactPerson.split(" - ")[0]},

I hope this email finds you well. I noticed your recent buyer request for ${contactData.partNumber} - ${contactData.description} on ${contactData.platform}.

We have this part available and would like to provide you with a competitive quote:

Part Number: ${contactData.partNumber}
Description: ${contactData.description}
Quantity Available: ${contactData.quantity}+
Condition: Serviceable/New
Certification: 8130-3 / EASA Form 1

We would be happy to discuss pricing and delivery terms that meet your requirements.

Best regards,
Your Name
Your Company`
    } else {
      return `Dear ${mockContactInfo.contactPerson.split(" - ")[0]},

I hope this email finds you well. I came across your listing for ${contactData.partNumber} - ${contactData.description} on ${contactData.platform}.

We are interested in this part for our upcoming project:

Part Number: ${contactData.partNumber}
Description: ${contactData.description}
Quantity Needed: [Please specify]
Target Delivery: [Please specify]

Could you please provide:
- Current availability
- Pricing for different quantities
- Lead time
- Certification details

Looking forward to your response.

Best regards,
Your Name
Your Company`
    }
  }

  if (!contactData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact {contactData.type === "buyer" ? "Buyer" : "Seller"}
          </DialogTitle>
          <DialogDescription>
            Reach out to {contactData.type === "buyer" ? "the buyer" : "the supplier"} regarding{" "}
            {contactData.partNumber}
          </DialogDescription>
        </DialogHeader>

        {sent && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Message sent successfully! You should receive a response within 24-48 hours.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm">{mockContactInfo.company}</p>
                      <p className="text-xs text-slate-500">{mockContactInfo.contactPerson}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{mockContactInfo.email}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{mockContactInfo.phone}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{mockContactInfo.location}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <p className="text-sm">{contactData.platform}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Part Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Part Number:</span>
                      <span className="font-medium">{contactData.partNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Description:</span>
                      <span className="font-medium text-right">{contactData.description}</span>
                    </div>
                    {contactData.quantity && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity:</span>
                        <span className="font-medium">{contactData.quantity}</span>
                      </div>
                    )}
                    {contactData.price && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Price:</span>
                        <span className="font-medium text-green-600">{contactData.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct-email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Direct Email
                </TabsTrigger>
                <TabsTrigger value="platform-rfq" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Platform RFQ
                </TabsTrigger>
              </TabsList>

              {/* Direct Email Tab */}
              <TabsContent value="direct-email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Direct Email</CardTitle>
                    <CardDescription>
                      Send a direct email to the {contactData.type} using their scraped contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email-to">To</Label>
                        <Input
                          id="email-to"
                          value={emailForm.to || mockContactInfo.email}
                          onChange={(e) => setEmailForm((prev) => ({ ...prev, to: e.target.value }))}
                          placeholder="Recipient email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input
                          id="email-subject"
                          value={emailForm.subject || `Inquiry about ${contactData.partNumber}`}
                          onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                          placeholder="Email subject"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email-message">Message</Label>
                      <Textarea
                        id="email-message"
                        rows={12}
                        value={emailForm.message || generateEmailTemplate()}
                        onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Your message..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="attach-quote"
                          checked={emailForm.attachQuote}
                          onCheckedChange={(checked) =>
                            setEmailForm((prev) => ({ ...prev, attachQuote: checked as boolean }))
                          }
                        />
                        <Label htmlFor="attach-quote" className="text-sm">
                          Attach company quote template
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="request-urgent"
                          checked={emailForm.requestUrgent}
                          onCheckedChange={(checked) =>
                            setEmailForm((prev) => ({ ...prev, requestUrgent: checked as boolean }))
                          }
                        />
                        <Label htmlFor="request-urgent" className="text-sm">
                          Mark as urgent
                        </Label>
                      </div>
                    </div>

                    <Button onClick={handleSendEmail} disabled={sending || !emailForm.to} className="w-full">
                      {sending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending Email...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Platform RFQ Tab */}
              <TabsContent value="platform-rfq" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Send Platform RFQ</CardTitle>
                    <CardDescription>
                      Send an RFQ through {contactData.platform} using their internal messaging system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        This will use your {contactData.platform} account to send an official RFQ through their
                        platform.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rfq-part">Part Number</Label>
                        <Input
                          id="rfq-part"
                          value={rfqForm.partNumber || contactData.partNumber}
                          onChange={(e) => setRfqForm((prev) => ({ ...prev, partNumber: e.target.value }))}
                          placeholder="Part number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rfq-quantity">Quantity Needed</Label>
                        <Input
                          id="rfq-quantity"
                          value={rfqForm.quantity}
                          onChange={(e) => setRfqForm((prev) => ({ ...prev, quantity: e.target.value }))}
                          placeholder="Quantity required"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rfq-price">Target Price</Label>
                        <Input
                          id="rfq-price"
                          value={rfqForm.targetPrice}
                          onChange={(e) => setRfqForm((prev) => ({ ...prev, targetPrice: e.target.value }))}
                          placeholder="Target price per unit"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rfq-delivery">Required Delivery Date</Label>
                        <Input
                          id="rfq-delivery"
                          type="date"
                          value={rfqForm.deliveryDate}
                          onChange={(e) => setRfqForm((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="payment-terms">Payment Terms</Label>
                        <Select
                          value={rfqForm.paymentTerms}
                          onValueChange={(value) => setRfqForm((prev) => ({ ...prev, paymentTerms: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NET30">NET 30</SelectItem>
                            <SelectItem value="NET60">NET 60</SelectItem>
                            <SelectItem value="COD">Cash on Delivery</SelectItem>
                            <SelectItem value="PREPAID">Prepaid</SelectItem>
                            <SelectItem value="LC">Letter of Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="shipping-terms">Shipping Terms</Label>
                        <Select
                          value={rfqForm.shippingTerms}
                          onValueChange={(value) => setRfqForm((prev) => ({ ...prev, shippingTerms: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOB">FOB Origin</SelectItem>
                            <SelectItem value="CIF">CIF Destination</SelectItem>
                            <SelectItem value="EXW">Ex Works</SelectItem>
                            <SelectItem value="DDP">Delivered Duty Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rfq-specs">Additional Specifications</Label>
                      <Textarea
                        id="rfq-specs"
                        rows={4}
                        value={rfqForm.specifications}
                        onChange={(e) => setRfqForm((prev) => ({ ...prev, specifications: e.target.value }))}
                        placeholder="Any additional specifications, condition requirements, or notes..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="certification-required"
                        checked={rfqForm.certificationRequired}
                        onCheckedChange={(checked) =>
                          setRfqForm((prev) => ({ ...prev, certificationRequired: checked as boolean }))
                        }
                      />
                      <Label htmlFor="certification-required" className="text-sm">
                        8130-3 or EASA Form 1 certification required
                      </Label>
                    </div>

                    <Button
                      onClick={handleSendRFQ}
                      disabled={sending || !rfqForm.partNumber || !rfqForm.quantity}
                      className="w-full"
                    >
                      {sending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Sending RFQ via {contactData.platform}...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Send RFQ via {contactData.platform}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
