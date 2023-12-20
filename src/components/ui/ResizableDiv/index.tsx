import { useAtom } from 'jotai'
import React, { ReactNode, useRef, useState, useEffect, useCallback } from 'react'

import { resizableWidthAtom } from '@/atoms'

interface IProps {
  children: ReactNode
  minWidth?: number
  maxWidth?: number
  className?: string
}

export default function ResizableDiv({
  minWidth = 280,
  maxWidth = 520,
  children,
  className,
}: IProps) {
  const [width, setWidth] = useAtom(resizableWidthAtom)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    startXRef.current = mouseDownEvent.clientX
    startWidthRef.current = ref.current?.offsetWidth || 0
    setIsResizing(true)
  }, [])

  // component-update render
  useEffect(() => {
    const doResize = (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const currentX = mouseMoveEvent.clientX
        const newWidth = startWidthRef.current + currentX - startXRef.current

        const newValidWidth = Math.max(Math.min(newWidth, maxWidth), minWidth)
        setWidth(newValidWidth)
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
  }, [isResizing, maxWidth, minWidth, setWidth])

  // When the screen is less than 768px, the menu width is fixed at 280px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth(280)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWidth])

  return (
    <div
      ref={ref}
      style={{width: `${width}px`}}
      className={`relative ${className}`}
    >
      {children}
      <span
        className={`
          absolute top-0 right-0 z-10 w-1 h-full 
          cursor-ew-resize active:border-r-4 active:border-r-blue-500
        `}
        onMouseDown={startResizing}
      />
    </div>
  )
}
