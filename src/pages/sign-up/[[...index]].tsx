import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className={'h-screen flex justify-center items-center'}>
      <SignUp/>
    </div>
  )
}
