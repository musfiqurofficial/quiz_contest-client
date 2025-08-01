"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Empower Your Digital Business",
    description:
      "Scale faster with our premium tech services & solutions tailored for your success.",
    image: "/Asset/prducts/image-1.avif",
    buttonText: "Get Started",
  },
  {
    id: 2,
    title: "Modern Tech, Real Results",
    description:
      "Transform your vision into reality with modern tools and expert guidance.",
    image: "/Asset/prducts/image-2.avif",
    buttonText: "Explore Services",
  },
  {
    id: 3,
    title: "Global Standards, Local Impact",
    description:
      "We build solutions that meet international standards while solving your real-world problems.",
    image: "/Asset/prducts/image-1.avif",
    buttonText: "Join Us Today",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  useEffect(() => {
    if (!instanceRef.current) return;

    timerRef.current = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [instanceRef]);

  return (
    <main className="relative bg-white pt-20 md:pt-0">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-[500px] md:h-[600px] relative"
      >
        {banners.map((banner, index) => (
          <div className="keen-slider__slide" key={banner.id}>
            <AnimatePresence mode="wait">
              {index === currentSlide && (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute inset-0 w-full h-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-10 gap-8"
                >
                  <div className="md:w-1/2 text-center md:text-left space-y-6 z-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                      {banner.title}
                    </h1>
                    <p className="text-md md:text-lg text-gray-600">
                      {banner.description}
                    </p>
                    <Button className="px-6 py-2 text-lg bg-[#f25b29] text-white hover:bg-[#e5531f] transition">
                      {banner.buttonText}
                    </Button>
                  </div>

                  <div className="md:w-1/2 flex justify-center">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      width={500}
                      height={400}
                      className="rounded-xl object-cover max-h-[300px] md:max-h-[500px]"
                      priority
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Dots */}
      {loaded && (
        <div className="absolute bg-[#f25b29] mt-5 px-3 py-1 rounded  bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={clsx(
                "w-3 h-3 rounded-full transition",
                currentSlide === idx
                  ? "scale-110 bg-white hover:bg-white"
                  : "border-white border-[0.5px] "
              )}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {loaded && (
        <>
          <Button
            onClick={() => instanceRef.current?.prev()}
            className="absolute top-1/2 left-6 transform -translate-y-1/2 rounded-full z-20 transition"
            aria-label="Previous Slide"
          >
            <CircleChevronLeft className="w-5 h-5 text-[#f25b29]" />
          </Button>
          <Button
            onClick={() => instanceRef.current?.next()}
            className="absolute top-1/2 right-6 transform -translate-y-1/2 rounded-full z-20 transition"
            aria-label="Next Slide"
          >
            <CircleChevronRight className="w-5 h-5 text-[#f25b29]" />
          </Button>
        </>
      )}
    </main>
  );
}
