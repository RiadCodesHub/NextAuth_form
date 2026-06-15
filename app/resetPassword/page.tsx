'use client';

import { useState, useEffect} from 'react';
import { useRouter, useSearchParams} from 'next/navigation';
import Link from "next/link";
import { motion } from 'framer-motion';
import {useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { passwordSchema } from '@/src/lib/schema/register.schema';


const resetPasswordSchema = z.object({
  password : passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password don't match",
  path: ["confirmPassword"],
})

type resetPasswordData = z.infer<typeof resetPasswordSchema>;

const page = () => {

const router = useRouter();
const searchParams = useSearchParams();
const urlToken = searchParams.get('token');
const urlEmail = searchParams.get('email');

const [email, setEmail] = useState('');
const [token, setToken] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState(false);

const {
  register, 
  handleSubmit,
  formState: { errors },
  watch
} = useForm<resetPasswordData>({
  resolver: zodResolver(resetPasswordSchema),
  defaultValues: {
    password: '',
    confirmPassword: '',
  },
});
 
 useEffect(() => {
    if(urlToken && urlEmail) {
        setToken(urlToken);
        setEmail(decodeURIComponent(urlEmail));
    } else if(!urlToken && !urlEmail) {
      setError('Invalid reset link. Please request a new password reset.')
    }
 }, [urlToken, urlEmail]);
 
const onSubmit = async (data: resetPasswordData) => {
  setIsLoading(true);
  setError(null);

  try {

    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        token,
        password: data.password
      })
    });

    const result = await response.json();

    if(!response.ok) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    setError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

 if(success) {
   return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
         <motion.div
         initial= {{ opacity: 0, scale: 0.95}}
         animate={{ opacity: 1, scale: 1}}
         className='max-w-md w-full'
         >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
             <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-white/70 mb-4">
              Your password has been updated successfully.
            </p>
            <p className="text-white/60 text-sm">
              Redirecting you to login...
            </p>
            </div>
         </motion.div>
      </div>
   );
 }

 if(!token || !email) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        className='max-w-md w-full'
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-white/70">
            This password reset link is invalid or has expired</p>
          </div>
          <Link href='/forgot-password'>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition">
            Request New Reset Link
          </button>
          </Link>
        </div>

      </motion.div>
    </div>
  )
 }

  return (
   <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
       initial = {{ opacity: 0, y: 20 }}
       animate = {{ opacity: 1, y: 0}}
       transition= {{ duration: 0.5}}
       className='max-w-md w-full'
      >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Password
          </h1>
          <p className="text-white">Please enter your new password</p>
        </div>

        {error && (
            <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity:1, x:0 }}
            className="mb-3 p-3 bg-red-500/10 rounded-lg text-sm text-red-400">
               {error}
            </motion.div>
          )}

         <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
          <label className='block text-sm font-medium text-white/80 mb-1'>
          New Password
          </label>

          <input type="password"
                 {...register('password')}
                 placeholder='Enter your new password'
                 required
                 className={`w-full px-4 py-2 bg-white/10 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-white placeholder:text-white/50
                             ${errors.password ? 'border-red-50' : ''}`}
                 />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
          )}
          </div>
          
          <div>
          <label className='block text-sm font-medium text-white/80 mb-1'>
          Confirm New Password
          </label>

          <input type="password"
                 {...register('confirmPassword')}
                 placeholder='Confirm your new password'
                 required
                 className={`w-full px-4 py-2 bg-white/10 border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-white placeholder:text-white/50
                             ${errors.password ? 'border-red-50' : ''}`}
                 />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>
          )}
          </div>

          <button
          type='submit'
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
            {isLoading  ? 
             (<div className="flex items-center justify-center gap-2">
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <span>Resetting...</span>
             </div>) : 'Reset Password'   
         }
          </button>
         </form>
        
      </div>
      </motion.div>
   </div>
  )
}

export default page