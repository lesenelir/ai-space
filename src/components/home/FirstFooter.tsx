import Typewriter, { TypewriterClass } from 'typewriter-effect'

export default function FirstFooter() {
  return (
    <>
      <footer className={'md:px-32 px-8 max-sm:px-4 pb-16 h-44'}>
        <Typewriter
          options={{
            delay: 10,
            cursor: '',
            cursorClassName: 'Typewriter__cursor--circle',
          }}
          onInit={(typewriter: TypewriterClass) => {
            typewriter
              .typeString(`<span class='text-lg'>AI Space: </span>`)
              .typeString(`<span>A collection of art and code works about AI, inspired by OpenAI and ChatKit.</span>`)
              .typeString('<br/>')
              .typeString(`<span>This project includes: ChatGPT and DALL-E.</span>`)
              .callFunction(() => {
                // hidden cursor when typing complete
                const cursorElement = document.querySelector('.Typewriter__cursor--circle')
                cursorElement && cursorElement.remove()
              })
              .start()
          }}
        />
        <div className={'flex flex-row'}>
          <p className={'mt-4 underline underline-offset-4 cursor-pointer hover:text-opacity-30'}>
            <a href={'https://github.com/lesenelir'} target={'_blank'} rel={'noopener noreferrer'}>
              Find the author
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
