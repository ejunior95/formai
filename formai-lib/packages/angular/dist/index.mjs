import { Input, Directive, NgModule, ElementRef, Renderer2 } from '@angular/core';
import { Validators, NgControl } from '@angular/forms';
import { getFieldConfig } from '@formai/core';
export * from '@formai/core';

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
 * A Diretiva de Atributo principal do formAI para Angular.
 */
let FormAIDirective = class FormAIDirective {
    // --- Injeção de Dependências ---
    constructor(ngControl, elementRef, renderer) {
        this.ngControl = ngControl;
        this.elementRef = elementRef;
        this.renderer = renderer;
        // --- Entradas (Inputs) da Diretiva ---
        /**
         * O prompt em linguagem natural.
         * Ex: <input formAI="Um campo de email obrigatório">
         */
        this.userPrompt = '';
        /**
         * As opções de máscara (para '0' vs '9', etc.)
         * Ex: <input [formAIOptions]="{ maskPatterns: { digit: '0' } }">
         */
        this.formAIOptions = {};
    }
    async ngOnInit() {
        if (!this.userPrompt) {
            console.error('formAI: O prompt (ex: [formAI]="...") é obrigatório.');
            return;
        }
        try {
            const config = await getFieldConfig(this.userPrompt, this.formAIOptions);
            if (this.ngControl && this.ngControl.control) {
                const control = this.ngControl.control;
                const validators = [];
                if (config.validation.required) {
                    validators.push(Validators.required);
                }
                if (config.validation.regex) {
                    validators.push(Validators.pattern(new RegExp(config.validation.regex)));
                }
                if (config.validation.minLength) {
                    validators.push(Validators.minLength(config.validation.minLength));
                }
                if (config.validation.maxLength) {
                    validators.push(Validators.maxLength(config.validation.maxLength));
                }
                control.setValidators(validators);
                control.updateValueAndValidity();
            }
            if (config.placeholder) {
                this.renderer.setAttribute(this.elementRef.nativeElement, 'placeholder', config.placeholder);
            }
        }
        catch (error) {
            console.error('formAI: Falha ao gerar configuração de IA.', error);
        }
    }
};
__decorate([
    Input('formAI'),
    __metadata("design:type", String)
], FormAIDirective.prototype, "userPrompt", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], FormAIDirective.prototype, "formAIOptions", void 0);
FormAIDirective = __decorate([
    Directive({
        selector: '[formAI]',
        standalone: false,
    }),
    __metadata("design:paramtypes", [NgControl,
        ElementRef,
        Renderer2])
], FormAIDirective);
/**
 * O Módulo que exporta a diretiva.
 * Uma app Angular irá importar este módulo no seu app.module.ts.
 */
let FormAIModule = class FormAIModule {
};
FormAIModule = __decorate([
    NgModule({
        declarations: [FormAIDirective],
        exports: [FormAIDirective],
    })
], FormAIModule);

export { FormAIDirective, FormAIModule };
//# sourceMappingURL=index.mjs.map
