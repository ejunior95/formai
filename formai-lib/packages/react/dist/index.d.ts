import { type FormAIConfig } from '@formai/core';
interface UseAIFormReturn {
    value: string;
    setValue: (value: string) => void;
    error: string | null;
    validate: () => void;
    loading: boolean;
    config: FormAIConfig | null;
}
export declare function useAIForm(userPrompt: string): UseAIFormReturn;
export {};
