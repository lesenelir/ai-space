import React, { ReactNode, useRef, useState, useEffect, useCallback } from 'react'

interface IProps {
  initialWidth: number
  minPercentage: number
  maxPercentage: number
  children: ReactNode
  className?: string
}

export default function ResizableDiv({
  initialWidth = 320,
  minPercentage = 1 / 6,
  maxPercentage = 2 / 3,
  children,
  className,
}: IProps) {
  const [width, setWidth] = useState<number>(initialWidth)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = mouseDownEvent.clientX
    startWidthRef.current = ref.current?.offsetWidth || 0
    setIsResizing(true)
  }, [])

  // component-first render
  useEffect(() => {
    const saveWidth = localStorage.getItem('menuWidth')
    if (saveWidth) {
      setWidth(Number(saveWidth))
    }
  }, [])

  // component-update render
  useEffect(() => {
    const doResize = (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const currentX = mouseMoveEvent.clientX
        const newWidth = startWidthRef.current + currentX - startXRef.current

        const viewportWidth = window.innerWidth
        const min = viewportWidth * minPercentage
        const max = viewportWidth * maxPercentage

        const width = Math.min(Math.max(newWidth, min), max)
        localStorage.setItem('menuWidth', String(width))
        setWidth(width)
      }
    }

    const stopResizing = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      window.addEventListener('mousemove', doResize)
      window.addEventListener('mouseup', stopResizing)
    }

    return () => {
      window.removeEventListener('mousemove', doResize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, maxPercentage, minPercentage])

  return (
    <div
      ref={ref}
      style={{width: `${width}px`}}
      className={`cursor-ew-resize active:border-r-4 active:border-r-gray-400 ${className}`}
      onMouseDown={startResizing}
    >
      {children}
    </div>
  )
}
