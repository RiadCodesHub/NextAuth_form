'use client'

import { useState } from "react";
import {useForm, SubmitHandler} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/src/lib/schema/register.schema";
import FormInput from "./FormInput";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import Link from "next/link";

const RegisterForm = () => {
 
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
      register,
      handleSubmit,
      formState: {errors, isDirty, isValid},
      reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password : '',
      confirmPassword: '',
      userName: '',
      fullName: '',
      age: undefined,
      phoneNumber: '',
      address: {
        street : '',
        city: '',
        country: '',
        zipCode: '',
      },
      newsLetter: false,
      termsAccepted: false,
    },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
       throw new Error (result.error || result.message || 'Registration failed');  
      } 
      
      localStorage.setItem('authToken','mock-jwt-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(result.user));

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      localStorage.setItem('sessionExpiry', expiryDate.toISOString());

      window.dispatchEvent(new Event('authChange'));

      router.push('/dashboard');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
      <motion.div
       initial= {{ opacity: 0, y: -20}}
       animate= {{ opacity: 1, y: 0}}
       transition={{ duration: 0.5}}
      >
      <h2 className="text-2xl font-bold text-white">Create an account</h2>

      <div className="grid mt-10 grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
            label="Email Address"
            name="email"
            register={register}
            error={errors.email}
            type="email"
            placeholder="jhon@example.com"
            required
            />

        <FormInput
            label="Username"
            name="userName"
            register={register}
            error={errors.userName}
            placeholder="jhon@12"
            required
            />
       <FormInput
            label="Full Name"
            name="fullName"
            register={register}
            error={errors.fullName}
            placeholder="Jhon Duo"
            required
            />
       <FormInput
            label="Age"
            name="age"
            register={register}
            error={errors.age}
            type="number"
            placeholder="25"
            required
            />
       <FormInput
            label="Phone Number"
            name="phoneNumber"
            register={register}
            error={errors.phoneNumber}
            type="tel"
            placeholder="017********"
            required
            />

      <FormInput
          label="Password"
          name="password"
          register={register}
          error={errors.password}
          type="password"
          placeholder="********"
          required
        />
      
      <FormInput
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          type="password"
          placeholder="********"
          required
        />
      </div>
  

      <div className="border-t border-white pt-4 mt-6">
        <h3 className="text-lg text-white font-medium mb-4">Address Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Street Address"
            name="address.street"
            register={register}
            error={errors.address?.street}
            placeholder="123 Main St"
            required
            />

        <FormInput
            label="City"
            name="address.city"
            register={register}
            error={errors.address?.city}
            placeholder="New York"
            required
          />
        
        <FormInput
            label="Country"
            name="address.country"
            register={register}
            error={errors.address?.country}
            placeholder="USA"
            required
          />
        
        <FormInput
            label="ZIP Code"
            name="address.zipCode"
            register={register}
            error={errors.address?.zipCode}
            placeholder="10001"
            required
          />
        </div>
      </div>

    <div className="space-y-3 mt-4">
      <label className="flex items-center space-x-3">
        <input type="checkbox"
            {...register(`newsLetter`)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span className="text-sm text-white">
          Subscribe to our newslatter
        </span>
      </label>

      <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-white">
            I accept the terms and conditions *
          </span>
      </label>
      {errors.termsAccepted && (
          <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
        )}
     
     <div className="flex gap-4 items-center justify-center mt-4">
      <button
      type="submit"
      disabled={!isDirty || !isValid || isSubmitting}
      className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors">
       {isSubmitting ? "Submitting..." : "Register"}
      </button>

      <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>
     </div>
     {serverError && (
           <div className="my-2 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
             {serverError}
           </div>)}

     <span className="text-white text-md mt-4">Already have an account? <Link href='/login' className="text-blue-500 text-lg hover:text-blue-600 underline">login</Link></span>

    </div>

    </motion.div>
    </form>
  )
}

export default RegisterForm