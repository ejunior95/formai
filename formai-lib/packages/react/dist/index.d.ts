import { type FormAIConfig, type FormAIOptions } from '@ejunior95/formai-core';
interface UseAIFormReturn {
    value: string;
    setValue: (value: string) => void;
    error: string | null;
    validate: () => void;
    loading: boolean;
    config: FormAIConfig | null;
}
export declare function useAIForm(userPrompt: string, options?: FormAIOptions): UseAIFormReturn;
export {};
