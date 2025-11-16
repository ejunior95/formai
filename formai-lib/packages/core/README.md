# @ejunior95/formai-core 🤖

[![NPM Version](https://img.shields.io/npm/v/@ejunior95/formai-core)](https://www.npmjs.com/package/@ejunior95/formai-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The headless, framework-agnostic engine for AI-powered form generation.

This is the core library that powers the **formAI** ecosystem. It contains the essential logic for communicating with the formAI API, fetching AI-generated field configurations, and validating values.

## Why formAI?

Stop wasting time hunting for validation regex, memorizing mask patterns, or manually building complex validation logic.

**formAI** lets you build forms by simply describing what you want in plain English.

* **You write:** `"A required Brazilian phone number"`
* **You get:**
    ```json
    {
      "type": "mask-text",
      "mask": "(00) 00000-0000",
      "placeholder": "(00) 00000-0000",
      "validation": {
        "required": true,
        "regex": "^\\(\\d{2}\\)\\s\\d{5}-\\d{4}$",
        "minLength": 15,
        "maxLength": 15
      }
    }
    ```

## Installation

```bash
npm install @ejunior95/formai-core
```

## How to Use (Core Engine)

This package is "headless" and intended to be used by framework adapters (like @ejunior95/formai-react). However, you can use it directly in any JavaScript project.

```bash
import { getFieldConfig, validateValue } from '@ejunior95/formai-core';

// 1. Fetch the configuration from the AI
const config = await getFieldConfig(
  "A required email field", // The prompt
  {
    maskPatterns: { digit: '0', letter: 'a' } // Your library's mask definitions
  }
);

/*
config = {
  type: 'text',
  placeholder: 'example@domain.com',
  mask: null,
  validation: {
    required: true,
    regex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    ...
  }
}
*/

// 2. Use the pure validator
const error = validateValue("test@", config);
// error = "Invalid format."

const success = validateValue("test@gmail.com", config);
// success = null
```

## API

```
getFieldConfig(prompt: string, options?: FormAIOptions)
```
* **prompt:** `The natural language description (e.g., "a 5-digit postal code").`
* **options:**(Optional) `An optional object.`


- **maskPatterns:**

    * **digit:** `The character your mask library uses for digits (e.g., '0').`
    * **letter:** `The character your mask library uses for letters (e.g., 'a').`

```
validateValue(value: string, config: FormAIConfig)
```

* **value**: `The current value of the input.`
* **config**: `The FormAIConfig object returned from getFieldConfig.`

Returns null if valid, or an string with the error message if invalid.

## Framework Adapters

This package is just the engine. For easy integration, use one of our official adapters:

* ⚛️ **React:** npm install @ejunior95/formai-react (Available Now!)
* 🅰️ **Angular:** npm install @ejunior95/formai-angular (Available Now!)
* 💚 **Vue:** Coming Soon!