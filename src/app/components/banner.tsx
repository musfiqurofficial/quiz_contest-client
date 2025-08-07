

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useKeenSlider } from "keen-slider/react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";

type BannerItem = {
  _id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  status: string;
};

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
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

  // Fetch banner data
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          "https://backend-weld-two-15.vercel.app/api/v1/banner"
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const approvedBanners = json.data.filter(
            (item: BannerItem) => item.status === "approved"
          );
          setBanners(approvedBanners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!instanceRef.current) return;

    timerRef.current = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [instanceRef]);

  if (banners.length === 0) return null; // You can replace with loader if needed

  return (
    <main className="relative bg-white pt-10 md:pt-0">
      <div
        ref={sliderRef}
        className="keen-slider w-full h-auto md:h-[600px] relative"
      >
        {banners.map((banner) => (
          <div className="keen-slider__slide" key={banner._id}>
            <div className="w-full h-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-10 gap-8">
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
            </div>
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
