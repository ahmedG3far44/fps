"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface MovieItem {
  id: number
  name: string
  preview: string
  data: { max: string }
}

interface MovieCarouselProps {
  movies: MovieItem[]
  clip?: { video: string; preview: string } | null
}

function VideoPlayer({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)

  const toggle = useCallback(() => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
      setShowOverlay(false)
    } else {
      v.pause()
      setPlaying(false)
      setShowOverlay(true)
    }
  }, [])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const onPause = () => { setPlaying(false); setShowOverlay(true) }
    const onPlay = () => { setPlaying(false); setShowOverlay(false) }
    v.addEventListener("pause", onPause)
    v.addEventListener("play", onPlay)
    v.addEventListener("ended", onPause)
    return () => {
      v.removeEventListener("pause", onPause)
      v.removeEventListener("play", onPlay)
      v.removeEventListener("ended", onPause)
    }
  }, [])

  return (
    <div className="relative group">
      <video
        ref={ref}
        src={src}
        controls
        poster={poster}
        className="w-full aspect-video"
      />
      <button
        onClick={toggle}
        className="absolute inset-0 flex items-center justify-center z-10
          transition-opacity duration-200"
        style={{ opacity: showOverlay && !playing ? 1 : 0 }}
        aria-label={playing ? "Pause" : "Play"}
      >
        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center
          transition-transform duration-200 group-hover:scale-110">
          <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </button>
    </div>
  )
}

export function MovieCarousel({ movies, clip }: MovieCarouselProps) {
  const items = [
    ...(clip?.video ? [{ id: -1, name: "Clip", preview: clip.preview, video: clip.video }] : []),
    ...movies.map((m) => ({ id: m.id, name: m.name, preview: m.preview, video: m.data.max })),
  ]

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1)
    setCurrent(i)
  }, [current])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1))
  }, [items.length])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1))
  }, [items.length])

  if (items.length === 0) return null

  return (
    <div className="relative">
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </>
      )}

      <div className="overflow-hidden rounded-xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={items[current].id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <VideoPlayer src={items[current].video} poster={items[current].preview} />
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2.5 w-6 bg-primary shadow-[0_0_6px] shadow-primary/60"
                  : "h-2 w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to trailer ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
