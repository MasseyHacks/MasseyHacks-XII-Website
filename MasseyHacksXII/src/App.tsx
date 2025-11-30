import { useEffect, useState, useRef } from 'react';
import { Fish, Calendar, ChevronDown, Mail, Instagram, Twitter, Youtube, Facebook, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sponsorshipProspectus from './files/Sponsorship Prospectus MHXII.pdf';
import transparencyReport from './files/transparency-report.pdf';

gsap.registerPlugin(ScrollTrigger);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  zIndex: number;
}

interface FishItem {
  id: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [logoPopped, setLogoPopped] = useState<boolean>(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [fish, setFish] = useState<FishItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const carouselScrollRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const sponsorsRef = useRef<HTMLElement>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const imageSrcs = [
    new URL('./images/mhX1.webp', import.meta.url).href,
    new URL('./images/mhX2.webp', import.meta.url).href,
    new URL('./images/mhX4.webp', import.meta.url).href,
    new URL('./images/mhX5.webp', import.meta.url).href,
    new URL('./images/mhX7.webp', import.meta.url).href,
    new URL('./images/mhX8.webp', import.meta.url).href,
    new URL('./images/mhX9.webp', import.meta.url).href,
    new URL('./images/mhX10.webp', import.meta.url).href
  ];

  const faqs: FAQ[] = [
    { question: "How do I apply?", answer: "Applications will open for MasseyHacks XII in February!" },
    { question: "Does it cost anything to attend?", answer: "Nope, MasseyHacks is absolutely free to attend!" },
    { question: "Is MasseyHacks in-person or online?", answer: "MasseyHacks XII will be in-person. Hackers will not have the option to participate fully virtually as we return to a more traditional form of MasseyHacks. Unfortunately, we cannot provide overnight accommodation at the MasseyHacks venue, so hackers will be required to go home for the night and return in the morning." },
    { question: "Will food be provided?", answer: "Yes, meals and snacks will be provided free of cost. We will accommodate any food sensitivities to the best of our ability." },
    { question: "Do I need a team to participate?", answer: "You don't need to be in a team to participate in MasseyHacks! It's up to you whether you choose to fly solo or group up with your friends. And who knows: you might meet some cool new people during the event!" },
    { question: "Who can participate?", answer: "MasseyHacks welcomes students from grades 7-12." },
    { question: "Do I need programming experience to participate?", answer: "Not at all! At MasseyHacks, we'll teach you the fundamentals you need to know to make your project through beginner workshops and mentors who will assist you if you ever need any help." },
    { question: "How many people can I have on my team?", answer: "You can have as many as 4 people per team!" },
    { question: "Where is MasseyHacks being held?", answer: "MasseyHacks will be held at Vincent Massey Secondary School at 1800 Liberty St, Windsor, ON." },
    { question: "Will MasseyHacks run overnight?", answer: "Unfortunately, we cannot provide overnight accommodation at the MasseyHacks venue, so hackers will be required to leave the venue Saturday evening and return to the venue Sunday morning. However, we will still be providing mentorship and support for hackers throughout the night as they continue working on their projects." },
    { question: "What do I need to bring?", answer: "We recommend bringing: a piece of photo ID for check-in (e.g. student card, passport, or drivers license), your laptop, and laptop/phone chargers. Food, beverages, and the rest will all be provided! School computers will be available for use during the event, but we cannot guarantee one for everyone." },
    { question: "What activities and workshops will be hosted at MasseyHacks?", answer: "You can find the schedule on our website (coming soon)." }
  ];

  const carouselSlides = 8;

  useEffect(() => {
    const targetDate = new Date('May 9, 2026 00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newBubbles: Bubble[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
      zIndex: Math.random() > 0.5 ? 10 : 1
    }));
    setBubbles(newBubbles);

    const fishColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e2'];
    const newFish: FishItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      y: Math.random() * 90 + 5,
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 10,
      color: fishColors[Math.floor(Math.random() * fishColors.length)]
    }));
    setFish(newFish);

    const timer = setTimeout(() => {
      setLogoPopped(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const shouldAnimate = window.innerWidth >= 768;

      if (logoPopped && heroRef.current) {
        if (shouldAnimate) {
          gsap.from('.countdown-item', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
          });
        } else {
          gsap.set('.countdown-item', { opacity: 1, scale: 1 });
        }
      }

      if (aboutRef.current) {
        gsap.set('.about-card', { opacity: 1, y: 0 });
        if (shouldAnimate) {
          gsap.from('.about-card', {
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
          });
        }
      }

      if (faqRef.current) {
        gsap.set('.faq-item', { opacity: 1, x: 0 });
        if (shouldAnimate) {
          gsap.from('.faq-item', {
            scrollTrigger: {
              trigger: faqRef.current,
              start: 'top 80%',
            },
            x: -50,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      }

      if (sponsorsRef.current) {
        gsap.set('.sponsor-card', { opacity: 1, scale: 1 });
        if (shouldAnimate) {
          gsap.from('.sponsor-card', {
            scrollTrigger: {
              trigger: sponsorsRef.current,
              start: 'top 80%',
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)'
          });
        }
      }
    });

    return () => ctx.revert();
  }, [logoPopped]);

  // Auto-scroll carousel with pause on user interaction
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselScrollRef.current || isUserInteracting) return;

      const el = carouselScrollRef.current;
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth;
      const halfWidth = scrollWidth / 2;
      const currentScroll = el.scrollLeft;

      // Scroll by one image width for smoother progression
      const imageWidth = clientWidth * 0.35; // Approximate image width
      const target = currentScroll + imageWidth;
      el.scrollTo({ left: target, behavior: 'smooth' });

      // Reset scroll position for infinite loop
      setTimeout(() => {
        if (!carouselScrollRef.current) return;
        if (carouselScrollRef.current.scrollLeft >= halfWidth - clientWidth) {
          carouselScrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
        }
      }, 600);
    }, 3000);

    return () => clearInterval(interval);
  }, [isUserInteracting]);

  // Handle user interaction with carousel
  const handleCarouselInteraction = () => {
    setIsUserInteracting(true);
    
    // Clear existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    // Resume auto-scroll after 3 seconds of no interaction
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  const getBackgroundColor = () => {
    const colors = [
      { stop: 0, color: '#b2e0ffff' },
      { stop: 0.15, color: '#6cebffff' },
      { stop: 0.35, color: '#008199' },
      { stop: 0.5, color: '#21658d' },
      { stop: 0.65, color: '#2e4579' },
      { stop: 0.8, color: '#12306a' },
      { stop: 0.9, color: '#002332' },
      { stop: 1, color: '#00101e' }
    ];

    let gradientString = 'linear-gradient(to bottom, ';
    colors.forEach((c, i) => {
      gradientString += `${c.color} ${c.stop * 100}%`;
      if (i < colors.length - 1) gradientString += ', ';
    });
    gradientString += ')';

    return gradientString;
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: getBackgroundColor() }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cyan-500/10 backdrop-blur-md border-b border-cyan-400/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={new URL('./images/MHXIILOGO.PNG', import.meta.url).href} alt="MasseyHacks Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px] object-contain" />
            <span className="text-white font-bold text-base sm:text-lg md:text-2xl drop-shadow-lg">MasseyHacks</span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex gap-6 lg:gap-8">
            <a href="#about" className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-sm lg:text-base" data-testid="nav-about">About</a>
            <a href="#gallery" className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-sm lg:text-base" data-testid="nav-gallery">Gallery</a>
            <a href="#faq" className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-sm lg:text-base" data-testid="nav-faq">FAQ</a>
            <a href="#sponsors" className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-sm lg:text-base" data-testid="nav-sponsors">Sponsors</a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-4 bg-cyan-500/10 backdrop-blur-md flex flex-col gap-3">

            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-base py-2 hover:bg-white/10 px-3 rounded-lg"
              data-testid="mobile-nav-about"
            >
              About
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-base py-2 hover:bg-white/10 px-3 rounded-lg"
              data-testid="mobile-nav-gallery"
            >
              Gallery
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-base py-2 hover:bg-white/10 px-3 rounded-lg"
              data-testid="mobile-nav-faq"
            >
              FAQ
            </a>
            <a
              href="#sponsors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-cyan-200 transition-colors font-semibold drop-shadow-md text-base py-2 hover:bg-white/10 px-3 rounded-lg"
              data-testid="mobile-nav-sponsors"
            >
              Sponsors
            </a>
          </div>
        </div>
      </nav>

      {/* Background decorations - Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble absolute rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
            style={{
              left: `${bubble.x}%`,
              bottom: `-${bubble.size}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              zIndex: bubble.zIndex
            }}
          />
        ))}

        {/* Multi-colored Fish swimming horizontally */}
        {fish.map((fishItem) => (
          <div
            key={fishItem.id}
            className="fish absolute"
            style={{
              top: `${fishItem.y}%`,
              left: '-100px',
              animation: `swim ${fishItem.duration}s linear ${fishItem.delay}s infinite`,
              zIndex: 5
            }}
          >
            <Fish className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: fishItem.color, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
          </div>
        ))}
      </div>

      {/* Main Content Wrapper */}
      <main className="flex-1 relative" style={{ zIndex: 1 }}>
        {/* Hero Section */}
        <div ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
          <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
            {!logoPopped && (
              <div className="logo-bubble absolute inset-0 flex items-center justify-center">
                <div className="bubble-animation w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center" />
              </div>
            )}

            <div className={`logo-content transition-all duration-1000 ${logoPopped ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} w-full`}>
              <div className="mb-6 sm:mb-8 md:mb-12">
                <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-72 md:h-72 mx-auto rounded-full bg-white/0 backdrop-blur-sm border-4 border-white/50 flex items-center justify-center shadow-2xl">
  <img
    src={new URL('./images/MHXIILOGO.PNG', import.meta.url).href}
    className="w-32 sm:w-48 md:w-[260px] h-auto mx-auto object-contain"
  />
</div>




                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white text-center mt-4 sm:mt-6 md:mt-10 mb-2 sm:mb-3 drop-shadow-2xl px-2 sm:px-4" data-testid="hero-title">MasseyHacks XII</h1>
              </div>

              {/* Countdown */}
              <div className="bg-cyan-500/10 backdrop-blur-md rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 border border-white/30 mb-4 sm:mb-6 shadow-2xl w-full" data-testid="countdown-section">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-8 mb-3 sm:mb-4 md:mb-6">
                  <div className="countdown-item text-center" data-testid="countdown-days">
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">{timeLeft.days}</div>
                    <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider">Days</div>
                  </div>
                  <div className="countdown-item text-center" data-testid="countdown-hours">
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">{timeLeft.hours}</div>
                    <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider">Hours</div>
                  </div>
                  <div className="countdown-item text-center" data-testid="countdown-minutes">
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">{timeLeft.minutes}</div>
                    <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider">Minutes</div>
                  </div>
                  <div className="countdown-item text-center" data-testid="countdown-seconds">
                    <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">{timeLeft.seconds}</div>
                    <div className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider">Seconds</div>
                  </div>
                </div>
                <div className="text-center text-white text-xs xs:text-sm sm:text-base md:text-xl font-semibold drop-shadow-md px-2">
                  Applications open in February
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="relative py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 drop-shadow-lg" data-testid="about-title">About MasseyHacks</h2>
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:gap-8 justify-center place-items-center w-full max-w-4xl mx-auto">
              <div className="about-card bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-9 border border-white/20 hover:bg-white/15 shadow-lg hover:shadow-xl transition-all w-full" data-testid="about-card">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-cyan-300 mb-3 sm:mb-4 md:mb-5" />
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 drop-shadow-md">What is MasseyHacks?</h3>
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">
                  MasseyHacks is a high school hackathon perfect for students fascinated by the world of technology. This 24-hour event is an opportunity for students to explore the realm of computer science and bring their creative ideas to life by developing a project of their own. Never written a line of code in your life? Already created a robot to do your homework? No matter your skill level, we invite you to join us as a hacker to participate in workshops, engage in countless activities, and meet other like-minded students! Create memories and guide the story of your STEM journey at MasseyHacks XI!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section id="gallery" ref={carouselRef} className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16 drop-shadow-lg" data-testid="gallery-title">Gallery</h2>
            <div
              ref={carouselScrollRef}
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              data-testid="gallery-carousel"
              onScroll={handleCarouselInteraction}
              onMouseDown={handleCarouselInteraction}
              onTouchStart={handleCarouselInteraction}
            >
              {Array.from({ length: carouselSlides * 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[240px] h-[180px] xs:w-[280px] xs:h-[200px] sm:w-[350px] sm:h-[250px] md:w-[500px] md:h-[350px] lg:w-[600px] lg:h-[400px] bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20 overflow-hidden relative"
                  data-testid={`gallery-image-${i}`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <img src={imageSrcs[i % imageSrcs.length]} alt={`MasseyHacks gallery image ${(i % imageSrcs.length) + 1}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={faqRef} className="relative py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 drop-shadow-lg" data-testid="faq-title">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-start">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="faq-item bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 shadow-lg transition-all"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full text-left p-4 sm:p-5 md:p-6 lg:p-7 flex items-center justify-between gap-3"
                    data-testid={`faq-question-${index}`}
                  >
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-md pr-2">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === index ? 'max-h-[500px]' : 'max-h-0'
                    }`}
                  >
                    <p className="px-4 sm:px-5 md:px-6 lg:px-7 pb-4 sm:pb-5 md:pb-6 lg:pb-7 text-xs sm:text-sm md:text-base text-white/90 leading-relaxed" data-testid={`faq-answer-${index}`}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
      <section id="sponsors" ref={sponsorsRef} className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16 drop-shadow-lg" data-testid="sponsors-title">Become a Sponsor</h2>

          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/20 text-center">
            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-3 sm:mb-4">
              Interested in becoming a sponsor? Check out our <a href={sponsorshipProspectus} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors" data-testid="sponsorship-link">sponsorship prospectus</a>! Contact us at <a href="mailto:hello@masseyhacks.ca" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors break-all" data-testid="contact-email">hello@masseyhacks.ca</a>
            </p>
            <p className="text-white text-sm sm:text-base md:text-lg">
              The MasseyHacks XI <a href={transparencyReport} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors" data-testid="transparency-link">transparency report</a> is available here.
            </p>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur-lg border-t border-white/30 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 mt-auto" style={{ zIndex: 1 }} data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
            {/* Left Column - Event Info */}
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">MasseyHacks XII</h3>
              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">Vincent Massey Secondary School</p>
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">1800 Liberty St, Windsor,</p>
                <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed">ON N9E 1J2</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] xs:text-xs sm:text-sm text-white/70">Copyright © 2025 MasseyHacks</p>
                <p className="text-[10px] xs:text-xs sm:text-sm text-white/70">&lt;/&gt; made by the MasseyHacks Team with ❤️</p>
              </div>
            </div>

            {/* Middle Column - Links */}
            <div>
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">Quick Links</h3>
              <nav className="flex flex-col gap-2 sm:gap-3">
                <a href="#" className="text-white/90 hover:text-cyan-200 transition-colors font-medium text-sm sm:text-base md:text-lg hover:translate-x-1 inline-block transition-transform" data-testid="footer-link-home">Home</a>
                <a href="#about" className="text-white/90 hover:text-cyan-200 transition-colors font-medium text-sm sm:text-base md:text-lg hover:translate-x-1 inline-block transition-transform" data-testid="footer-link-about">About</a>
                <a href="#gallery" className="text-white/90 hover:text-cyan-200 transition-colors font-medium text-sm sm:text-base md:text-lg hover:translate-x-1 inline-block transition-transform" data-testid="footer-link-gallery">Gallery</a>
                <a href="#faq" className="text-white/90 hover:text-cyan-200 transition-colors font-medium text-sm sm:text-base md:text-lg hover:translate-x-1 inline-block transition-transform" data-testid="footer-link-faq">FAQ</a>
                <a href="#sponsors" className="text-white/90 hover:text-cyan-200 transition-colors font-medium text-sm sm:text-base md:text-lg hover:translate-x-1 inline-block transition-transform" data-testid="footer-link-sponsors">Sponsors</a>
              </nav>
            </div>

            {/* Right Column - Mailing List */}
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">Stay Connected</h3>
              <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-5 md:mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm md:text-base placeholder-white/50 focus:outline-none focus:border-cyan-300 focus:bg-white/15 transition-all"
                  data-testid="email-input"
                />
                <button className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-cyan-500/90 hover:bg-cyan-500 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all hover:shadow-lg whitespace-nowrap" data-testid="subscribe-button">
                  Subscribe
                </button>
              </div>

              {/* Social Icons */}
              <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-cyan-300 hover:scale-110 transition-all" data-testid="social-mail">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-cyan-300 hover:scale-110 transition-all" data-testid="social-instagram">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-cyan-300 hover:scale-110 transition-all" data-testid="social-twitter">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-cyan-300 hover:scale-110 transition-all" data-testid="social-youtube">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-cyan-300 hover:scale-110 transition-all" data-testid="social-facebook">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
              </div>

              <a href="#" className="text-xs sm:text-sm md:text-base text-white/90 hover:text-cyan-200 transition-colors font-medium underline underline-offset-4 hover:underline-offset-8 transition-all" data-testid="code-of-conduct">
                Code of Conduct
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;





