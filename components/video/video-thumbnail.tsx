interface VideoThumbnailProps {
  playbackId: string;
  alt: string;
  className?: string;
}

export function VideoThumbnail({ playbackId, alt, className = '' }: VideoThumbnailProps) {
  const src = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=2&width=640`;

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-cv-gold/90 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 text-white fill-current">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>
    </div>
  );
}
