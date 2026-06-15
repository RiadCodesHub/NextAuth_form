'use client';

import { Span } from "next/dist/trace";
import { UseFormRegister, FieldError, Path, FieldValues } from "react-hook-form";
import { number } from "zod";

interface FormInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string; 
}

const FormInput = <T extends FieldValues>({
    label,
    name,
    register,
    error,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    className = '',
}: FormInputProps<T>) => {
  return (
    <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-offwhite mb-1 text-start">
           {label}
           {required && <span className="ml-1 text-error">*</span>}
        </label>
         <input 
            type={type}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name, { valueAsNumber: type === 'number'})}
            className={`w-full px-3 text-sm py-2 border bg-gray-50 border-border rounded-md shadow-sm text-text focus:outline-none focus:ring-blue-500 *
                       focus:border-blue-500
                       ${error ? 'border-red-500' : 'border-border'}
                       ${disabled ? 'cursor-not-allowed' : ''}
                       ${className}
                       `}
            />
        {error && (
            <p className="mt-1 text-sm text-red-600 text-start">{error.message}</p>
        )}
    </div>
  )
}

export default FormInput