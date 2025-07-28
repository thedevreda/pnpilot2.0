import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, data, type } = await request.json()

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll simulate sending the email

    console.log(`Sending ${type} data to ${email}`)
    console.log("Data:", data)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `${type} data sent successfully to ${email}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
