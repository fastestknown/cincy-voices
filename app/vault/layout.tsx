export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cv-vault text-white">
      {children}
    </div>
  );
}
