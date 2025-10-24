This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Event invitation page
- Email reminder service using Nodemailer
- Scheduled reminders with confirmation emails
- Responsive design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Email Configuration

This project uses Nodemailer to send email reminders. To set up the email functionality:

1. Create a `.env.local` file in the root directory with the following variables:

```
# Option 1: Using Gmail with SSL (recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Option 2: Using Gmail with TLS
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

2. For Gmail, you need to use an App Password instead of your regular password:
   - Enable 2-Step Verification on your Google account
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new App Password for "Mail" and "Other (Custom name)"
   - Use that password in your `.env.local` file

3. For other email providers, adjust the SMTP settings accordingly.

4. **Important**: Remove all spaces from the app password (e.g., "xxxx xxxx xxxx xxxx" should be "xxxxxxxxxxxxxxxx")

## Scheduled Reminders

This project includes a scheduled reminder system that:

1. Sends an immediate confirmation email when a user sets a reminder
2. Sends a second reminder email at the scheduled date and time

To enable the scheduled reminders functionality:

1. Add the following to your `.env.local` file:

```
# Enable cron job in development mode (true/false)
ENABLE_CRON=true
```

2. The cron job runs every minute to check for pending reminders that need to be sent.

3. Reminder data is stored in a JSON file at `data/reminders.json` in the project root.

4. You can check the status of the cron job by visiting `/api/cron` endpoint.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

When deploying, make sure to add the email environment variables in your hosting platform.

change
