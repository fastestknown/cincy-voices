import { Shimmer } from '@/components/shared/shimmer';

export default function Loading() {
  return (
    <div className="max-w-content mx-auto px-6 py-24">
      <Shimmer className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-leaders gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Shimmer key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
