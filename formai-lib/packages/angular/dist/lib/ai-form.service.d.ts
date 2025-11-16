import { type FormAIConfig, type FormAIOptions } from '@ejunior95/formai-core';
/**
 * Nota: @Injectable() sem 'providedIn'
 * * Não estamos usando 'providedIn: "root"'.
 * Queremos que este serviço funcione como o hook do React,
 * onde cada componente que o utiliza obtém sua PRÓPRIA instância.
 * * O usuário deverá fornecer este serviço no 'providers' do componente.
 */
export declare class AiFormService {
    /** O valor atual do campo (controlado pelo serviço) */
    readonly value: import("@angular/core").WritableSignal<string>;
    /** O erro de validação atual */
    readonly error: import("@angular/core").WritableSignal<string | null>;
    /** A configuração do campo (ex: type, placeholder) vinda da IA */
    readonly config: import("@angular/core").WritableSignal<FormAIConfig | null>;
    /** O estado de carregamento da chamada inicial à IA */
    readonly loading: import("@angular/core").WritableSignal<boolean>;
    constructor();
    /**
     * Busca a configuração da IA e inicializa o serviço.
     * Deve ser chamado no 'ngOnInit' do componente.
     */
    initialize(userPrompt: string, options?: FormAIOptions): Promise<void>;
    /**
     * Atualiza o valor do campo.
     * Deve ser chamado no evento (input) do <input>.
     */
    setValue(newValue: string): void;
    /**
     * Valida o valor atual com base na configuração da IA.
     * Deve ser chamado no evento (blur) do <input>.
     */
    validate(): void;
}
