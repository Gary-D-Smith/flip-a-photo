import React, { } from "react"
import { FlippablePhoto } from "./FlippablePhoto";
import { Swiper, SwiperSlide } from 'swiper/react'
import leftArrow from './assets/vectors/left-nav-arrow.svg'
import rightArrow from './assets/vectors/right-nav-arrow.svg'
// import { CardsEffectOptions } from "swiper/types";
// import { CardsEffectOptions } from "swiper/types";
// import { EffectCards } from "swiper";
import 'swiper/css'
import { Navigation, EffectCards } from 'swiper'
import 'swiper/css/navigation'
import 'swiper/css/effect-flip'
import 'swiper/css/effect-cards'
import 'swiper/css/keyboard'
// import { SwiperNavButtons } from "./components/SwiperNavButton"


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


    // images: [ id: theID, path: URL.createObjectURL(file), name: file.name, itemNumber: null, isFront: null  ]


    // return (
    //     <div>
    //     {/* <h1>slider!</h1> */}
    //     {/* <img src={images[0].path} alt="user swiper created" className="swiperImage"/> */}
    //     <Swiper
    //     modules={[Navigation, EffectCards, EffectFlip]}
    //     // navigation
    //     mousewheel= {true}
    //     speed= {800}
    //     slidesPerView={1}
    //     effect= {'cards'}
    //     className="mainSwiper"
    //     >   <SwiperSlide className="swiperSlide">
    //             <div class="card js-card">
    //             <div class="card__wrapper">
    //                 <div class="card__side is-active">
    //                 <h4>FRONT</h4>
    //                 <img src={images[0].path} alt="user swiper created" className="swiperImage"/>
    //                 </div>
    //                 <div class="card__side card__side--back">
    //                 <img src={images[1].path} alt="user swiper created" className="swiperImage"/>
    //                 <h2>BACK</h2>
    //                 </div>
    //             </div>
    //             </div>

    //             {/* <div className='flip-wrapper'
    //             modules={[Navigation, EffectCards, EffectFlip]}
    //             // navigation
    //             mousewheel= {true}
    //             speed= {800}
    //             slidesPerView={1}
    //             effect= {'cards'}
    //             >
    //                 <div className='FRONT'>
    //                     <img src={images[0].path} alt="user swiper created" className="swiperImage"/>
    //                 </div>
    //                 <div className='BACK'>
    //                     <img src={images[1].path} alt="user swiper created" className="swiperImage"/>
    //                 </div>
    //             </div> */}
    //         </SwiperSlide>
    //         <SwiperSlide className="swiperSlide">
    //             <img src={images[2].path} alt="user swiper created" className="swiperImage"/>
    //         </SwiperSlide>
    //     </Swiper>
    //     </div>
    // )