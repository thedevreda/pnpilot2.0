import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Here you would fetch contact history from your database
    const mockHistory = [
      {
        id: "1",
        type: "direct_email",
        contactType: "seller",
        partNumber: "ABC123",
        platform: "Partbase",
        recipientEmail: "sales@aerosupply.com",
        subject: "Inquiry about ABC123",
        timestamp: "2024-01-15T10:30:00Z",
        status: "sent",
        response: "pending",
      },
      {
        id: "2",
        type: "platform_rfq",
        contactType: "buyer",
        partNumber: "XYZ789",
        platform: "ILS",
        quantity: "2",
        targetPrice: "$800",
        timestamp: "2024-01-15T09:45:00Z",
        status: "sent",
        response: "received",
      },
    ]

    return NextResponse.json({
      success: true,
      history: mockHistory,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contact history" }, { status: 500 })
  }
}
