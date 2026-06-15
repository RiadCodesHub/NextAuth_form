'use client'

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const forgotPassword = () => {
  
const router = useRouter();
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const [resetToken, setResetToken] = useState('');
const [showToken, setShowToken] = useState(false);

const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try{
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(
      '/api/forgot-password',
        {
        method: 'Post',
        headers: {
            'Content-Type' : 'application.json'
        },
        body: JSON.stringify({
            email
          })
            }
              );

         const data = await response.json();

         if(!response.ok) {
         setError(data.error);
         return
         }
         setResetToken(data.token);
         setShowToken(true);
         
        setResetToken(data.token);
        setShowToken(true);

        console.log('Reset token for:', email, resetToken);
    } catch(error) {
       setError('Something went wrong. Please try again.');
    } finally {
        setIsLoading(false);
    }
}

if(showToken) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
            initial= {{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1}}
            className='max-w-md w-full'
            >
             <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Token Generated!</h2>
              <p className="text-white/70 mb-4">
                Use the token below to reset your password
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-white/60 mb-2">Your Reset Token:</p>
              <code className="text-2xl font-mono font-bold text-blue-400 block text-center">
                {resetToken}
              </code>
            </div>
             <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-400">
                ⚠️ Token will expire in 1 hour. Copy this token now!
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href={`/resetPassword?token=${resetToken}&email=${encodeURIComponent(email)}`}
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-center">
                    Proced to Reset Password →
                </Link>
            <button 
            onClick={() => {
                navigator.clipboard.writeText(resetToken);
                alert('Token copied to clipboard');
            }}
              className='block w-full bg-white/10 text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/20 transition'
            >📋 Copy Token</button>
            </div>

            </div>
            </motion.div>
        </div>
    )
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
         initial = {{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0}}
         transition={{ duration: 0.5 }}
         className='max-w-md w-full'
        >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-white/70">
                    Enter your email address and we'll send you a link to reset your password
                    </p>
                </div>

                {success ? (
                    <motion.div 
                     initial= {{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className='text-center'
                    >
                        <div className="mb-4 p-4 bg-green-500/20 rounded-lg">
                        <p className="text-green-400">
                            Password reset link has been sent to your email!
                        </p>
                        <p className="text-white/60 text-sm mt-2">
                        Chack your email the reset link.
                         </p>
                        </div>

                        <Link href='/login' 
                             className='inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
                        >Back To Login</Link>

                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-sm text-red-400">
                                 {error}
                            </div>
                        )}

                    <div>
                        <label className="block text-sm font-medium text-white/80">Email Address</label>
                         <input type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='you@example.com'
                                required
                                className='w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 
                                           outline-none transition text-white placeholder::text-white/50'
                                />
                    </div>
                    <button 
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:semibold
                               hover:bg-blue-700 transition disabled:opacity-50'
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Sending...</span>
                            </div>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <div className="text-center">
                        <Link href='/login' className='text-sm text-white/ hover:text-blue-300'>Back to Login</Link>
                    </div>
                    </form>
                )}
            </div>

        </motion.div>
    </div>
  )
}

export default forgotPassword