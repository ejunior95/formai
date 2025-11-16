import { Injectable, signal } from '@angular/core';
import {
  getFieldConfig,
  validateValue,
  type FormAIConfig,
  type FormAIOptions
} from '@ejunior95/formai-core';

/**
 * Nota: @Injectable() sem 'providedIn'
 * * Não estamos usando 'providedIn: "root"'.
 * Queremos que este serviço funcione como o hook do React,
 * onde cada componente que o utiliza obtém sua PRÓPRIA instância.
 * * O usuário deverá fornecer este serviço no 'providers' do componente.
 */
@Injectable()
export class AiFormService {

  // --- Gerenciamento de Estado com Signals ---
  // Signals são o equivalente moderno do Angular ao useState do React.
  // Eles notificam automaticamente qualquer parte da UI que os esteja "ouvindo".

  /** O valor atual do campo (controlado pelo serviço) */
  public readonly value = signal<string>("");

  /** O erro de validação atual */
  public readonly error = signal<string | null>(null);

  /** A configuração do campo (ex: type, placeholder) vinda da IA */
  public readonly config = signal<FormAIConfig | null>(null);

  /** O estado de carregamento da chamada inicial à IA */
  public readonly loading = signal<boolean>(true);


  constructor() { }

  /**
   * Busca a configuração da IA e inicializa o serviço.
   * Deve ser chamado no 'ngOnInit' do componente.
   */
  public async initialize(userPrompt: string, options?: FormAIOptions): Promise<void> {
    this.loading.set(true);
    this.error.set(null); // Limpa erros anteriores
    
    try {
      const fieldConfig = await getFieldConfig(userPrompt, options);
      this.config.set(fieldConfig);
    } catch (e: any) {
      console.error("Erro no AiFormService:", e);
      this.error.set("Falha ao gerar o campo de IA.");
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Atualiza o valor do campo.
   * Deve ser chamado no evento (input) do <input>.
   */
  public setValue(newValue: string): void {
    this.value.set(newValue);
  }

  /**
   * Valida o valor atual com base na configuração da IA.
   * Deve ser chamado no evento (blur) do <input>.
   */
  public validate(): void {
    const currentConfig = this.config(); // Lê o valor do signal
    if (!currentConfig) {
      return; // Ainda não há configuração, não pode validar
    }

    const currentValue = this.value(); // Lê o valor do signal
    const errorMessage = validateValue(currentValue, currentConfig);
    this.error.set(errorMessage);
  }
}