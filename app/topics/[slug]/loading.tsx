import { Shimmer } from '@/components/shared/shimmer';

export default function TopicLoading() {
  return (
    <>
      <div className="h-48 bg-cv-sage" />
      <div className="max-w-content mx-auto px-6 py-20">
        <div className="space-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}
