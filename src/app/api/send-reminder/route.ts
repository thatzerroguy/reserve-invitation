import { NextRequest, NextResponse } from 'next/server';
import { sendReminderEmail } from '@/utils/emailService';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, date, time } = body;

    // Validate inputs
    if (!email || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send the email
    const success = await sendReminderEmail({ email, date, time });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Reminder email sent successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send reminder email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-reminder API route:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}