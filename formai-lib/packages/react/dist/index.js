'use strict';

var react = require('react');
var core = require('@formai/core');

function useAIForm(userPrompt, options) {
    const [config, setConfig] = react.useState(null);
    const [loading, setLoading] = react.useState(true);
    const [value, setValue] = react.useState("");
    const [error, setError] = react.useState(null);
    react.useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const fieldConfig = await core.getFieldConfig(userPrompt, options);
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
    const validate = react.useCallback(() => {
        if (!config)
            return;
        const errorMessage = core.validateValue(value, config);
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

exports.useAIForm = useAIForm;
//# sourceMappingURL=index.js.map
