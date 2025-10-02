import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Card from "./Card";
export default function Section({ title, items, m_v, p_v, orientation = "vertical" }) {
  return (
    <section className="bg-black py-6 md:py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-[32px] font-bold mb-4 md:mb-6">{title}</h2>

        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 50,
            },
          }}
        >
          {items.map((m, index) => (
            <SwiperSlide key={m.id}>
              <Card movie={m} orientation={orientation} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

