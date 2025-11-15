'use strict';

var core$1 = require('@angular/core');
var forms = require('@angular/forms');
var core = require('@formai/core');

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
exports.FormAIDirective = class FormAIDirective {
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
            const config = await core.getFieldConfig(this.userPrompt, this.formAIOptions);
            if (this.ngControl && this.ngControl.control) {
                const control = this.ngControl.control;
                const validators = [];
                if (config.validation.required) {
                    validators.push(forms.Validators.required);
                }
                if (config.validation.regex) {
                    validators.push(forms.Validators.pattern(new RegExp(config.validation.regex)));
                }
                if (config.validation.minLength) {
                    validators.push(forms.Validators.minLength(config.validation.minLength));
                }
                if (config.validation.maxLength) {
                    validators.push(forms.Validators.maxLength(config.validation.maxLength));
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
    core$1.Input('formAI'),
    __metadata("design:type", String)
], exports.FormAIDirective.prototype, "userPrompt", void 0);
__decorate([
    core$1.Input(),
    __metadata("design:type", Object)
], exports.FormAIDirective.prototype, "formAIOptions", void 0);
exports.FormAIDirective = __decorate([
    core$1.Directive({
        selector: '[formAI]',
        standalone: false,
    }),
    __metadata("design:paramtypes", [forms.NgControl,
        core$1.ElementRef,
        core$1.Renderer2])
], exports.FormAIDirective);
/**
 * O Módulo que exporta a diretiva.
 * Uma app Angular irá importar este módulo no seu app.module.ts.
 */
exports.FormAIModule = class FormAIModule {
};
exports.FormAIModule = __decorate([
    core$1.NgModule({
        declarations: [exports.FormAIDirective],
        exports: [exports.FormAIDirective],
    })
], exports.FormAIModule);

Object.keys(core).forEach(function (k) {
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () { return core[k]; }
    });
});
//# sourceMappingURL=index.js.map
