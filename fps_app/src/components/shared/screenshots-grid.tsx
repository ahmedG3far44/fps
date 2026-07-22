"use client"

import { useState, useCallback, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface ScreenshotItem {
  id: number
  image: string
}

interface ScreenshotsGridProps {
  screenshots: ScreenshotItem[]
}

export function ScreenshotsGrid({ screenshots }: ScreenshotsGridProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const currentIdx = selected !== null ? screenshots.findIndex((s) => s.id === selected) : -1

  const open = useCallback((id: number) => setSelected(id), [])
  const close = useCallback(() => setSelected(null), [])

  const goNext = useCallback(() => {
    if (currentIdx < screenshots.length - 1) setSelected(screenshots[currentIdx + 1].id)
  }, [currentIdx, screenshots])

  const goPrev = useCallback(() => {
    if (currentIdx > 0) setSelected(screenshots[currentIdx - 1].id)
  }, [currentIdx, screenshots])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selected === null) return
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selected, close, goNext, goPrev])

  if (screenshots.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {screenshots.slice(0, 8).map((s) => (
          <button
            key={s.id}
            onClick={() => open(s.id)}
            className="rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
          >
            <img
              src={s.image}
              alt=""
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close() }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {currentIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}

            {currentIdx < screenshots.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}

            <motion.div
              key={selected}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh]"
            >
              <img
                src={screenshots.find((s) => s.id === selected)?.image ?? ""}
                alt=""
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>

            <div className="absolute bottom-4 text-white/60 text-sm">
              {currentIdx + 1} / {screenshots.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
