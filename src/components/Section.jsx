import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from 'react-router';

import Card from "./Card";
export default function Section({ title, titleTo, items, m_v, p_v, orientation = 'vertical' }) {
  return (
    <section className={`my-${m_v ?? 2} px-${p_v ?? 6}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          {titleTo ? (
            <Link to={titleTo} className="text-xl md:text-2xl font-bold hover:underline">
              {title}
            </Link>
          ) : (
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
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
  );
}

