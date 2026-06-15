import { Metadata } from "next"
import RegisterForm from '@/src/components/forms/RegisterForm';

export const metadata : Metadata = {
    title: 'Register | Create Account ',
    description: 'Create a new account to get started',
}

const RegisterPage = () => {
  return (
    <div className="max-w-full min-w-sm w-2xl my-20  p-10 m-auto bg-gray-300/10 rounded-md backdrop-blur-xs">
        <RegisterForm />
    </div>
  )
}

export default RegisterPage