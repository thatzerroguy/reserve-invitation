import { startReminderCron } from '@/utils/cronService';

// Start the cron job when this module is imported
let cronJob: ReturnType<typeof startReminderCron> | null = null;

// Only start the cron job in production or if explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
  // Ensure we only start one instance of the cron job
  if (!cronJob) {
    cronJob = startReminderCron();
    console.log('Cron job initialized in production mode');
  }
} else {
  console.log('Cron job not started in development mode. Set ENABLE_CRON=true to enable.');
}

export default cronJob;