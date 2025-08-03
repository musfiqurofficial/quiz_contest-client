"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";

const banners = [
  {
    id: 1,
    title: "প্রথম আলো পাঠক কুইজ",
    description:
      "প্রথম আলোর ২৬তম প্রতিষ্ঠাবার্ষিকী উপলক্ষে পাঠকদের জন্য অনলাইন কুইজের আয়োজন। কুইজের প্রশ্ন থাকবে কুইজের দিন ও পূর্ববর্তী দিনের প্রথম আলোর ছাপা পত্রিকা ও অনলাইন থেকে। বিজয়ীদের জন্য রয়েছে আকর্ষণীয় গিফট চেক!",
    image: "/Asset/prducts/banner-1-1.png", // Replace with actual image
    buttonText: "কুইজে শুরু করতে ক্লিক করুন",
  },
  {
    id: 2,
    title: "পড়তে হবে, জিততে হলে",
    description:
      "কুইজের যেকোনো বিষয়ে প্রথম আলোর দৃষ্টিভঙ্গি জানতে পড়তে হবে প্রতিদিন।",
    image: "/Asset/prducts/banner-1-2.png", // Replace with actual image
    buttonText: "শুরু করুন",
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
    <main className="relative bg-white pt-10 md:pt-0">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-auto md:h-[600px] relative"
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
                  className="w-full h-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-10 gap-8"
                >
                  {/* Text Content */}
                  <div className="md:w-1/2 text-center md:text-left space-y-4 z-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-primary">
                      {banner.title}
                    </h1>
                    <p className="text-md md:text-lg text-gray-700 leading-relaxed">
                      {banner.description}
                    </p>
                    <Button className="px-6 py-2 text-lg bg-[#f25b29] text-white hover:bg-[#e5531f] transition">
                      {banner.buttonText}
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="md:w-1/2 flex justify-center">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      width={500}
                      height={400}
                      className="rounded-lg object-contain max-h-[350px] md:max-h-[450px]"
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
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20 bg-[#f25b29] px-3 py-1 rounded">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={clsx(
                "w-3 h-3 rounded-full transition",
                currentSlide === idx
                  ? "bg-white"
                  : "border border-white bg-transparent"
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
            className="absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full z-20 bg-white shadow"
            aria-label="Previous Slide"
          >
            <CircleChevronLeft className="w-5 h-5 text-[#f25b29]" />
          </Button>
          <Button
            onClick={() => instanceRef.current?.next()}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 rounded-full z-20 bg-white shadow"
            aria-label="Next Slide"
          >
            <CircleChevronRight className="w-5 h-5 text-[#f25b29]" />
          </Button>
        </>
      )}
    </main>
  );
}
