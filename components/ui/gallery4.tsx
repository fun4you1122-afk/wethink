"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
}

const Gallery4 = ({
  title = "Case Studies",
  description = "Real projects. Real results.",
  items,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4 max-w-xl">
            <span className="section-label">{title}</span>
            <p className="text-3xl font-bold md:text-4xl lg:text-5xl" style={{ color: 'var(--text)' }}>
              {description}
            </p>
          </div>

          {/* Arrow buttons */}
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-11 w-11 rounded-full border-violet-500/30 bg-transparent hover:bg-violet-500/10 disabled:opacity-30 text-violet-300"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-11 w-11 rounded-full border-violet-500/30 bg-transparent hover:bg-violet-500/10 disabled:opacity-30 text-violet-300"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setCarouselApi}
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <a
                  href={item.href}
                  className="group block overflow-hidden rounded-2xl border border-violet-500/15 bg-[#0A0A14] transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="mb-2 text-lg font-bold transition-colors duration-200 group-hover:text-violet-400"
                      style={{ color: 'var(--text)' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed line-clamp-3"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                      <span>View Case Study</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-violet-500"
                  : "w-2 bg-violet-500/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="mt-6 flex justify-center gap-3 md:hidden">
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="h-10 w-10 rounded-full border-violet-500/30 bg-transparent hover:bg-violet-500/10 disabled:opacity-30 text-violet-300"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="h-10 w-10 rounded-full border-violet-500/30 bg-transparent hover:bg-violet-500/10 disabled:opacity-30 text-violet-300"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
