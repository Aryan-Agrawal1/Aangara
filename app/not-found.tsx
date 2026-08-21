import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06090E] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-slate-400 mb-6">The requested page could not be found.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
