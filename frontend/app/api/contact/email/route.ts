import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, contactData, attachQuote, requestUrgent } = await request.json()

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll simulate sending the email

    console.log("Sending direct email:", {
      to,
      subject,
      message,
      contactData,
      attachQuote,
      requestUrgent,
    })

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Log the contact attempt for tracking
    // You might want to store this in your database
    const contactLog = {
      type: "direct_email",
      contactType: contactData.type,
      partNumber: contactData.partNumber,
      platform: contactData.platform,
      recipientEmail: to,
      subject,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      contactLog,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
