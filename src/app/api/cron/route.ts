import {  NextResponse } from 'next/server';
import cronJob from '../cron-init';

// This route handler is just to ensure the cron job is initialized
// It can also be used to check the status of the cron job
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    cronInitialized: !!cronJob,
    mode: process.env.NODE_ENV,
    enableCron: process.env.ENABLE_CRON === 'true',
  });
}