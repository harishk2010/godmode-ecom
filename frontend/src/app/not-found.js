import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <p className="font-display font-bold text-[180px] leading-none text-white/[0.03] select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-display font-bold text-6xl text-gradient">404</p>
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Page Not Found</h1>
          <p className="text-white/40 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/products" className="btn-secondary">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
