import Select from '@/components/ui/Select'

export default function HeaderContent() {
  return (
    <div className={'w-full h-[66px] p-3 border-b flex justify-between items-center'}>
      {/* left icon */}
      <div>
        <Select
          width={`w-36`}
          options={[
            { value: 'GPT-3.5 Turbo', label: 'GPT-3.5 Turbo' },
            { value: 'GPT-4 Turbo', label: 'GPT-4 Turbo' },
            { value: 'Baidu Model', label: 'Baidu Model' },
          ]}
          className={'text-black'}
        />
      </div>

      {/* right icon */}
      <div className={'flex flex-row gap-4'}>
        <p>hello</p>
        <p>ss</p>
      </div>
    </div>
  )
}
