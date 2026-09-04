import Link from 'next/link';
import { Header } from '@/components/navigation/Header';

export default function NotFound() {
  return (
    <>
      <Header
        sectorsList={[]}
        entitiesList={[]}
      />
      <div className="flex-1 bg-surface-base flex flex-col items-center justify-center text-center px-4 min-h-[calc(100vh-64px)]">
        <h1 className="text-8xl font-black text-leaf-primary mb-4 font-display">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Facility Not Found</h2>
        <p className="text-text-secondary max-w-md mb-8">
          The requested system pathway or industrial facility could not be located in the current regulatory database.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#1F4D2E] hover:bg-[#27643A] text-white rounded-lg font-semibold transition-colors shadow-sm"
        >
          Return to Command Center
        </Link>
      </div>
    </>
  );
}
