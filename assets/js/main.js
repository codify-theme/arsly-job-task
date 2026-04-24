

(function ($) {
  "use strict";

  var windowOn = $(window);
  let mm = gsap.matchMedia();

  // ### STICKY HEADER ###
  function pinned_header() {
    var lastScrollTop = 500;

    windowOn.on('scroll', function () {
      var currentScrollTop = $(this).scrollTop();

      if (currentScrollTop > lastScrollTop) {
        $('.header-sticky').removeClass('sticky');
        $('.header-sticky').addClass('transformed');
      } else if ($(this).scrollTop() <= 500) {
        $('.header-sticky').removeClass('sticky');
        $('.header-sticky').removeClass('transformed');
      } else {
        $('.header-sticky').addClass('sticky');
        $('.header-sticky').removeClass('transformed');
      }
      lastScrollTop = currentScrollTop;
    });
  }
  pinned_header();




  // ### SMOOTH ACTIVE ###
  var device_width = window.screen.width;

  if (device_width > 767) {
    if (document.querySelector("#has_smooth").classList.contains("has-smooth")) {
      const smoother = ScrollSmoother.create({
        smooth: 0.9,
        effects: device_width < 1025 ? false : true,
        smoothTouch: 0.1,
        normalizeScroll: {
          allowNestedScroll: true,
        },
        ignoreMobileResize: true,
      });
    }

  }


  // ### MODERN PRELOADER WITH GSAP ###
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.documentElement.classList.add('preloader-active');

    const number = preloader.querySelector('.preloader__number');
    const panelTop = preloader.querySelector('.preloader__panel--top');
    const panelBottom = preloader.querySelector('.preloader__panel--bottom');
    const inner = preloader.querySelector('.preloader__inner');

    const tl = gsap.timeline();

    // 1. Counter animation
    let count = { value: 0 };
    tl.to(count, {
      value: 100,
      duration: 2, // Slightly faster
      ease: "power2.inOut",
      onUpdate: () => {
        if (number) {
          number.textContent = Math.floor(count.value);
          gsap.set(number, { filter: `blur(${Math.min(count.value / 10, 4)}px)` });
        }
      },
      onComplete: () => {
        if (number) gsap.to(number, { filter: "blur(0px)", duration: 0.2 });
      }
    });

    // 2. Inner content scale & fade out
    tl.to(inner, {
      scale: 1.1,
      opacity: 0,
      duration: 0.6,
      ease: "power3.inOut"
    }, "+=0.1");

    // 3. Split-Screen Reveal
    tl.to(panelTop, {
      yPercent: -100,
      duration: 1,
      ease: "expo.inOut"
    }, "-=0.3");

    tl.to(panelBottom, {
      yPercent: 100,
      duration: 1,
      ease: "expo.inOut"
    }, "<");

    // 4. Hide & Remove preloader
    tl.to(preloader, {
      display: 'none',
      duration: 0,
      onComplete: () => {
        document.documentElement.classList.remove('preloader-active');
        preloader.remove();
      }
    });

    // 5. Main content reveal
    tl.from('#smooth-wrapper', {
      scale: 0.98,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    }, "-=0.8");
  }


  // nice select activation 
  $('select').niceSelect();

  // ### SIDE INFO JS (MODERN GSAP) ###
  $(".side-toggle").on("click", function () {
    $(".side-info").addClass("info-open");
    $(".offcanvas-overlay").addClass("overlay-open");

    // GSAP Staggered Entrance
    gsap.fromTo(".side-info__item",
      {
        y: 40,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4 // Wait for sidebar slide
      }
    );
  });

  $(".side-info-close, .offcanvas-overlay").on("click", function () {
    $(".side-info").removeClass("info-open");
    $(".offcanvas-overlay").removeClass("overlay-open");

    // Reset items for next time
    gsap.to(".side-info__item", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in"
    });
  });


  // meanmenu activation 
  $('.main-menu').meanmenu({
    meanScreenWidth: "1199",
    meanMenuContainer: '.mobile-menu',
    meanMenuCloseSize: '28px',
  });



  // ### REGISTER GSAP PLUGINS ###
  gsap.registerPlugin(ScrollTrigger);



  // Counter active
  if ('counterUp' in window) {
    const skill_counter = window.counterUp.default
    const skill_cb = entries => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting && !el.classList.contains('odometer-initialized')) {
          const finalValue = el.getAttribute('data-final') || parseFloat(el.innerText.replace(/[^0-9.]/g, ''));

          if (finalValue !== null && !isNaN(finalValue)) {
            const od = new Odometer({
              el: el,
              value: 0,
              format: '', // Default format
              theme: 'default'
            });
            od.update(finalValue);
            el.classList.add('odometer-initialized');
          }
        }
      })
    }

    const IO = new IntersectionObserver(skill_cb, {
      threshold: 1
    })

    const els = document.querySelectorAll('.odometer-num');
    els.forEach((el) => {
      IO.observe(el)
    });
  }

  // Magnific Video popup
  if ($('.video-popup').length && 'magnificPopup' in jQuery) {
    $('.video-popup').magnificPopup({
      type: 'iframe',
    });
  }



  // ### PROJECTS SLIDER ###
  if (document.querySelector('.projects__slider')) {
    var projects_slider = new Swiper('.projects__slider', {
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      slidesPerView: 2,
      spaceBetween: 32,
      speed: 1200,
      grabCursor: true,
      centeredSlides: true,

      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 16 },
        768: { slidesPerView: 1, spaceBetween: 20 },
        992: { slidesPerView: 1, spaceBetween: 20, centeredSlides: false },
        1200: { slidesPerView: 2, spaceBetween: 32 },
      },
      on: {
        init: function () {
          // Ensure first slide info is visible immediately
          const leftInfo = document.querySelector(".projects__content--left .projects__info");
          const rightInfo = document.querySelector(".projects__content--right .projects__info");
          if (leftInfo) gsap.set(leftInfo, { opacity: 1, y: 0 });
          if (rightInfo) gsap.set(rightInfo, { opacity: 1, y: 0 });

          this.emit('slideChange');
        },
        slideChangeTransitionStart: function () {
          // Circular Mask reveal for images
          const activeImg = this.slides[this.activeIndex].querySelector(".projects__item img");
          if (activeImg) {
            gsap.fromTo(activeImg,
              { clipPath: "circle(0% at 50% 50%)", scale: 1.2 },
              { clipPath: "circle(100% at 50% 50%)", scale: 1, duration: 1.5, ease: "expo.inOut" }
            );
          }

          // Depth effect for non-active slides
          gsap.to(".swiper-slide:not(.swiper-slide-active) .projects__item", {
            opacity: 0.2,
            scale: 0.9,
            duration: 1,
            ease: "power2.inOut"
          });

          gsap.to(".swiper-slide-active .projects__item", {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.inOut"
          });
        },
        slideChange: function () {
          const activeSlide = this.slides[this.activeIndex];
          if (!activeSlide) return;

          const subtitle = activeSlide.getAttribute('data-subtitle');
          const name = activeSlide.getAttribute('data-name');
          const tag1 = activeSlide.getAttribute('data-tag1');
          const tag2 = activeSlide.getAttribute('data-tag2');
          const index = activeSlide.getAttribute('data-index');

          // Left Info Update
          const leftInfo = document.querySelector(".projects__content--left .projects__info");
          if (leftInfo) {
            gsap.to(leftInfo, {
              opacity: 0,
              y: 20,
              duration: 0.4,
              ease: "power2.in",
              onComplete: () => {
                const sub = document.querySelector(".projects__subtitle");
                const nm = document.querySelector(".projects__name");
                const t1 = document.querySelector(".projects__tag1");
                const t2 = document.querySelector(".projects__tag2");
                const idx = document.querySelector(".projects__index span");

                if (sub) sub.textContent = subtitle;
                if (nm) nm.textContent = name;
                if (t1) t1.textContent = tag1;
                if (t2) t2.textContent = tag2;
                if (idx) idx.textContent = index;

                gsap.to(leftInfo, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power4.out"
                });

                // Tag stagger
                gsap.fromTo(".projects__content--left .projects__tag",
                  { opacity: 0, x: -10 },
                  { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
                );
              }
            });
          }

          // Right Info Update
          const rightInfo = document.querySelector(".projects__content--right .projects__info");
          if (rightInfo) {
            gsap.to(rightInfo, {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: "power2.in",
              onComplete: () => {
                const counter = document.querySelector(".projects__counter");
                if (counter) counter.innerHTML = `${index}<span>/06</span>`;

                gsap.to(rightInfo, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power4.out"
                });
              }
            });
          }
        },
      }
    });
  }

  // ### SOLUTIONS SLIDER ###
  if (document.querySelector('.solutions__slider')) {
    var solutions_slider = new Swiper('.solutions__slider', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 1500,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-300%', 0, -500],
          rotate: [0, 0, -90],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      },
      on: {
        slideChangeTransitionStart: function () {
          const activeSlide = this.slides[this.activeIndex];
          if (!activeSlide) return;

          // 1. Tags Staggered Slide-in
          const tags = activeSlide.querySelectorAll(".solutions__tag");
          gsap.fromTo(tags,
            { opacity: 0, x: 30, skewX: -20 },
            { opacity: 1, x: 0, skewX: 0, duration: 0.8, stagger: 0.1, ease: "power4.out", delay: 0.4 }
          );

          // 2. Small Images Rotation + Rise
          const subThumbs = activeSlide.querySelectorAll(".solutions__sub-thumb");
          gsap.fromTo(subThumbs,
            { opacity: 0, scale: 0.5, rotation: -45, y: 50 },
            { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 1, stagger: 0.2, ease: "expo.out", delay: 0.2 }
          );

          // 3. Contact Button Fade + Up
          const contactBtn = activeSlide.querySelector(".btn-main-secondary");
          if (contactBtn) {
            gsap.fromTo(contactBtn,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1 }
            );
          }

          // 4. Main Thumb Diagonal Reveal
          const mainThumb = activeSlide.querySelector(".solutions__main-thumb");
          if (mainThumb) {
            gsap.fromTo(mainThumb,
              { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", scale: 1.3 },
              { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", scale: 1, duration: 1.5, ease: "expo.inOut" }
            );
          }
        }
      }
    });
  }






  // ### PROJECTS ANIMATION ###
  if (document.querySelectorAll(".projects").length > 0) {
    // Section Header Animation
    gsap.from(".projects__header", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".projects",
        start: "top 80%",
      }
    });

    // Slider Entrance Animation (Desktop)
    mm.add("(min-width: 1200px)", () => {
      const slides = gsap.utils.toArray(".projects__slider .swiper-slide");

      // Left Content Overlay & First Slide
      gsap.from(".projects__content--left", {
        x: -150,
        opacity: 0,
        rotation: -5,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".projects",
          start: "top 70%",
        }
      });
      if (slides[0]) {
        gsap.from(slides[0], {
          x: -150,
          opacity: 0,
          rotation: -5,
          skewX: -5,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".projects",
            start: "top 70%",
          }
        });
      }

      // Center Slide (Main Highlight)
      if (slides[1]) {
        gsap.from(slides[1], {
          scale: 0.7,
          opacity: 0,
          duration: 1.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".projects",
            start: "top 70%",
          }
        });
      }

      // Right Content Overlay & Third Slide
      gsap.from(".projects__content--right", {
        x: 150,
        opacity: 0,
        rotation: 5,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".projects",
          start: "top 70%",
        }
      });
      if (slides[2]) {
        gsap.from(slides[2], {
          x: 150,
          opacity: 0,
          rotation: 5,
          skewX: 5,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".projects",
            start: "top 70%",
          }
        });
      }
    });

    // Project Card Reveal Animation
    gsap.utils.toArray(".projects__item").forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      });
    });

    // Hover Parallax Effect for Cards
    const cards = document.querySelectorAll(".projects__item");
    cards.forEach(card => {
      const img = card.querySelector("img");

      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      card.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to(img, {
          x: x * 30, // Increased movement for better parallax
          y: y * 30,
          scale: 1.15,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(img, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      });
    });
  }



  // Image Reveal Animation
  let img_anim_reveal = document.querySelectorAll(".img_anim_reveal");

  img_anim_reveal.forEach((img_reveal) => {
    let image = img_reveal.querySelector("img");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: img_reveal,
        start: "top 50%",
      }
    });

    tl.set(img_reveal, { autoAlpha: 1 });
    tl.from(img_reveal, 1.5, {
      yPercent: -100,
      ease: Power2.out
    });
    tl.from(image, 1.5, {
      yPercent: 100,
      scale: 1.3,
      delay: -1.5,
      ease: Power2.out
    });
  });


  // ### CONTACT SECTION ANIMATION ###
  if (document.querySelector(".contact")) {
    gsap.from(".contact", {
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".contact",
        start: "top 80%",
      }
    });

    gsap.to(".contact__shape", {
      y: -50,
      duration: 2,
      ease: "none",
      scrollTrigger: {
        trigger: ".contact",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.from([".contact__subtitle-wrap", ".contact__contact-info", ".contact__btn-wrap"], {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".contact__content",
        start: "top 70%",
      }
    });
  }



  // stacking item with header
  if (document.querySelectorAll(".header-stacking-items").length > 0) {
    mm.add("(min-width: 991px)", () => {
      const items = gsap.utils.toArray(".item");

      items.forEach((item, i) => {
        const content = item.querySelector(".body");
        const header = item.querySelector(".header");
        gsap.to(content, {
          height: 0,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top " + header.clientHeight * i,
            endTrigger: ".final",
            end: "top " + header.clientHeight * items.length,
            pin: true,
            pinSpacing: false,
            scrub: true,
          }
        });
      });
    });
  }




  // stacking item with scale
  if (document.querySelectorAll(".pin-panel").length > 0) {
    mm.add("(min-width: 991px)", () => {
      let tl = gsap.timeline();
      let scaleItem = document.querySelectorAll('.pin-panel')

      scaleItem.forEach((item, index) => {

        gsap.set(scaleItem, {
          scale: 1
        });

        tl.to(item, {
          scale: .8,
          scrollTrigger: {
            trigger: item,
            pin: item,
            scrub: 1,
            start: 'top 10%',
            end: "bottom 90%",
            endTrigger: '.footer1',
            pinSpacing: false,
            markers: false,
          },
        })
      })
    });
  }


  // hover move btn 
  const all_btn = gsap.utils.toArray(".btn-move");
  const all_btn_cirlce = gsap.utils.toArray(".btn-item");

  all_btn.forEach((btn, i) => {
    $(btn).mousemove(function (e) {
      callParallax(e);
    });
    function callParallax(e) {
      parallaxIt(e, all_btn_cirlce[i], 80);
    }

    function parallaxIt(e, target, movement) {
      var $this = $(btn);
      var relX = e.pageX - $this.offset().left;
      var relY = e.pageY - $this.offset().top;

      gsap.to(target, 0.3, {
        x: ((relX - $this.width() / 2) / $this.width()) * movement,
        y: ((relY - $this.height() / 2) / $this.height()) * movement,
        scale: 1.1,
        ease: Power2.easeOut,
      });
    }
    $(btn).mouseleave(function (e) {
      gsap.to(all_btn_cirlce[i], 0.3, {
        x: 0,
        y: 0,
        scale: 1,
        ease: Power2.easeOut,
      });
    });
  });



  // GSAP Fade Animation 
  let fadeArray_items = document.querySelectorAll(".fade-anim");
  if (fadeArray_items.length > 0) {
    const fadeArray = gsap.utils.toArray(".fade-anim")
    // gsap.set(fadeArray, {opacity:0})
    fadeArray.forEach((item, i) => {

      var fade_direction = "bottom"
      var onscroll_value = 1
      var duration_value = 1.15
      var fade_offset = 50
      var delay_value = 0.15
      var ease_value = "power2.out"

      if (item.getAttribute("data-offset")) {
        fade_offset = item.getAttribute("data-offset");
      }
      if (item.getAttribute("data-duration")) {
        duration_value = item.getAttribute("data-duration");
      }

      if (item.getAttribute("data-direction")) {
        fade_direction = item.getAttribute("data-direction");
      }
      if (item.getAttribute("data-on-scroll")) {
        onscroll_value = item.getAttribute("data-on-scroll");
      }
      if (item.getAttribute("data-delay")) {
        delay_value = item.getAttribute("data-delay");
      }
      if (item.getAttribute("data-ease")) {
        ease_value = item.getAttribute("data-ease");
      }

      let animation_settings = {
        opacity: 0,
        ease: ease_value,
        duration: duration_value,
        delay: delay_value,
      }

      if (fade_direction == "top") {
        animation_settings['y'] = -fade_offset
      }
      if (fade_direction == "left") {
        animation_settings['x'] = -fade_offset;
      }

      if (fade_direction == "bottom") {
        animation_settings['y'] = fade_offset;
      }

      if (fade_direction == "right") {
        animation_settings['x'] = fade_offset;
      }

      if (onscroll_value == 1) {
        animation_settings['scrollTrigger'] = {
          trigger: item,
          start: 'top 85%',
        }
      }
      gsap.from(item, animation_settings);
    })
  }


  /////////////////////////////////////////////////////
  let text_animation = gsap.utils.toArray(".move-anim");

  if (text_animation) {
    text_animation.forEach(splitTextLine => {
      var delay_value = 0.1
      if (splitTextLine.getAttribute("data-delay")) {
        delay_value = splitTextLine.getAttribute("data-delay");
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 85%',
          duration: 1,
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitText(splitTextLine, {
        type: "lines"
      });
      gsap.set(splitTextLine, {
        perspective: 400
      });
      itemSplitted.split({
        type: "lines"
      })
      tl.from(itemSplitted.lines, {
        duration: 1,
        delay: delay_value,
        opacity: 0,
        rotationX: -80,
        force3D: true,
        transformOrigin: "top center -50",
        stagger: 0.1
      });
    });
  }

  // Animation Word
  let animation_word_anim_items = document.querySelectorAll(".word-anim");

  animation_word_anim_items.forEach((word_anim_item) => {

    var stagger_value = 0.04
    var translateX_value = false
    var translateY_value = false
    var onscroll_value = 1
    var data_delay = 0.1
    var data_duration = 0.75

    if (word_anim_item.getAttribute("data-stagger")) {
      stagger_value = word_anim_item.getAttribute("data-stagger");
    }
    if (word_anim_item.getAttribute("data-translateX")) {
      translateX_value = word_anim_item.getAttribute("data-translateX");
    }

    if (word_anim_item.getAttribute("data-translateY")) {
      translateY_value = word_anim_item.getAttribute("data-translateY");
    }

    if (word_anim_item.getAttribute("data-on-scroll")) {
      onscroll_value = word_anim_item.getAttribute("data-on-scroll");
    }
    if (word_anim_item.getAttribute("data-delay")) {
      data_delay = word_anim_item.getAttribute("data-delay");
    }
    if (word_anim_item.getAttribute("data-duration")) {
      data_duration = word_anim_item.getAttribute("data-duration");
    }

    if (onscroll_value == 1) {
      if (translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: data_duration,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value,
          delay: data_delay,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (translateY_value && !translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (translateY_value && translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 90%'
          }
        });
      }

      if (!translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: 20,
          autoAlpha: 0,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: word_anim_item,
            start: 'top 85%',
          }
        });
      }
    } else {
      if (translateX_value > 0 && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (translateY_value > 0 && !translateX_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (translateY_value > 0 && translateX_value > 0) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          y: translateY_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

      if (!translateX_value && !translateY_value) {
        let split_word = new SplitText(word_anim_item, {
          type: "chars, words"
        })
        gsap.from(split_word.words, {
          duration: 1,
          delay: data_delay,
          x: 20,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }

    }

  });


  // Animation Character
  var animation_char_come_items = document.querySelectorAll(".char-anim")
  animation_char_come_items.forEach((item) => {

    var stagger_value = 0.05
    var translateX_value = 20
    var translateY_value = false
    var onscroll_value = 1
    var data_delay = 0.1
    var data_duration = 1
    var ease_value = "power2.out"

    if (item.getAttribute("data-stagger")) {
      stagger_value = item.getAttribute("data-stagger");
    }
    if (item.getAttribute("data-translateX")) {
      translateX_value = item.getAttribute("data-translateX");
    }
    if (item.getAttribute("data-translateY")) {
      translateY_value = item.getAttribute("data-translateY");
    }
    if (item.getAttribute("data-on-scroll")) {
      onscroll_value = item.getAttribute("data-on-scroll");
    }
    if (item.getAttribute("data-delay")) {
      data_delay = item.getAttribute("data-delay");
    }
    if (item.getAttribute("data-ease")) {
      ease_value = item.getAttribute("data-ease");
    }
    if (item.getAttribute("data-duration")) {
      data_duration = item.getAttribute("data-duration");
    }

    if (onscroll_value == 1) {
      if (translateX_value > 0 && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: data_duration,
          delay: data_delay,
          x: translateX_value,
          autoAlpha: 0,
          stagger: stagger_value,
          ease: ease_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (translateY_value > 0 && !translateX_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: data_duration,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (translateX_value && translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 2,
          delay: data_delay,
          y: translateY_value,
          x: translateX_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
      if (!translateX_value && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          x: 50,
          autoAlpha: 0,
          stagger: stagger_value,
          ease: ease_value,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        });
      }
    } else {
      if (translateX_value > 0 && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          x: translateX_value,
          ease: ease_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
      if (translateY_value > 0 && !translateX_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          autoAlpha: 0,
          ease: ease_value,
          stagger: stagger_value
        });
      }
      if (translateX_value && translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          y: translateY_value,
          x: translateX_value,
          ease: ease_value,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
      if (!translateX_value && !translateY_value) {
        let split_char = new SplitText(item, {
          type: "chars, words"
        });
        gsap.from(split_char.chars, {
          duration: 1,
          delay: data_delay,
          ease: ease_value,
          x: 50,
          autoAlpha: 0,
          stagger: stagger_value
        });
      }
    }

  });


  // typewritter text 
  if (document.querySelectorAll(".typewriter-text").length > 0) {

    typing(0, $('.typewriter-text').data('text'));

    function typing(index, text) {

      var textIndex = 1;

      var tmp = setInterval(function () {
        if (textIndex < text[index].length + 1) {
          $('.typewriter-text').text(text[index].substr(0, textIndex));
          textIndex++;
        } else {
          setTimeout(function () { deleting(index, text) }, 2000);
          clearInterval(tmp);
        }

      }, 150);

    }

    function deleting(index, text) {

      var textIndex = text[index].length;

      var tmp = setInterval(function () {

        if (textIndex + 1 > 0) {
          $('.typewriter-text').text(text[index].substr(0, textIndex));
          textIndex--;
        } else {
          index++;
          if (index == text.length) { index = 0; }
          typing(index, text);
          clearInterval(tmp);
        }

      }, 150)

    }
  }

  // button effect
  var mouse = { x: 0, y: 0 };
  var pos = { x: 0, y: 0 };
  var ratio = 0.65;
  var active = false;

  var allParalax = document.querySelectorAll('.parallax-wrap');

  allParalax.forEach(function (e) {
    e.addEventListener("mousemove", mouseMoveBtn);
  })

  function mouseMoveBtn(e) {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    mouse.x = e.pageX;
    mouse.y = e.pageY - scrollTop;

  }
  gsap.ticker.add(updatePosition);

  $(".parallax-wrap").mouseenter(function (e) {
    gsap.to(this, { duration: 0.3, scale: 2 });
    gsap.to($(this).children(), { duration: 0.3, scale: 0.5 });
    active = true;
  });

  $(".parallax-wrap").mouseleave(function (e) {
    gsap.to(this, { duration: 0.3, scale: 1 });
    gsap.to($(this).children(), { duration: 0.3, scale: 1, x: 0, y: 0 });
    active = false;
  });

  function updatePosition() {
    pos.x += (mouse.x - pos.x) * ratio;
    pos.y += (mouse.y - pos.y) * ratio;

  }


  $(".parallax-wrap").mousemove(function (e) {
    parallaxCursorBtn(e, this, 2);
    callParallaxBtn(e, this);
  });

  function callParallaxBtn(e, parent) {
    parallaxItBtn(e, parent, parent.querySelector(".parallax-element"), 20);
  }

  function parallaxItBtn(e, parent, target, movement) {
    var boundingRect = parent.getBoundingClientRect();
    var relX = e.pageX - boundingRect.left;
    var relY = e.pageY - boundingRect.top;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    gsap.to(target, {
      duration: 0.3,
      x: (relX - boundingRect.width / 2) / boundingRect.width * movement,
      y: (relY - boundingRect.height / 2 - scrollTop) / boundingRect.height * movement,
      ease: Power2.easeOut
    });
  }

  function parallaxCursorBtn(e, parent, movement) {
    var rect = parent.getBoundingClientRect();
    var relX = e.pageX - rect.left;
    var relY = e.pageY - rect.top;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
    pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2 - scrollTop) / movement;
  }

  // Pin Active
  var pin_fixed = document.querySelector('.pin-element');
  if (pin_fixed && device_width > 991) {

    gsap.to(".pin-element", {
      scrollTrigger: {
        trigger: ".pin-area",
        pin: ".pin-element",
        start: "top top",
        end: "bottom bottom",
        pinSpacing: false,
      }
    });
  }



  // Image Cliping Effect
  document.addEventListener("DOMContentLoaded", () => {
    const initialClipPaths = [
      "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      "polygon(33.33% 0%, 33.33% 0%, 33.33% 0%, 33.33% 0%)",
      "polygon(65.66% 0%, 66.66% 0%, 66.66% 0%, 66.66% 0%)",
      "polygon(0% 33.33%, 0% 33.33%, 0% 33.33%, 0% 33.33%)",
      "polygon(33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%, 33.33% 33.33%)",
      "polygon(65.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%, 66.66% 33.33%)",
      "polygon(0% 66.66%, 0% 66.66%, 0% 66.66%, 0% 66.66%)",
      "polygon(33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%, 66.66% 66.66%)"
    ];
    const finalClipPaths = [
      "polygon(0% 0%, 34.33% 0%, 34.33% 34.33%, 0% 34.33%)",
      "polygon(32.33% 0%, 66.66% 0%, 66.66% 33.33%, 33.33% 34.33%)",
      "polygon(65.66% 0%, 100% 0%, 100% 33.33%, 65.66% 34.33%)",
      "polygon(0% 33.33%, 33.33% 33.33%, 33.33% 66.66%, 0% 66.66%)",
      "polygon(30.33% 33.33%, 66.66% 33.33%, 66.66% 66.66%, 33.33% 66.66%)",
      "polygon(65.66% 33.33%, 100% 32.33%, 100% 66.66%, 65.66% 66.66%)",
      "polygon(0% 65.66%, 33.33% 66.66%, 33.33% 100%, 0% 100%)",
      "polygon(30.33% 66.66%, 66.66% 65.66%, 66.66% 100%, 33.33% 100%)",
      "polygon(65.66% 66.66%, 100% 65.66%, 100% 100%, 65.66% 100%)"
    ];
    // Create mask divs for each wrapper
    document.querySelectorAll(".tw-clip-anim").forEach(wrapper => {
      const img = wrapper.querySelector(".tw-anim-img[data-animate='true']");
      if (!img) return;
      const url = img.src;
      // Remove old masks if any (reuse safe)
      wrapper.querySelectorAll(".mask").forEach(m => m.remove());
      for (let i = 0; i < 9; i++) {
        const mask = document.createElement("div");
        mask.className = `mask mask-${i + 1}`;
        Object.assign(mask.style, {
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "absolute",
          inset: "0"
        });
        wrapper.appendChild(mask);
      }
    });
    // Animate masks
    gsap.utils.toArray(".tw-clip-anim").forEach(wrapper => {
      const masks = wrapper.querySelectorAll(".mask");
      if (!masks.length) return;
      gsap.set(masks, { clipPath: (i) => initialClipPaths[i] });
      const order = [
        [".mask-1"],
        [".mask-2", ".mask-4"],
        [".mask-3", ".mask-5", ".mask-7"],
        [".mask-6", ".mask-8"],
        [".mask-9"]
      ];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 75%" }
      });
      order.forEach((targets, i) => {
        const validTargets = targets
          .map(c => wrapper.querySelector(c))
          .filter(el => el); // filter out nulls

        if (validTargets.length) {
          tl.to(validTargets, {
            clipPath: (j, el) => finalClipPaths[Array.from(masks).indexOf(el)],
            duration: 1,
            ease: "power4.out",
            stagger: 0.1
          }, i * 0.125);
        }
      });
    });
  })

  // Parallax Effect for Buttons
  function parallaxEffect() {
    $(document).on("mousemove", ".parallax-wrap", function (e) {
      const wrapper = $(this);
      const target = wrapper.find(".parallax-target");
      const rect = wrapper[0].getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;

      gsap.to(target, {
        x: deltaX * 0.4,
        y: deltaY * 0.4,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    $(document).on("mouseleave", ".parallax-wrap", function () {
      const target = $(this).find(".parallax-target");
      gsap.to(target, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    });
  }
  parallaxEffect();

  // ### CONTACT MOUSE PARALLAX ###
  // ### GSAP PLUGINS REGISTRATION ###
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  // ### SCROLL SMOOTHER ###
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1,
  });

  // ### MAGNETIC CHARACTERS ###
  function magneticCharacters() {
    const titles = document.querySelectorAll('.section-top__title');

    titles.forEach(title => {
      const chars = title.querySelectorAll('.char-item');

      title.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = title.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        chars.forEach(char => {
          const charRect = char.getBoundingClientRect();
          const charCenterX = charRect.left + charRect.width / 2;
          const charCenterY = charRect.top + charRect.height / 2;

          const distX = clientX - charCenterX;
          const distY = clientY - charCenterY;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < 200) {
            gsap.to(char, {
              x: distX * 0.1,
              y: distY * 0.1,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
      });

      title.addEventListener('mouseleave', () => {
        gsap.to(chars, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      });
    });
  }
  // Wait for SplitText to finish in textRevealAnimations before calling this
  setTimeout(magneticCharacters, 500);

  // ### IMAGE MOUSE PARALLAX ###
  function imageMouseParallax() {
    const items = document.querySelectorAll('.projects__item, .solutions__main-thumb, .contact__shape');

    items.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;

      item.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = item.getBoundingClientRect();
        const x = (clientX - left - width / 2) * 0.05;
        const y = (clientY - top - height / 2) * 0.05;

        gsap.to(img, {
          x: x,
          y: y,
          duration: 0.6,
          ease: "power2.out"
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
      });
    });
  }
  imageMouseParallax();

  // ### TEXT REVEAL ANIMATIONS ###
  function textRevealAnimations() {
    // 1. Split Titles into Characters
    const titles = document.querySelectorAll('.section-top__title');
    titles.forEach(title => {
      const splitTitle = new SplitText(title, { type: "chars, words", charsClass: "char-item" });

      gsap.from(splitTitle.chars, {
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 80,
        rotateX: -90,
        stagger: 0.02,
        duration: 1.2,
        ease: "power4.out"
      });
    });

    // 2. Split Subtitles into Words
    const subtitles = document.querySelectorAll('.section-top__subtitle');
    subtitles.forEach(sub => {
      const splitSub = new SplitText(sub, { type: "words" });

      gsap.from(splitSub.words, {
        scrollTrigger: {
          trigger: sub,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
  textRevealAnimations();

  function contactMouseParallax() {
    const contactSection = document.querySelector('.contact');
    if (!contactSection) return;

    contactSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const shapes = contactSection.querySelectorAll('.contact__shape-wrap .contact__shape--1, .contact__bg-shape');

      shapes.forEach((shape, i) => {
        const factor = (i + 1) * 30;
        const x = (clientX - innerWidth / 2) / factor;
        const y = (clientY - innerHeight / 2) / factor;
        gsap.to(shape, { x, y, duration: 1, ease: "power2.out" });
      });
    });

    contactSection.addEventListener('mouseleave', () => {
      const shapes = contactSection.querySelectorAll('.contact__shape-wrap .contact__shape--1, .contact__bg-shape');
      gsap.to(shapes, { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
    });
  }
  contactMouseParallax();

  // ### CONTACT CONTINUOUS FLOATING & GLOW ###
  // ### GLOBAL SCROLL REVEALS ###
  function globalScrollReveals() {
    // 1. Solutions Slider Entrance
    let mm = gsap.matchMedia();

    mm.add("(max-width: 991px)", () => {
      // Mobile Entrance: Liquid Wipe + Staggered Fade
      gsap.from(".solutions__slider", {
        scrollTrigger: {
          trigger: ".solutions",
          start: "top 80%",
        },
        clipPath: "inset(0 0 100% 0)",
        y: -30,
        scale: 0,
        rotateX: -50,
        duration: 1.5,
        ease: "power4.inOut"
      });
    });

    mm.add("(min-width: 992px)", () => {
      // Desktop Entrance: Scale + Subtle Rotation
      gsap.from(".solutions__slider", {
        scrollTrigger: {
          trigger: ".solutions",
          start: "top 75%",
        },
        scale: 0.95,
        rotateX: -5,
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out"
      });
    });

    // 3. Contact Content Reveal
    const contactContent = document.querySelector(".contact__content");
    if (contactContent) {
      // Only animate info and button wrap to avoid conflict with section-top title reveal
      const revealItems = contactContent.querySelectorAll(".contact__contact-info, .contact__btn-wrap");

      let contactMM = gsap.matchMedia();

      contactMM.add("(max-width: 991px)", () => {
        // Mobile: Immediate visibility or very fast fade
        gsap.from(revealItems, {
          scrollTrigger: {
            trigger: contactContent,
            start: "top 95%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all"
        });
      });

      contactMM.add("(min-width: 992px)", () => {
        // Desktop: Smooth Staggered Reveal
        gsap.from(revealItems, {
          scrollTrigger: {
            trigger: contactContent,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out"
        });
      });
    }
  }
  globalScrollReveals();

  // ### CONTACT CONTINUOUS FLOATING & GLOW ###
  function contactContinuousAnim() {
    // Floating Shapes
    gsap.utils.toArray(".contact__shape").forEach((shape, i) => {
      gsap.to(shape, {
        y: "+=20",
        x: "+=10",
        rotation: i % 2 === 0 ? 5 : -5,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Glow Animation
    gsap.to(".contact__shape-blur", {
      opacity: 0.8,
      scale: 1.1,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
  contactContinuousAnim();

  // ### BACKGROUND ANIMATION ###
  function backgroundAnimation() {
    const blobs = document.querySelectorAll('.bg-blob');
    if (blobs.length > 0) {
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: "random(-15, 15)vw",
          y: "random(-15, 15)vh",
          scale: "random(0.8, 1.2)",
          duration: 10 + i * 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
    }

    // Falling Droplets on Lines
    const droplets = document.querySelectorAll('.bg-line__droplet');
    if (droplets.length > 0) {
      droplets.forEach((droplet, i) => {
        // Randomize speed and delay for organic feel
        const duration = 1.5 + Math.random() * 3.5;
        const delay = Math.random() * 8;

        gsap.to(droplet, {
          top: "110%", // Fall slightly beyond the bottom
          duration: duration,
          delay: delay,
          repeat: -1,
          ease: "none",
          onRepeat: () => {
            // Optional: Slight variations on each loop
            gsap.set(droplet, { opacity: 0.3 + Math.random() * 0.7 });
          }
        });
      });
    }
  }
  backgroundAnimation();

  // ### MAGNETIC BUTTONS ###
  function magneticButtons() {
    const magneticItems = document.querySelectorAll('.btn-main-primary, .btn-main-secondary, .projects__view-btn, .swiper-button-prev, .swiper-button-next');
    const follower = document.querySelector(".mouse-follower");
    const outline = document.querySelector(".mouse-follower .cursor-outline");

    magneticItems.forEach(item => {
      item.addEventListener('mousemove', function (e) {
        const position = item.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        gsap.to(item, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.5,
          ease: "power2.out"
        });

        // Sticky Outline Effect
        if (outline) {
          gsap.to(outline, {
            left: position.left + position.width / 2,
            top: position.top + position.height / 2,
            width: position.width + 20,
            height: position.height + 20,
            borderRadius: "100px", // Rounded sticky look
            duration: 0.4,
            ease: "power3.out"
          });
          follower.classList.add("cursor-sticky");
        }
      });

      item.addEventListener('mouseleave', function () {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        });

        if (outline) {
          follower.classList.remove("cursor-sticky");
          gsap.to(outline, {
            width: 40,
            height: 40,
            borderRadius: "50%",
            duration: 0.4
          });
        }
      });
    });
  }
  magneticButtons();

  // ### MOUSE FOLLOWER ###
  function mouseFollower() {
    const follower = document.querySelector(".mouse-follower");
    const outline = document.querySelector(".mouse-follower .cursor-outline");
    const dot = document.querySelector(".mouse-follower .cursor-dot");
    const arrow = document.querySelector(".mouse-follower .cursor-arrow");
    if (!follower || !outline || !dot || !arrow) return;

    // Enable arrow mode by default
    follower.classList.add("arrow-mode");

    // Use quickTo for high performance
    const xDot = gsap.quickTo(dot, "left", { duration: 0.2, ease: "power3" });
    const yDot = gsap.quickTo(dot, "top", { duration: 0.2, ease: "power3" });
    const xOutline = gsap.quickTo(outline, "left", { duration: 0.6, ease: "power3" });
    const yOutline = gsap.quickTo(outline, "top", { duration: 0.6, ease: "power3" });
    const xArrow = gsap.quickTo(arrow, "left", { duration: 0.1, ease: "none" });
    const yArrow = gsap.quickTo(arrow, "top", { duration: 0.1, ease: "none" });

    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      xDot(mouseX);
      yDot(mouseY);
      xArrow(mouseX);
      yArrow(mouseY);

      // Only follow if not stuck to a magnetic button
      if (!follower.classList.contains("cursor-sticky")) {
        xOutline(mouseX);
        yOutline(mouseY);
      }

      // Rotation logic
      const angle = Math.atan2(mouseY - prevY, mouseX - prevX) * (180 / Math.PI);
      const movement = Math.sqrt(Math.pow(mouseX - prevX, 2) + Math.pow(mouseY - prevY, 2));

      if (movement > 2) {
        gsap.to(arrow, { rotation: angle + 45, duration: 0.2 });
      }

      prevX = mouseX;
      prevY = mouseY;
    });

    // Hover state for links and buttons
    const links = document.querySelectorAll("a, button, .btn-main, .btn-main-primary, .btn-main-secondary, .swiper-button-prev, .swiper-button-next");
    links.forEach(link => {
      link.addEventListener("mouseenter", () => follower.classList.add("link-hover"));
      link.addEventListener("mouseleave", () => follower.classList.remove("link-hover"));
    });

    // Magnify on headings
    document.querySelectorAll(".section-top__title, h1, h2").forEach(h => {
      h.addEventListener("mouseenter", () => follower.classList.add("highlight-cursor-head"));
      h.addEventListener("mouseleave", () => follower.classList.remove("highlight-cursor-head"));
    });

    // Highlight on paragraphs
    document.querySelectorAll("p, .section-top__subtitle").forEach(p => {
      p.addEventListener("mouseenter", () => follower.classList.add("highlight-cursor-para"));
      p.addEventListener("mouseleave", () => follower.classList.remove("highlight-cursor-para"));
    });

    // Hide when mouse leaves window
    document.addEventListener("mouseleave", () => follower.classList.add("hide-cursor"));
    document.addEventListener("mouseenter", () => follower.classList.remove("hide-cursor"));
  }
  mouseFollower();

  // ### BACK TO TOP PROGRESS ###
  function backToTopProgress() {
    const progressPath = document.querySelector('.progress-wrap path');
    if (!progressPath) return;

    const pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

    const updateProgress = function () {
      const scroll = $(window).scrollTop();
      const height = $(document).height() - $(window).height();
      const progress = pathLength - (scroll * pathLength / height);
      progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);

    const offset = 50;
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > offset) {
        $('.progress-wrap').addClass('active-progress');
      } else {
        $('.progress-wrap').removeClass('active-progress');
      }
    });

    $('.progress-wrap').on('click', function (event) {
      event.preventDefault();
      gsap.to(window, { scrollTo: 0, duration: 1.5, ease: "power4.inOut" });
      return false;
    });
  }
  backToTopProgress();


})(jQuery);
