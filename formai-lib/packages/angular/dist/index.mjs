import { Injectable, signal } from '@angular/core';
import { getFieldConfig, validateValue } from '@ejunior95/formai-core';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Nota: @Injectable() sem 'providedIn'
 * * Não estamos usando 'providedIn: "root"'.
 * Queremos que este serviço funcione como o hook do React,
 * onde cada componente que o utiliza obtém sua PRÓPRIA instância.
 * * O usuário deverá fornecer este serviço no 'providers' do componente.
 */
let AiFormService = class AiFormService {
    constructor() {
        // --- Gerenciamento de Estado com Signals ---
        // Signals são o equivalente moderno do Angular ao useState do React.
        // Eles notificam automaticamente qualquer parte da UI que os esteja "ouvindo".
        /** O valor atual do campo (controlado pelo serviço) */
        this.value = signal("");
        /** O erro de validação atual */
        this.error = signal(null);
        /** A configuração do campo (ex: type, placeholder) vinda da IA */
        this.config = signal(null);
        /** O estado de carregamento da chamada inicial à IA */
        this.loading = signal(true);
    }
    /**
     * Busca a configuração da IA e inicializa o serviço.
     * Deve ser chamado no 'ngOnInit' do componente.
     */
    async initialize(userPrompt, options) {
        this.loading.set(true);
        this.error.set(null); // Limpa erros anteriores
        try {
            const fieldConfig = await getFieldConfig(userPrompt, options);
            this.config.set(fieldConfig);
        }
        catch (e) {
            console.error("Erro no AiFormService:", e);
            this.error.set("Falha ao gerar o campo de IA.");
        }
        finally {
            this.loading.set(false);
        }
    }
    /**
     * Atualiza o valor do campo.
     * Deve ser chamado no evento (input) do <input>.
     */
    setValue(newValue) {
        this.value.set(newValue);
    }
    /**
     * Valida o valor atual com base na configuração da IA.
     * Deve ser chamado no evento (blur) do <input>.
     */
    validate() {
        const currentConfig = this.config(); // Lê o valor do signal
        if (!currentConfig) {
            return; // Ainda não há configuração, não pode validar
        }
        const currentValue = this.value(); // Lê o valor do signal
        const errorMessage = validateValue(currentValue, currentConfig);
        this.error.set(errorMessage);
    }
};
AiFormService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], AiFormService);

export { AiFormService };
//# sourceMappingURL=index.mjs.map
