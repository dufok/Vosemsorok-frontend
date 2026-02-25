import { imageUrl } from '../api/client';
import { useDragScroll } from '../hooks/useDragScroll';
import type { ProjectImage } from '../types';

interface Props {
  slug: string;
  images: ProjectImage[];
  leftOffset: number; // pixels from left edge — aligns clip with year indent
}

export function PhotoGallery({ slug, images, leftOffset }: Props) {
  const { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useDragScroll();

  return (
    <div className="gallery-outer" style={{ '--left-offset': `${leftOffset}px` } as React.CSSProperties}>
      <div
        ref={ref}
        className="gallery-inner"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {images.map((img) => (
          <div key={img.id} className="gallery-item">
            <img
              src={imageUrl(slug, img.filename)}
              alt={img.alt_text ?? img.filename}
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
        {/* Spacer so last image doesn't stick to right viewport edge */}
        <div className="gallery-end-spacer" />
      </div>
    </div>
  );
}
