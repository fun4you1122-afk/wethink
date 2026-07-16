import React, { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';

export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  quote: string;
  tags: { text: string; type: 'featured' | 'default' }[];
  stats: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }[];
  avatarGradient: string;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  visibleBehind?: number;
}

export const TestimonialStack = ({ testimonials, visibleBehind = 2 }: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  // Drag state tracked in refs — no React re-renders during touch move
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const dragOffset = useRef(0);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const navigate = useCallback((newIndex: number) => {
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  // Apply inline transform to active card directly (no re-render)
  const applyDragTransform = (offset: number) => {
    const el = cardRefs.current[activeIndexRef.current];
    if (el) el.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const clearDragTransform = () => {
    const el = cardRefs.current[activeIndexRef.current];
    if (el) el.style.transform = '';
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndexRef.current) return;
    isDragging.current = true;
    dragOffset.current = 0;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStart.current = clientX;
    cardRefs.current[index]?.classList.add('is-dragging');
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dragOffset.current = clientX - dragStart.current;
      applyDragTransform(dragOffset.current);
    };

    const onEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      cardRefs.current[activeIndexRef.current]?.classList.remove('is-dragging');
      clearDragTransform();
      if (Math.abs(dragOffset.current) > 50) {
        navigate(activeIndexRef.current + (dragOffset.current < 0 ? 1 : -1));
      }
      dragOffset.current = 0;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [navigate]);

  if (!testimonials?.length) return null;

  return (
    <section className="testimonials-stack relative pb-10">
      {testimonials.map((testimonial, index) => {
        const displayOrder = (index - activeIndex + totalCards) % totalCards;

        const style: CSSProperties = {};
        if (displayOrder === 0) {
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) {
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder;
          style.transform = `scale(${scale}) translate3d(0, ${translateY}rem, 0)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else {
          style.transform = 'scale(0)';
          style.opacity = 0;
          style.zIndex = 0;
        }

        const tagClasses = (type: 'featured' | 'default') =>
          type === 'featured'
            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
            : 'bg-black/5 text-[color:var(--text-muted)] border border-black/10';

        return (
          <div
            ref={el => { cardRefs.current[index] = el; }}
            key={testimonial.id}
            className="testimonial-card"
            style={style}
            onMouseDown={(e) => handleDragStart(e, index)}
            onTouchStart={(e) => handleDragStart(e, index)}
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold text-base"
                    style={{ background: testimonial.avatarGradient }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{testimonial.name}</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{testimonial.role}</p>
                  </div>
                </div>
                {/* Quote mark */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0 opacity-30">
                  <path d="M9.333 21.333c-2.933 0-5.333-2.4-5.333-5.333 0-2.933 2.4-5.333 5.333-5.333.667 0 1.333.133 1.867.4C10.267 8.667 8.267 6.4 5.6 5.333L7.467 4c4.133 1.467 6.4 5.067 6.4 9.333C13.867 17.867 11.733 21.333 9.333 21.333zm14.667 0c-2.933 0-5.333-2.4-5.333-5.333 0-2.933 2.4-5.333 5.333-5.333.667 0 1.333.133 1.867.4-.933-2.4-2.933-4.667-5.6-5.733L21.867 4c4.133 1.467 6.4 5.067 6.4 9.333C28.267 17.867 26.267 21.333 24 21.333z" fill="currentColor" className="text-violet-400"/>
                </svg>
              </div>

              {/* Quote */}
              <blockquote className="leading-relaxed text-base md:text-lg mb-6" style={{ color: 'var(--text)' }}>
                "{testimonial.quote}"
              </blockquote>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/10 pt-4 gap-3">
                <div className="flex flex-wrap gap-2">
                  {testimonial.tags.map((tag, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-md font-medium ${tagClasses(tag.type)}`}>
                      {tag.text}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {testimonial.stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <span key={i} className="flex items-center gap-1">
                        <Icon className="h-3.5 w-3.5" />
                        {stat.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination dots */}
      <div className="pagination flex gap-2 justify-center absolute bottom-0 left-0 right-0">
        {testimonials.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => navigate(index)}
            className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};
