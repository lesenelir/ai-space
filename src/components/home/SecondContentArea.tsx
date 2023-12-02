import PlansCard from '@/components/home/PlansCard'

export default function SecondContentArea() {
  return (
    <div className={'min-h-[70vh] lg:px-32 px-8 py-4 max-sm:px-4 bg-fuchsia-800'}>
      <div className={'border mt-12'}/>

      <h1 className={'text-5xl font-semibold text-white my-6'}>Plans</h1>

      {/* Content */}
      <div className={'flex flex-row gap-4 justify-between'}>
        {/* Left */}
        <PlansCard main={'free'} price={'$0 / month'} buttonText={'Try on Web'} />

        {/* Right */}
        <PlansCard main={'plus'} price={'$ Credit'} buttonText={'Get Started'} />
      </div>
    </div>
  )
}
