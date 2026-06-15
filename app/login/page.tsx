'use client';

import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email formate'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

type LogingFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null> (null);

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch
    } = useForm<LogingFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const rememberMe = watch('rememberMe');

   

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if(savedEmail) {
            setValue('email', savedEmail);
            setValue('rememberMe', true);
        }
    }, [setValue]);

    const onSubmit = async(data : LogingFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
             const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                  'content-Type' : 'application/json'
              },
                  body: JSON.stringify({
                  email: data.email,
                  password: data.password
              })
          })
            const result = await response.json();

            if(!response.ok) {
                setError(result.error)
                return;
            }

             if(data.rememberMe) {
                localStorage.setItem('rememberedEmail', data.email);
             } else {
                localStorage.removeItem('rememberedEmail');
             }

             localStorage.setItem('authToken', 'mock-token-' + Date.now());
             localStorage.setItem('user', JSON.stringify(result.user));

             const expiryDate = new Date();
             expiryDate.setDate(expiryDate.getDate() + (data.rememberMe ? 7 : 1));
             localStorage.setItem('sessionExpiry', expiryDate.toISOString());

             window.dispatchEvent(new Event('authChange'));

             router.push('/dashboard');
        } catch(err) {
            setError('Login failed. please try again.');
            console.error('Login Error: ', err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
             initial={{ opacity: 0, y: 20}}
             animate={{ opacity: 1, y: 0}}
             transition={{ duration: 0.5 }}
             className="max-w-md w-full bg-gray-300/10 backdrop-blur-xs rounded-lg" >
                <div className="shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {error && (
                        <motion.div
                        initial = {{ opacity:0, x: -20}}
                        animate = {{ opacity: 1, x: 0}}
                        className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500 rounded-lg text-sm">
                          {error}
                          {error.includes('register') && (
                            <Link href='/register' className="ml-2 text-blue-400 hover:underline">
                              Register hare
                            </Link>
                          )}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input 
                                    {...register('email')}
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-text
                                               ${errors.email ? 'border-red-500' : ''}`}    />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Password
                                </label>
                                <input 
                                    {...register('password')}
                                    type="password"
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-text
                                               ${errors.password ? 'border-red-500' : ''}`} />
                                  {errors.password && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.password.message}
                                </p>
                             )}
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                    {...register('rememberMe')}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-50 border-gray-600"  />
                                    <span className="text-sm text-gray-300">Remember me</span>
                                </label>
                                <Link href='/forgot-password' 
                                  className="text-sm text-blue-400 hover:text-blur-300 hover:underline"
                                >Forgot password?</Link>
                            </div>

                            <button
                             type= 'submit'
                             disabled={isLoading}
                             className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-colors"
                             >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Signin in...</span>
                                    </div>
                                ) : ('Sign In')}

                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account? {' '}
                        <Link href='/register' className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">
                        Sign up
                        </Link>
                    </p>
                </div>
                </div>
             </motion.div>
        </div>
    )
} 