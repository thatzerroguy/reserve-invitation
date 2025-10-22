'use client';

import Link from 'next/link';

export default function OrderServicePage() {
  // Program items for the order of service
  const programItems = [
    'Welcoming of Guests',
    'Ushering quests to their designated seats',
    'Grand entrance of the celebrants',
    'Worship song (Holy of Holy)',
    'Opening Prayer',
    'Opening Hymn (Great is thy faithfulness)',
    'Introduction of the Celebrant',
    'Welcome remarks',
    'Bible Reading Roses Dance',
    'Word of Exaltation',
    'Prayer for the Celebrant',
    'Testimonies about the celebrant',
    'Dinner time',
    'Photo session per group',
    'Audio-video presentation',
    'Games',
    'Birthday song (blowing of candle & cutting cake)',
    'Presentation of gift',
    'Thank you speech',
    'Dance dance dance',
    'Closing hymn',
    'Closing prayer',
    'End of Event',
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm md:max-w-md lg:max-w-lg">
        <h1 className="text-xl md:text-2xl font-bold text-yellow-600 mb-4 text-center">
          ORDER OF SERVICE
        </h1>

        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-center">
          Diamond Jubilee Celebration
        </h2>

        <p className="text-gray-600 text-sm md:text-base mb-6 text-center">
          25th December 2025 • 10:00 AM
        </p>

        <div className="space-y-3 mb-6">
          {programItems.map((item, index) => (
            <div 
              key={index} 
              className="border-b border-gray-100 pb-2"
            >
              <span className="text-sm text-gray-800">{item}</span>
            </div>
          ))}
        </div>

        <Link href="/">
          <button className="w-full bg-black text-white font-semibold py-3 rounded-md border border-yellow-500 hover:bg-gray-900 active:bg-yellow-600 active:border-black transition">
            BACK TO INVITATION
          </button>
        </Link>
      </div>
    </main>
  );
}
