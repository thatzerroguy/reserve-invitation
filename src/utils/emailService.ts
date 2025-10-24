import nodemailer from 'nodemailer';

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendEmailParams {
  email: string;
  date: string;
  time: string;
}

/**
 * Formats the date and time for display in emails
 */
const formatDateTime = (date: string, time: string) => {
  const eventDate = new Date(`${date}T${time}`);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { formattedDate, formattedTime };
};

/**
 * Sends a confirmation email when a reminder is set
 */
export const sendConfirmationEmail = async ({ email, date, time }: SendEmailParams): Promise<boolean> => {
  try {
    const { formattedDate, formattedTime } = formatDateTime(date, time);

    // Send the confirmation email
    await transporter.sendMail({
      from: `"Diamond Jubilee Celebration" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reminder Set: Diamond Jubilee Celebration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Diamond Jubilee Celebration</h1>
          <p style="font-size: 16px; line-height: 1.5;">Dear Guest,</p>
          <p style="font-size: 16px; line-height: 1.5;">Your reminder for the Diamond Jubilee Celebration has been successfully set up:</p>
          <p style="font-size: 16px; line-height: 1.5;">You will receive another email based on your reminder preferences to remind you of the big day.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> Diamond Jubilee Celebration</p>
            <p style="margin: 5px 0;"><strong>Reminder Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Reminder Time:</strong> ${formattedTime}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">Thank you for setting a reminder!</p>
          <p style="font-size: 16px; line-height: 1.5;">Best regards,<br>Event Organizers</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

// Event date and time constants (from app/page.tsx)
const EVENT_DATE = '2025-12-25'; // 25th December 2025 in ISO format
const EVENT_TIME = '10:00'; // 10.00am in 24-hour format

/**
 * Sends a reminder email at the scheduled date and time
 */
export const sendReminderEmail = async ({ email, date, time }: SendEmailParams): Promise<boolean> => {
  try {
    // Use the event date and time instead of the user-input date and time
    const { formattedDate, formattedTime } = formatDateTime(EVENT_DATE, EVENT_TIME);

    // Send the reminder email
    await transporter.sendMail({
      from: `"Diamond Jubilee Celebration" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reminder: Diamond Jubilee Celebration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Diamond Jubilee Celebration</h1>
          <p style="font-size: 16px; line-height: 1.5;">Dear Guest,</p>
          <p style="font-size: 16px; line-height: 1.5;">This is a reminder for the upcoming Diamond Jubilee Celebration:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> Diamond Jubilee Celebration</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ABIGAIL OMOTAYO EVENT CENTRE, ALAMEDA BUS STOP. OPPOSITE IFO HIGH COURT IFO. OGUN STATE</p>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">We look forward to celebrating with you!</p>
          <p style="font-size: 16px; line-height: 1.5;">Best regards,<br>Event Organizers</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};
