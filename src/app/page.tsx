'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';

export default function InvitationPage() {
  const router = useRouter();

  // Phone number & Google Maps link (you can replace these later)
  const phoneNumber = '+2348032560690';
  const mapLink =
      'https://maps.app.goo.gl/uGmD9fgJQQM4mgsy6';

  const handleRSVP = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleVenueDirection = () => {
    window.open(mapLink, '_blank');
  };

  const handleSetReminder = () => {
    router.push('/reminder');
  };

  return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <div className="flex flex-col items-center text-center bg-white shadow-md rounded-lg w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-10">
          {/* Logo */}
          <div className="mb-4">
            <Image
                src="/logo.png"
                alt="Lasbat Iyabode Akinleye 50th Anniversary"
                width={120}
                height={120}
                className="mx-auto"
            />
          </div>

          {/* Text */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
            Invitation Verified
          </h1>


          <p className="text-gray-700 mb-4 text-sm md:text-base">
            Welcome as we celebrate the golden jubilee of
          </p>

          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Taiwo Felicia
          </h3>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            &
          </h3>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Kehinde Mary
          </h3>

          {/* Event Details */}
          <div className="text-gray-700 text-sm md:text-base space-y-1 mb-6">
            <p><span className="font-semibold">Date:</span> 25th December 2025</p>
            <p><span className="font-semibold">Time:</span> 10.00am</p>
            <p>Adebisi Asabi Multipurpose Hall (AAMH)</p>
            <p>3, Omolade Oguntade Crescent Idiroko Rd, Ota, Ogun State</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 w-full">
            <button
                onClick={handleSetReminder}
                className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 transition"
            >
              SET REMINDER
            </button>
            <button
                onClick={handleVenueDirection}
                className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 transition"
            >
              VENUE DIRECTION
            </button>
            <button className="w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 transition">
              ORDER OF SERVICE
            </button>
          </div>

          <button
              onClick={handleRSVP}
              className="mt-5 w-full bg-black text-white font-semibold py-2 rounded-md border border-yellow-500 hover:bg-gray-900 transition"
          >
            RSVP
          </button>
        </div>
      </main>
  );
}