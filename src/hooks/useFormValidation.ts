import { useCallback, useState } from "react";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";

export function useFormValidation<T extends FieldValues> () {
    const [isValidating, setIsValidating] = useState(false);

    const validateField = useCallback(async (
        form: UseFormReturn<T>,
        fieldName: Path<T>
    ) => {
        setIsValidating(true);
        try{
            await form.trigger(fieldName);
            return !form.formState.errors[fieldName];
        } finally {
            setIsValidating(false);
        }
    }, []);

    const validateAllFields = useCallback(async (form: UseFormReturn<T>) => {
        setIsValidating(true);
        try {
            const isValid = await form.trigger();
            return isValid;
        } finally {
            setIsValidating(false);
        }
    }, []);

    return {
        isValidating,
        validateField,
        validateAllFields,
    }
}