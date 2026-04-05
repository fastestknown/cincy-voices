import { Shimmer } from '@/components/shared/shimmer';

export default function LeaderLoading() {
  return (
    <>
      <div className="h-screen bg-cv-navy" />
      <div className="max-w-content mx-auto px-6 py-20">
        <Shimmer className="h-8 w-48 mb-4" />
        <Shimmer className="h-4 w-64 mb-12" />
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}
