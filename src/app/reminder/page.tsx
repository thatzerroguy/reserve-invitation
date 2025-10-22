'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function ReminderPage() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const router = useRouter();

    const handleSetReminder = () => {
        if (!date || !time) {
            alert('Please select both date and time.');
            return;
        }

        // Combine date and time to form full datetime
        const startDate = new Date(`${date}T${time}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

        // Convert date to iCalendar format
        const formatICSDate = (d: Date) =>
            d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        // Generate .ics content
        const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Golden Jubilee Celebration
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
DESCRIPTION:Lasbat Iyabode Akinleye 50th Anniversary @ Sheba Event Center, Lagos
LOCATION:Sheba Event Center, 20 Mobolaji Bank Anthony Way, Maryland Lagos
END:VEVENT
END:VCALENDAR
    `.trim();

        // Create downloadable file
        const blob = new Blob([icsContent], {
            type: 'text/calendar;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'event-reminder.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show toast
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Set Reminder</h1>

                <div className="space-y-4">
                    {/* Date Input */}
                    <div className="flex flex-col text-left">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Time Input */}
                    <div className="flex flex-col text-left">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Buttons */}
                    <button
                        onClick={handleSetReminder}
                        className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 active:bg-yellow-600 active:border-black transition"
                    >
                        SET REMINDER
                    </button>
                    <button
                        onClick={handleBack}
                        className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 active:bg-yellow-600 active:border-black transition"
                    >
                        BACK TO INVITATION
                    </button>
                </div>

                {/* Toast */}
                {toastVisible && (
                    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg transition-opacity duration-500 ease-in-out">
                        Calendar invite downloaded!
                    </div>
                )}
            </div>
        </main>
    );
}