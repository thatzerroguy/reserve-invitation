import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/utils/emailService';
import { addReminder, updateReminder } from '@/utils/reminderStorage';

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

    // Store the reminder with retry logic
    let reminder;
    try {
      reminder = await addReminder({ email, date, time });
    } catch (dbError: any) {
      console.error('Database error when adding reminder:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection error. Please try again later.',
          error: dbError.code || 'DB_ERROR'
        },
        { status: 503 }  // Service Unavailable
      );
    }

    // Send the confirmation email
    const success = await sendConfirmationEmail({ email, date, time });

    if (success) {
      // Update the reminder to mark confirmation as sent
      try {
        await updateReminder(reminder.id, { sentConfirmation: true });
      } catch (updateError) {
        // Log the error but don't fail the request since the reminder was created
        console.error('Error updating reminder confirmation status:', updateError);
      }

      return NextResponse.json({
        success: true,
        message: 'Reminder set successfully. Confirmation email sent.',
        reminderId: reminder.id
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in send-reminder API route:', error);

    // Provide more specific error messages based on the error type
    const errorMessage = error.code === 'ETIMEDOUT' 
      ? 'Database connection timed out. Please try again later.'
      : 'Server error';

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
