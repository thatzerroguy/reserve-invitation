import nodemailer from 'nodemailer';

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendReminderEmailParams {
  email: string;
  date: string;
  time: string;
}

/**
 * Sends a reminder email to the specified email address
 */
export const sendReminderEmail = async ({ email, date, time }: SendReminderEmailParams): Promise<boolean> => {
  try {
    // Format the date and time for display
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

    // Send the email
    await transporter.sendMail({
      from: `"Golden Jubilee Celebration" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reminder: Golden Jubilee Celebration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #333; text-align: center;">Golden Jubilee Celebration Reminder</h1>
          <p style="font-size: 16px; line-height: 1.5;">Dear Guest,</p>
          <p style="font-size: 16px; line-height: 1.5;">This is a reminder for the upcoming Golden Jubilee Celebration:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Event:</strong> Lasbat Iyabode Akinleye 50th Anniversary</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> Sheba Event Center, 20 Mobolaji Bank Anthony Way, Maryland Lagos</p>
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