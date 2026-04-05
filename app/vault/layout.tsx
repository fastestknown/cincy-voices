export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cv-dark text-white">
      {children}
    </div>
  );
}
