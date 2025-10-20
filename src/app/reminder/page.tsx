'use client';

import {useState} from 'react';

export default function ReminderPage() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [toastVisible, setToastVisible] = useState(false);

    const handleSetReminder = () => {
        if (date && time) {
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
        } else {
            alert('Please select both date and time.');
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Set Reminder</h1>

                <div className="space-y-4">
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

                    <button
                        onClick={handleSetReminder}
                        className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 active:bg-yellow-600 active:border-black transition"
                    >
                        SET REMINDER
                    </button>
                </div>

                {toastVisible && (
                    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow-lg">
                        Reminder set!
                    </div>
                )}
            </div>
        </main>
    );
}
