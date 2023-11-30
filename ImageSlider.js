import React, { } from "react"
import { FlippablePhoto } from "./FlippablePhoto";
import { Swiper, SwiperSlide } from 'swiper/react'
import leftArrow from './assets/vectors/left-nav-arrow.svg'
import rightArrow from './assets/vectors/right-nav-arrow.svg'
import 'swiper/css'
import { Navigation, EffectCards } from 'swiper'
import 'swiper/css/navigation'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-cards'
import 'swiper/css/keyboard'

export function ImageSlider({images}) {
    const navigationPrevRef = React.useRef(null)
    const navigationNextRef = React.useRef(null)

    return (
        <div id="interaction-section">
            <img className="nav_arrows" src={leftArrow} alt="left navigation arrow" ref={navigationPrevRef} />
            <Swiper
            modules={[Navigation, EffectCards]}
            speed= {800}
            slidesPerView={1}
            effect= {'cards'}
            className="mainSwiper"
            cardsEffect={{ slideShadows: false, perSlideRotate: 1, perSlideOffset: 1, rotate: true}}
            keyboard={{enabled: true}}

            navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
             onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = navigationPrevRef.current;
                  swiper.params.navigation.nextEl = navigationNextRef.current;
             }}
            >
                {images.map((photo) =>
                    <SwiperSlide key={photo.id}>
                        <FlippablePhoto 
                        key={photo.id}
                        front={photo.front}
                        frontName={photo.frontName}
                        back={photo.back}
                        backName={photo.backName}
                        description={photo.description} />
                    </SwiperSlide>
                )}
            </Swiper>
            <img className="nav_arrows" src={rightArrow} alt="right navigation arrow" ref={navigationNextRef}/>
        </div>
    );
}
