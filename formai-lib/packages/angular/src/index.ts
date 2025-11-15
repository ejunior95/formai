import { Directive, Input, OnInit, ElementRef, Renderer2, NgModule } from '@angular/core';
import { NgControl, Validators, ValidatorFn } from '@angular/forms';
import { 
  getFieldConfig, 
  validateValue,
  type FormAIConfig,
  type FormAIOptions 
} from '@formai/core';

export * from '@formai/core';

/**
 * A Diretiva de Atributo principal do formAI para Angular.
 */
@Directive({
  selector: '[formAI]',
  standalone: false,
})
export class FormAIDirective implements OnInit {
  
  // --- Entradas (Inputs) da Diretiva ---

  /**
   * O prompt em linguagem natural.
   * Ex: <input formAI="Um campo de email obrigatório">
   */
  @Input('formAI') userPrompt: string = '';

  /**
   * As opções de máscara (para '0' vs '9', etc.)
   * Ex: <input [formAIOptions]="{ maskPatterns: { digit: '0' } }">
   */
  @Input() formAIOptions: FormAIOptions = {};

  // --- Injeção de Dependências ---

  constructor(
    private ngControl: NgControl,
    private elementRef: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.userPrompt) {
      console.error('formAI: O prompt (ex: [formAI]="...") é obrigatório.');
      return;
    }

    try {
      const config = await getFieldConfig(this.userPrompt, this.formAIOptions);

      if (this.ngControl && this.ngControl.control) {
        const control = this.ngControl.control;
        const validators: ValidatorFn[] = [];

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
      
    } catch (error) {
      console.error('formAI: Falha ao gerar configuração de IA.', error);
    }
  }
}

/**
 * O Módulo que exporta a diretiva.
 * Uma app Angular irá importar este módulo no seu app.module.ts.
 */
@NgModule({
  declarations: [FormAIDirective],
  exports: [FormAIDirective],
})
export class FormAIModule {}