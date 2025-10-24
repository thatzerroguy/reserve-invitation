import cron from 'node-cron';
import { getPendingReminders, updateReminder } from './reminderStorage';
import { sendReminderEmail } from './emailService';

// Schedule to run every minute to check for pending reminders
export const startReminderCron = () => {
  console.log('Starting reminder cron job...');
  
  // Schedule the cron job to run every minute
  const job = cron.schedule('* * * * *', async () => {
    try {
      const now = new Date().toISOString();
      console.log('Checking for pending reminders at:', now);
      
      // Get all pending reminders
      const pendingReminders = await getPendingReminders();
      
      if (pendingReminders.length > 0) {
        console.log(`Found ${pendingReminders.length} pending reminders to send.`);
        
        // Process each pending reminder
        for (const reminder of pendingReminders) {
          try {
            // Send the reminder email
            const success = await sendReminderEmail({
              email: reminder.email,
              date: reminder.date,
              time: reminder.time,
            });
            
            if (success) {
              // Update the reminder as sent
              await updateReminder(reminder.id, { sentReminder: true });
              console.log(`Sent reminder email to ${reminder.email} for ${reminder.date} ${reminder.time}`);
            } else {
              console.error(`Failed to send reminder email to ${reminder.email}`);
            }
          } catch (error) {
            console.error(`Error processing reminder ${reminder.id}:`, error);
          }
        }
      } else {
        console.log('No pending reminders found.');
      }
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });
  
  // Return the job so it can be stopped if needed
  return job;
};