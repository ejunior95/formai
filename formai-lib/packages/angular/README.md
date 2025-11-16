# @ejunior95/formai-angular 🅰️

[![NPM Version](https://img.shields.io/npm/v/@ejunior95/formai-angular)](https://www.npmjs.com/package/@ejunior95/formai-angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Generate Angular form fields and validation just by describing them in plain English.**

Stop wasting time searching for regex patterns, configuring mask libraries, and wiring up `signal()` or `FormControl` for every single form field.

## The "formAI" Gain

Building forms is boring. Let AI do the boring work for you.

### ⛔️ Stop Doing This...

```typescript
// Manually finding regex, checking mask docs, writing signals...
import { signal } from '@angular/core';

const value = signal("");
const error = signal<string | null>(null);

const PHONE_REGEX = /^\(\d{2}\)\s\d{5}-\d{4}$/;
const MASK = "(00) 00000-0000"; // Is it '0' or '9'...?

const validate = () => {
  if (!value()) {
    error.set("This field is required.");
  } else if (!PHONE_REGEX.test(value())) {
    error.set("Invalid format.");
  } else {
    error.set(null);
  }
};

// And in the template:
// <input [value]="value()" (input)="..." (blur)="validate()">
// <imask-input [mask]="MASK" ...>
```

## ✨ Do This Instead!

```typescript
// my-phone-field.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiFormService, FormAIOptions } from '@ejunior95/formai-angular';
// You still bring your own components!
import { IMaskModule } from 'angular-imask';

@Component({
  selector: 'app-my-phone-field',
  standalone: true,
  imports: [CommonModule, IMaskModule],
  // 1. Provide the service at the component level
  // so every instance gets its own state.
  providers: [AiFormService],
  template: `
    <div *ngIf="aiForm.loading()">
      <p>🤖 Generating field...</p>
    </div>

    <div *ngIf="aiForm.config() as config">
      <label>Phone Number</label>
      <input
        type="text"
        [imask]="{ mask: config.mask }"         
        [placeholder]="config.placeholder"    
        [value]="aiForm.value()"
        (input)="onInput($event)"
        (blur)="aiForm.validate()"
      />
      <p *ngIf="aiForm.error()" style="color: red;">
        {{ aiForm.error() }}
      </p>
    </div>
  `
})
export class MyPhoneFieldComponent implements OnInit {

  // 2. Inject the service (make it 'public' for the template)
  constructor(public aiForm: AiFormService) {}

  ngOnInit(): void {
    // 3. Initialize the AI
    this.aiForm.initialize("A required Brazilian phone number", {
      maskPatterns: { digit: '0' } // '0' is what angular-imask uses
    });
  }

  // 5. Connect events to the service's methods
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.aiForm.setValue(value);
  }
}
```

## Features

* **AI-Powered:** Simply describe the field. "A 50-char max name", "An optional email", "A CPF number".

* **Headless by Design:** We never render UI. `AiFormService` gives you the state (via Signals), logic, and config. You bring your own components (Angular Material, PrimeNG, or plain `<input>`).

* **Masking Made Easy:** Automatically generates the correct mask string, which you just pass to your favorite mask library (like angular-imask, ngx-mask, etc.).

* **Customizable:** Use the `maskPatterns` option to tell the AI which characters your mask library uses for digits (0 vs 9) or letters (a vs A).

## Installation

This package requires `@ejunior95/formai-core` to work.

```bash
# You must install BOTH the core engine and the Angular adapter
npm install @ejunior95/formai-core @ejunior95/formai-angular
```

## API

The package exports `AiFormService`, which manages the state for **one** form field instance.

##### 1. Providing the Service

You **must** provide `AiFormService` in your component's `providers` array. This ensures every instance of your component gets its own state.

```typescript
@Component({
  selector: 'my-component',
  providers: [AiFormService], // <-- Essential!
  template: `...`
})
```

##### 2. Initialization Method

After injecting the service, call `initialize` (typically in `ngOnInit`).

```typescript
// Inject in constructor
constructor(public aiForm: AiFormService) {}

// Call in ngOnInit
ngOnInit(): void {
  this.aiForm.initialize(
    prompt: string,
    options?: FormAIOptions
  );
}
```

* **prompt:** `The natural language description (e.g., "a 5-digit postal code").`
* **options:**(Optional) `An optional object.`


- **maskPatterns:**

    * **digit:** `The character your mask library uses for digits (e.g., '0').`
    * **letter:** `The character your mask library uses for letters (e.g., 'a').`

##### 3. Public State & Methods

The service exposes state via **Signals** (read) and **Methods** (write).

- **Signals (Read):**

    * `aiForm.value()`: The current state of the input.
    * `aiForm.error()`: `null` if valid, or a string with the error message.
    * `aiForm.loading()`: A boolean that is `true` while the AI is generating the config.
    * `aiForm.config()`: The raw `FormAIConfig` (JSON) object from the AI (contains `mask`, `placeholder`, `regex`, etc.).

- **Methods (Write):**

    * `aiForm.setValue(value: string)`: The setter for the input's value (e.g., for use on the `(input)` event).
    * `aiForm.validate()`: A function to trigger validation (e.g., for use on the 
    `(blur)` event).


### Looking for other frameworks?

* ⚛️ React: Available! (@ejunior95/formai-react)
* 💚 **Vue:** Coming Soon!