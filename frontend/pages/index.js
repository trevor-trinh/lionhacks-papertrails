import Image from 'next/image';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import StatsCard from '@/components/StatsCard';
import UploadsCard from '@/components/UploadsCard';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Navbar />
      <div class="flex flex-col gap-4 justify-center max-w-5xl mx-auto mt-4">
        <StatsCard />
        <UploadsCard />
      </div>

      <p className="text-center mt-4 mb-4">rawr lionhacks 🦁</p>
    </>
  );
}
