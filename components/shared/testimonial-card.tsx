import Image from 'next/image';
import type { Testimonial } from '@/lib/testimonials';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="my-10 flex gap-4 border-l-2 border-cv-gold/60 bg-cv-charcoal/[0.03] py-5 pl-5 pr-4 sm:gap-5 sm:pr-6">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full sm:h-16 sm:w-16">
        <Image
          src={testimonial.photo}
          alt={testimonial.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-body text-base italic leading-7 text-cv-charcoal/85 sm:text-lg">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="font-mono-label mt-3 text-xs text-cv-muted">
          {testimonial.name} &middot; {testimonial.title}
        </p>
      </div>
    </div>
  );
}
