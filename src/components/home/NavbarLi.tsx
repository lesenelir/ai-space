interface IProps {
  text: string
}

export default function NavbarLi(props: IProps) {
  const { text } = props

  return (
    <li
      className={`
        flex flex-row items-center cursor-pointer 
        hover:underline hover:underline-offset-4
      `}
    >
      {text}
    </li>
  )
}
