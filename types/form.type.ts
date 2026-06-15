export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    fullName: string;
    age: number;
    phoneNumber: string;
    address: {
        street: string;
        city: string;
        country: string;
        zipCode: string;
    };
    newsletter: boolean;
    termsAccepted: boolean;
}

export interface FormFieldProps {
    name: keyof RegisterFormData | string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export type formStatus = 'idle' | 'submitting' | 'success' | 'error';