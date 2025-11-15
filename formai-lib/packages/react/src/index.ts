"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  getFieldConfig,
  validateValue,
  type FormAIConfig,
  type FormAIOptions
} from '@formai/core';

interface UseAIFormReturn {
  value: string;
  setValue: (value: string) => void;
  error: string | null;
  validate: () => void;
  loading: boolean;
  config: FormAIConfig | null;
}

export function useAIForm(userPrompt: string, options?: FormAIOptions): UseAIFormReturn {
  const [config, setConfig] = useState<FormAIConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fieldConfig = await getFieldConfig(userPrompt, options);
        setConfig(fieldConfig);
      } catch (e) {
        console.error("Erro no useAIForm:", e);
        setError("Falha ao gerar o campo de IA.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userPrompt, JSON.stringify(options)]);

  const validate = useCallback(() => {
    if (!config) return;

    const errorMessage = validateValue(value, config);
    setError(errorMessage);

  }, [value, config]);

  return {
    value,
    setValue,
    error,
    validate,
    loading,
    config
  };
}