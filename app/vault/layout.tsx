export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-cv-dark z-[100] overflow-auto">
      {children}
    </div>
  );
}
