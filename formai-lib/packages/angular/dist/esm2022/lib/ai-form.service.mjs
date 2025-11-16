import { Injectable, signal } from '@angular/core';
import { getFieldConfig, validateValue } from '@ejunior95/formai-core';
import * as i0 from "@angular/core";
/**
 * Nota: @Injectable() sem 'providedIn'
 * * Não estamos usando 'providedIn: "root"'.
 * Queremos que este serviço funcione como o hook do React,
 * onde cada componente que o utiliza obtém sua PRÓPRIA instância.
 * * O usuário deverá fornecer este serviço no 'providers' do componente.
 */
export class AiFormService {
    // --- Gerenciamento de Estado com Signals ---
    // Signals são o equivalente moderno do Angular ao useState do React.
    // Eles notificam automaticamente qualquer parte da UI que os esteja "ouvindo".
    /** O valor atual do campo (controlado pelo serviço) */
    value = signal("");
    /** O erro de validação atual */
    error = signal(null);
    /** A configuração do campo (ex: type, placeholder) vinda da IA */
    config = signal(null);
    /** O estado de carregamento da chamada inicial à IA */
    loading = signal(true);
    constructor() { }
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: AiFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: AiFormService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.14", ngImport: i0, type: AiFormService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWktZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9haS1mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUNMLGNBQWMsRUFDZCxhQUFhLEVBR2QsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFaEM7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFFeEIsOENBQThDO0lBQzlDLHFFQUFxRTtJQUNyRSwrRUFBK0U7SUFFL0UsdURBQXVEO0lBQ3ZDLEtBQUssR0FBRyxNQUFNLENBQVMsRUFBRSxDQUFDLENBQUM7SUFFM0MsZ0NBQWdDO0lBQ2hCLEtBQUssR0FBRyxNQUFNLENBQWdCLElBQUksQ0FBQyxDQUFDO0lBRXBELGtFQUFrRTtJQUNsRCxNQUFNLEdBQUcsTUFBTSxDQUFzQixJQUFJLENBQUMsQ0FBQztJQUUzRCx1REFBdUQ7SUFDdkMsT0FBTyxHQUFHLE1BQU0sQ0FBVSxJQUFJLENBQUMsQ0FBQztJQUdoRCxnQkFBZ0IsQ0FBQztJQUVqQjs7O09BR0c7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQWtCLEVBQUUsT0FBdUI7UUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyx5QkFBeUI7UUFFL0MsSUFBSSxDQUFDO1lBQ0gsTUFBTSxXQUFXLEdBQUcsTUFBTSxjQUFjLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFBQyxPQUFPLENBQU0sRUFBRSxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNsRCxDQUFDO2dCQUFTLENBQUM7WUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFFBQVEsQ0FBQyxRQUFnQjtRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksUUFBUTtRQUNiLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QjtRQUM1RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLDhDQUE4QztRQUN4RCxDQUFDO1FBRUQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsdUJBQXVCO1FBQzFELE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDL0IsQ0FBQzt3R0E3RFUsYUFBYTs0R0FBYixhQUFhOzs0RkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBnZXRGaWVsZENvbmZpZyxcbiAgdmFsaWRhdGVWYWx1ZSxcbiAgdHlwZSBGb3JtQUlDb25maWcsXG4gIHR5cGUgRm9ybUFJT3B0aW9uc1xufSBmcm9tICdAZWp1bmlvcjk1L2Zvcm1haS1jb3JlJztcblxuLyoqXG4gKiBOb3RhOiBASW5qZWN0YWJsZSgpIHNlbSAncHJvdmlkZWRJbidcbiAqICogTsOjbyBlc3RhbW9zIHVzYW5kbyAncHJvdmlkZWRJbjogXCJyb290XCInLlxuICogUXVlcmVtb3MgcXVlIGVzdGUgc2VydmnDp28gZnVuY2lvbmUgY29tbyBvIGhvb2sgZG8gUmVhY3QsXG4gKiBvbmRlIGNhZGEgY29tcG9uZW50ZSBxdWUgbyB1dGlsaXphIG9idMOpbSBzdWEgUFLDk1BSSUEgaW5zdMOibmNpYS5cbiAqICogTyB1c3XDoXJpbyBkZXZlcsOhIGZvcm5lY2VyIGVzdGUgc2VydmnDp28gbm8gJ3Byb3ZpZGVycycgZG8gY29tcG9uZW50ZS5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFpRm9ybVNlcnZpY2Uge1xuXG4gIC8vIC0tLSBHZXJlbmNpYW1lbnRvIGRlIEVzdGFkbyBjb20gU2lnbmFscyAtLS1cbiAgLy8gU2lnbmFscyBzw6NvIG8gZXF1aXZhbGVudGUgbW9kZXJubyBkbyBBbmd1bGFyIGFvIHVzZVN0YXRlIGRvIFJlYWN0LlxuICAvLyBFbGVzIG5vdGlmaWNhbSBhdXRvbWF0aWNhbWVudGUgcXVhbHF1ZXIgcGFydGUgZGEgVUkgcXVlIG9zIGVzdGVqYSBcIm91dmluZG9cIi5cblxuICAvKiogTyB2YWxvciBhdHVhbCBkbyBjYW1wbyAoY29udHJvbGFkbyBwZWxvIHNlcnZpw6dvKSAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWUgPSBzaWduYWw8c3RyaW5nPihcIlwiKTtcblxuICAvKiogTyBlcnJvIGRlIHZhbGlkYcOnw6NvIGF0dWFsICovXG4gIHB1YmxpYyByZWFkb25seSBlcnJvciA9IHNpZ25hbDxzdHJpbmcgfCBudWxsPihudWxsKTtcblxuICAvKiogQSBjb25maWd1cmHDp8OjbyBkbyBjYW1wbyAoZXg6IHR5cGUsIHBsYWNlaG9sZGVyKSB2aW5kYSBkYSBJQSAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29uZmlnID0gc2lnbmFsPEZvcm1BSUNvbmZpZyB8IG51bGw+KG51bGwpO1xuXG4gIC8qKiBPIGVzdGFkbyBkZSBjYXJyZWdhbWVudG8gZGEgY2hhbWFkYSBpbmljaWFsIMOgIElBICovXG4gIHB1YmxpYyByZWFkb25seSBsb2FkaW5nID0gc2lnbmFsPGJvb2xlYW4+KHRydWUpO1xuXG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKipcbiAgICogQnVzY2EgYSBjb25maWd1cmHDp8OjbyBkYSBJQSBlIGluaWNpYWxpemEgbyBzZXJ2acOnby5cbiAgICogRGV2ZSBzZXIgY2hhbWFkbyBubyAnbmdPbkluaXQnIGRvIGNvbXBvbmVudGUuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgaW5pdGlhbGl6ZSh1c2VyUHJvbXB0OiBzdHJpbmcsIG9wdGlvbnM/OiBGb3JtQUlPcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5sb2FkaW5nLnNldCh0cnVlKTtcbiAgICB0aGlzLmVycm9yLnNldChudWxsKTsgLy8gTGltcGEgZXJyb3MgYW50ZXJpb3Jlc1xuICAgIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCBmaWVsZENvbmZpZyA9IGF3YWl0IGdldEZpZWxkQ29uZmlnKHVzZXJQcm9tcHQsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5jb25maWcuc2V0KGZpZWxkQ29uZmlnKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvIG5vIEFpRm9ybVNlcnZpY2U6XCIsIGUpO1xuICAgICAgdGhpcy5lcnJvci5zZXQoXCJGYWxoYSBhbyBnZXJhciBvIGNhbXBvIGRlIElBLlwiKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5sb2FkaW5nLnNldChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dWFsaXphIG8gdmFsb3IgZG8gY2FtcG8uXG4gICAqIERldmUgc2VyIGNoYW1hZG8gbm8gZXZlbnRvIChpbnB1dCkgZG8gPGlucHV0Pi5cbiAgICovXG4gIHB1YmxpYyBzZXRWYWx1ZShuZXdWYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZS5zZXQobmV3VmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYSBvIHZhbG9yIGF0dWFsIGNvbSBiYXNlIG5hIGNvbmZpZ3VyYcOnw6NvIGRhIElBLlxuICAgKiBEZXZlIHNlciBjaGFtYWRvIG5vIGV2ZW50byAoYmx1cikgZG8gPGlucHV0Pi5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gdGhpcy5jb25maWcoKTsgLy8gTMOqIG8gdmFsb3IgZG8gc2lnbmFsXG4gICAgaWYgKCFjdXJyZW50Q29uZmlnKSB7XG4gICAgICByZXR1cm47IC8vIEFpbmRhIG7Do28gaMOhIGNvbmZpZ3VyYcOnw6NvLCBuw6NvIHBvZGUgdmFsaWRhclxuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMudmFsdWUoKTsgLy8gTMOqIG8gdmFsb3IgZG8gc2lnbmFsXG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gdmFsaWRhdGVWYWx1ZShjdXJyZW50VmFsdWUsIGN1cnJlbnRDb25maWcpO1xuICAgIHRoaXMuZXJyb3Iuc2V0KGVycm9yTWVzc2FnZSk7XG4gIH1cbn0iXX0=