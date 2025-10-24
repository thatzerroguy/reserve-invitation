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

    // Store the reminder
    const reminder = await addReminder({ email, date, time });

    // Send the confirmation email
    const success = await sendConfirmationEmail({ email, date, time });

    if (success) {
      // Update the reminder to mark confirmation as sent
      await updateReminder(reminder.id, { sentConfirmation: true });

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
  } catch (error) {
    console.error('Error in send-reminder API route:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
