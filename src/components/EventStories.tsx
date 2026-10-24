import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { EventStory } from '../types';
import { OFFICIAL_STORIES, SELECTA_BASE_BRAND_POSTER } from '../data/mockEvents';
import { useTicketContext } from '../context/TicketContext';
import { 
  X, 
  Play, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

const PHOTO_DURATION_MS = 5000;

export const EventStories: React.FC = () => {
  const { activeStoryId, setActiveStoryId } = useTicketContext();
  const [activeStory, setActiveStory] = useState<EventStory | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Playback & progress states
  const [progress, setProgress] = useState(0); // 0 to 100 for current slide
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // Video element reference
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Refs for tracking pause status across animation frames
  const pausedRef = useRef(false);
  pausedRef.current = isPaused;

  // Pointer & press-and-hold interaction refs
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);

  // Synchronize when activeStoryId changes from context
  useEffect(() => {
    if (activeStoryId) {
      const match = OFFICIAL_STORIES.find(s => s.id === activeStoryId);
      if (match) {
        setActiveStory(match);
        setCurrentSlideIndex(0);
        setProgress(0);
      }
    }
  }, [activeStoryId]);

  // Lock body scroll while Story viewer is open
  useEffect(() => {
    if (activeStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeStory]);

  const handleOpenStory = (story: EventStory) => {
    setActiveStory(story);
    setActiveStoryId(story.id);
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
  };

  const handleCloseStory = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (err) {}
    }
    setActiveStory(null);
    setActiveStoryId(null);
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
    setIsVideoPlaying(false);
  };

  const handleNextSlide = () => {
    if (!activeStory) return;
    if (currentSlideIndex < activeStory.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Last item in the Story sequence finishes -> close viewer
      handleCloseStory();
    }
  };

  const handlePrevSlide = () => {
    if (!activeStory) return;
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      // Restart current item
      setProgress(0);
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
        } catch (e) {}
      }
    }
  };

  // Video playback setup & reset on slide change
  useEffect(() => {
    setProgress(0);
    setIsVideoPlaying(false);
    setIsAutoplayBlocked(false);

    if (!activeStory) return;
    const slide = activeStory.slides[currentSlideIndex];
    if (!slide) return;

    if (slide.isVideo && videoRef.current) {
      try {
        if (videoRef.current.readyState >= 1) {
          videoRef.current.currentTime = 0;
        }
      } catch (e) {}

      // Autoplay muted by default
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            setIsAutoplayBlocked(false);
          })
          .catch(() => {
            setIsVideoPlaying(false);
            setIsAutoplayBlocked(true);
          });
      }
    }
  }, [activeStory, currentSlideIndex]);

  // Handle play/pause toggling when user holds or releases
  useEffect(() => {
    if (!activeStory) return;
    const slide = activeStory.slides[currentSlideIndex];

    if (slide?.isVideo && videoRef.current) {
      if (isPaused) {
        try {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } catch (e) {}
      } else {
        try {
          videoRef.current.play().then(() => {
            setIsVideoPlaying(true);
            setIsAutoplayBlocked(false);
          }).catch(() => {
            setIsAutoplayBlocked(true);
          });
        } catch (e) {}
      }
    }
  }, [isPaused, activeStory, currentSlideIndex]);

  // Automatic Timer for Photo Slides (smooth 60fps RAF loop)
  useEffect(() => {
    if (!activeStory) return;
    const slide = activeStory.slides[currentSlideIndex];
    if (!slide || slide.isVideo) return;

    let elapsed = 0;
    let lastTime = performance.now();
    let rafId: number;

    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!pausedRef.current) {
        elapsed += dt;
        const currentPct = Math.min(100, (elapsed / PHOTO_DURATION_MS) * 100);
        setProgress(currentPct);

        if (elapsed >= PHOTO_DURATION_MS) {
          // Timer finished -> advance automatically
          if (currentSlideIndex < activeStory.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
          } else {
            handleCloseStory();
          }
          return;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [activeStory, currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeStory) return;
      if (e.key === 'Escape') {
        handleCloseStory();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      }
    };

    if (activeStory) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeStory, currentSlideIndex]);

  // Pointer handlers: Press-and-hold pause + Tap to skip/rewind + Swipe down to close
  const handlePointerDown = (e: React.PointerEvent) => {
    pressStartPosRef.current = { x: e.clientX, y: e.clientY };
    isLongPressRef.current = false;

    // Detect hold after 220ms
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsPaused(true);
    }, 220);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    if (isLongPressRef.current) {
      // Releasing after a long press -> unpause without skipping
      setIsPaused(false);
      isLongPressRef.current = false;
      pressStartPosRef.current = null;
      return;
    }

    // Check for swipe gesture
    if (pressStartPosRef.current) {
      const deltaY = e.clientY - pressStartPosRef.current.y;
      const deltaX = e.clientX - pressStartPosRef.current.x;

      // Swipe down to close (> 55px down)
      if (deltaY > 55 && Math.abs(deltaY) > Math.abs(deltaX) * 1.4) {
        handleCloseStory();
        pressStartPosRef.current = null;
        return;
      }

      // Horizontal swipe
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          handleNextSlide();
        } else {
          handlePrevSlide();
        }
        pressStartPosRef.current = null;
        return;
      }
    }

    // Quick Tap: Left 35% returns to previous; Right 65% advances to next
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width * 0.35;

    if (isLeft) {
      handlePrevSlide();
    } else {
      handleNextSlide();
    }

    pressStartPosRef.current = null;
  };

  const handlePointerCancel = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPaused(false);
    isLongPressRef.current = false;
    pressStartPosRef.current = null;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleManualVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.play().then(() => {
      setIsVideoPlaying(true);
      setIsAutoplayBlocked(false);
    }).catch(() => {});
  };

  const currentSlide = activeStory?.slides[currentSlideIndex];

  return (
    <>
      {/* 1. Signature Selekta Base Stories Strip on Home Screen (Preserved) */}
      <div className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2 px-1">
        {OFFICIAL_STORIES.map(story => {
          const isUpcoming = !story.isPastArchive;

          return (
            <button
              key={story.id}
              onClick={() => handleOpenStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group text-center active:scale-95 transition-transform duration-200 cursor-pointer"
            >
              {/* Distinctive Ring: Upcoming Emerald Breathing Glow vs. Archive Champagne/Sage */}
              <div 
                className={`w-[66px] h-[66px] rounded-full p-[2.5px] transition-all duration-300 relative ${
                  isUpcoming 
                    ? 'story-ring-upcoming' 
                    : 'story-ring-archive'
                }`}
              >
                {/* Second Softer Inner Ring Separation for Layered Depth */}
                <div className="w-full h-full rounded-full p-[2px] bg-[#F7F5F0] ring-1 ring-black/5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#EAE6DD] relative">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
                      }}
                    />
                    {story.isPastArchive && (
                      <div className="absolute inset-0 bg-[#20231F]/10" />
                    )}

                    {/* Subtle Emerald Accent for Archive */}
                    {story.isPastArchive && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#20C982]/85 ring-1 ring-white/90" />
                    )}

                    {/* Video indicator badge */}
                    {story.hasVideo && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#20C982] text-white flex items-center justify-center shadow-xs">
                        <Play className="w-2 h-2 fill-white ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Status Label */}
              <div className="space-y-0.5 w-[74px] flex flex-col items-center">
                <span className="block text-[11px] font-extrabold text-[#20231F] truncate w-full leading-tight group-hover:text-[#20C982] transition-colors">
                  {story.title}
                </span>

                <span 
                  className={`inline-block text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border leading-none ${
                    isUpcoming
                      ? 'bg-[#E8F9F2] text-[#128E5B] border-[#20C982]/30'
                      : 'bg-[#EAE5DB] text-[#636A61] border-[#DDD6C8]'
                  }`}
                >
                  {story.statusLabel || (story.isPastArchive ? 'ARCHIVE' : 'COMING SOON')}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. PURE FULL-SCREEN SOCIAL MEDIA STORY VIEWER (Instagram / WhatsApp Status Style) */}
      {activeStory && currentSlide && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-fade-in"
          style={{ touchAction: 'none' }}
        >
          {/* Top Overlaid Header: Segmented Progress Bars + Profile Thumbnail & Title + Controls */}
          <div className="absolute top-0 inset-x-0 z-30 pointer-events-none bg-gradient-to-b from-black/85 via-black/40 to-transparent pt-3.5 pb-8 px-3.5 flex flex-col gap-2.5">
            {/* Segmented Progress Bars along the top */}
            <div className="flex gap-1.5 w-full">
              {activeStory.slides.map((_, idx) => {
                let fillWidth = '0%';
                if (idx < currentSlideIndex) {
                  fillWidth = '100%';
                } else if (idx === currentSlideIndex) {
                  fillWidth = `${progress}%`;
                }

                return (
                  <div 
                    key={idx} 
                    className="h-1 flex-1 rounded-full bg-white/35 overflow-hidden backdrop-blur-xs"
                  >
                    <div 
                      className="h-full bg-white rounded-full transition-none"
                      style={{ width: fillWidth }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Event Avatar, Title & Action Controls */}
            <div className="flex items-center justify-between text-white pointer-events-auto pt-0.5">
              {/* Profile / Event Header */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 shrink-0 bg-neutral-900">
                  <img 
                    src={activeStory.coverImage} 
                    alt={activeStory.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
                    }}
                  />
                </div>
                <div className="min-w-0 flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white truncate drop-shadow-md">
                    {activeStory.title}
                  </span>
                  <span className="text-[10px] text-white/70 font-medium truncate drop-shadow-md">
                    • {activeStory.statusLabel || (activeStory.isPastArchive ? 'Archive' : 'Upcoming')}
                  </span>
                </div>
              </div>

              {/* Top Controls: Mute/Unmute (if video) + Close Button */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {currentSlide.isVideo && (
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20 active:scale-95"
                    title={isMuted ? "Unmute audio" : "Mute audio"}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-[#20C982]" />}
                  </button>
                )}

                <button
                  onClick={handleCloseStory}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20 active:scale-95"
                  aria-label="Close story"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>
          </div>

          {/* Full-Screen Media Container (Zero Cropping, Object-Fit: Contain, Dark Background) */}
          <div 
            className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center bg-black overflow-hidden pointer-events-auto"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerCancel}
          >
            {/* If Video Slide */}
            {currentSlide.isVideo && currentSlide.videoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center min-w-0 min-h-0 overflow-hidden">
                {/* Official Poster Image rendered behind video so screen is never black */}
                <img
                  src={currentSlide.posterUrl || currentSlide.imageUrl}
                  alt={activeStory.title}
                  className="w-full h-full max-h-full max-w-full object-contain object-center absolute inset-0 select-none pointer-events-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
                  }}
                />

                {/* Video Element */}
                <video
                  ref={videoRef}
                  src={currentSlide.videoUrl}
                  poster={currentSlide.posterUrl || currentSlide.imageUrl}
                  playsInline
                  preload="auto"
                  muted={isMuted}
                  onTimeUpdate={() => {
                    if (videoRef.current && videoRef.current.duration) {
                      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                      setProgress(pct);
                    }
                  }}
                  onEnded={() => {
                    setProgress(100);
                    handleNextSlide();
                  }}
                  onError={() => {
                    console.warn('Video failed to load, keeping poster visible');
                    setIsAutoplayBlocked(true);
                  }}
                  className="w-full h-full max-h-full max-w-full object-contain object-center absolute inset-0 select-none pointer-events-none"
                />

                {/* Center Play Button if autoplay was blocked by browser */}
                {isAutoplayBlocked && !isVideoPlaying && (
                  <button
                    onClick={handleManualVideoPlay}
                    className="absolute z-20 w-16 h-16 rounded-full bg-black/75 hover:bg-[#20C982] text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95 border border-white/20 shadow-2xl cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </button>
                )}
              </div>
            ) : (
              /* Photo Slide */
              <div className="relative w-full h-full flex items-center justify-center min-w-0 min-h-0 overflow-hidden">
                <img
                  key={currentSlide.imageUrl}
                  src={currentSlide.imageUrl}
                  alt={activeStory.title}
                  className="w-full h-full max-h-full max-w-full object-contain object-center select-none pointer-events-none"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = SELECTA_BASE_BRAND_POSTER;
                  }}
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
