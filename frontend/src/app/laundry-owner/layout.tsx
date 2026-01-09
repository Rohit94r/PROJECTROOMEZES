export default function LaundryOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="py-6">
        {children}
      </div>
    </div>
  );
}