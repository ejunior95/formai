import { useState, useEffect, useCallback } from 'react';
import { getFieldConfig, validateValue } from '@formai/core';

function useAIForm(userPrompt, options) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const fieldConfig = await getFieldConfig(userPrompt, options);
                setConfig(fieldConfig);
            }
            catch (e) {
                console.error("Erro no useAIForm:", e);
                setError("Falha ao gerar o campo de IA.");
            }
            finally {
                setLoading(false);
            }
        })();
    }, [userPrompt, JSON.stringify(options)]);
    const validate = useCallback(() => {
        if (!config)
            return;
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

export { useAIForm };
//# sourceMappingURL=index.mjs.map
