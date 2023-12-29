const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center gap-1 h-[20px] text-gray-500 dark:text-[#D1D5D8]">
      <p className={`animate-blink rounded-full bg-current`} style={{width: '3px', height: '3px', animationDelay: '0s'}}/>
      <p className={`animate-blink rounded-full bg-current`} style={{width: '3px', height: '3px', animationDelay: '0.2s'}}/>
      <p className={`animate-blink rounded-full bg-current`} style={{width: '3px', height: '3px', animationDelay: '0.3s'}}/>
    </div>
  )
}

export default LoadingDots
