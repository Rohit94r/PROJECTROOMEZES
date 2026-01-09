import Link from 'next/link';
import { ReactNode } from 'react';

export default function RoomsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
    </div>
  );
}