import { OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { type FormAIOptions } from '@formai/core';
export * from '@formai/core';
/**
 * A Diretiva de Atributo principal do formAI para Angular.
 */
export declare class FormAIDirective implements OnInit {
    private ngControl;
    private elementRef;
    private renderer;
    /**
     * O prompt em linguagem natural.
     * Ex: <input formAI="Um campo de email obrigatório">
     */
    userPrompt: string;
    /**
     * As opções de máscara (para '0' vs '9', etc.)
     * Ex: <input [formAIOptions]="{ maskPatterns: { digit: '0' } }">
     */
    formAIOptions: FormAIOptions;
    constructor(ngControl: NgControl, elementRef: ElementRef<HTMLInputElement>, renderer: Renderer2);
    ngOnInit(): Promise<void>;
}
/**
 * O Módulo que exporta a diretiva.
 * Uma app Angular irá importar este módulo no seu app.module.ts.
 */
export declare class FormAIModule {
}
