import Link from 'next/link'

interface IProps {
  text: string
  href?: string
  className?: string
}

export default function NavbarLi(props: IProps) {
  const { text, href, className } = props

  return (
    <li
      className={`
        flex flex-row items-center cursor-pointer
        hover:underline hover:underline-offset-4 ${className}
      `}
    >
      {href ? (
        <Link href={href}>
          {text}
        </Link>
      ) : (
        <p>{text}</p>
      )}
    </li>
  )
}
