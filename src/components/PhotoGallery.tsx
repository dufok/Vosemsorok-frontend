import { useRef } from 'react';
import { imageUrl } from '../api/client';
import { useDragScroll } from '../hooks/useDragScroll';
import type { ProjectImage } from '../types';

interface Props {
  slug: string;
  images: ProjectImage[];
  leftOffset: number; // pixels from left edge — aligns clip with year indent
  viewerUrl?: string | null;
}

export function PhotoGallery({ slug, images, leftOffset, viewerUrl }: Props) {
  const { ref, onMouseDown, onMouseMove, onMouseUp, onMouseLeave } = useDragScroll();
  // The gallery is scrolled by dragging across it, so a drag that happens to end
  // on the 3D frame must not count as a click and navigate away mid-scroll.
  const pressX = useRef(0);

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
        {images.map((img, i) => {
          const frame = (
            <img
              src={imageUrl(slug, img.filename)}
              alt={img.alt_text ?? img.filename}
              draggable={false}
              loading="lazy"
            />
          );

          // The first frame doubles as the entrance to the live 3D viewer
          if (i === 0 && viewerUrl) {
            return (
              <a
                key={img.id}
                className="gallery-item gallery-item--3d"
                href={viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={(e) => { pressX.current = e.clientX; }}
                onClick={(e) => {
                  if (Math.abs(e.clientX - pressX.current) > 4) e.preventDefault();
                }}
              >
                {frame}
                <span className="gallery-3d-badge">3D VIEW</span>
              </a>
            );
          }

          return (
            <div key={img.id} className="gallery-item">
              {frame}
            </div>
          );
        })}
        {/* Spacer so last image doesn't stick to right viewport edge */}
        <div className="gallery-end-spacer" />
      </div>
    </div>
  );
}
