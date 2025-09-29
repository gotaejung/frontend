import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Card from "./Card";
export default function Section({ title, items, m_v, p_v }) {
  return (
    <section className="bg-black py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-[32px] font-bold mb-6">{title}</h2>

        <Swiper modules={[Navigation, Pagination]} slidesPerView={8} 
        spaceBetween={24} 
        navigation 
        breakpoints={{
          960:{slidesPerView:m_v} ,
          1024:{slidesPerView:p_v }
      
      }}
      >
          {items.map((m) => (
            <SwiperSlide key={m.id}>
              <Card movie={m} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
