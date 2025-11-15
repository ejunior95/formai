# @ejunior95/formai-react ⚛️

[![NPM Version](https://img.shields.io/npm/v/@ejunior95/formai-react)](https://www.npmjs.com/package/@ejunior95/formai-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Generate React form fields and validation just by describing them in plain English.**

Stop wasting time searching for regex patterns, configuring mask libraries, and wiring up `useState` and `useEffect` for every single form field.

## The "formAI" Gain

Building forms is boring. Let AI do the boring work for you.

### ⛔️ Stop Doing This...

```jsx
// Manually finding regex, checking mask docs, writing state...
const [value, setValue] = useState("");
const [error, setError] = useState(null);

const PHONE_REGEX = /^\(\d{2}\)\s\d{5}-\d{4}$/;
const MASK = "(00) 00000-0000"; // Is it '0' or '9'...?

const validate = () => {
  if (!value) {
    setError("Field is required.");
  } else if (!PHONE_REGEX.test(value)) {
    setError("Invalid format.");
  }
};

return (
  <IMaskInput
    mask={MASK}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onBlur={validate}
  />
)
```

## ✨ Do This Instead!

```jsx
import { useAIForm } from '@ejunior95/formai-react';
import { IMaskInput } from 'react-imask'; // You still bring your own components!

function MyPhoneField() {
  const {
    value,
    setValue,
    error,
    validate,
    loading,
    config
  } = useAIForm("A required Brazilian phone number", {
    maskPatterns: { digit: '0' } // '0' is what react-imask uses
  });

  if (loading) return <p>🤖 Generating field...</p>;

  return (
    <div>
      <label>Phone Number</label>
      <IMaskInput
        mask={config.mask} // The AI provides this!
        placeholder={config.placeholder} // And this!
        value={value}
        onAccept={(val) => setValue(val)}
        onBlur={validate} // The AI provides the validation logic!
      />
      {error && <p>{error}</p>}
    </div>
  );
}
```

## Features

* **AI-Powered:** Simply describe the field. "A 50-char max name", "An optional email", "A CPF number".

* **Headless by Design:** We never render UI. useAIForm gives you the state, logic, and config. You bring your own components (ShadCN, MUI, Ant, or plain `<input>`).

* **Masking Made Easy:** Automatically generates the correct mask string, which you just pass to your favorite mask library (like react-imask, react-text-mask, etc.).

* **Customizable:** Use the maskPatterns option to tell the AI which characters your mask library uses for digits (0 vs 9) or letters (a vs A).

## Installation

This package requires `@ejunior95/formai-core` to work.

```bash
# You must install BOTH the core engine and the react adapter
npm install @ejunior95/formai-core @ejunior95/formai-react
```

## API

#### Hook Signature

```jsx
useAIForm(
  prompt: string,
  options?: FormAIOptions
): UseAIFormReturn
```

* **prompt:** `The natural language description (e.g., "a 5-digit postal code").`
* **options:**(Optional) `An optional object.`


- **maskPatterns:**

    * **digit:** `The character your mask library uses for digits (e.g., '0').`
    * **letter:** `The character your mask library uses for letters (e.g., 'a').`

#### Return Value

The hook returns an object with:

* **value:** The current state of the input.
* **setValue:** The setter for the input's value.
* **error:** null if valid, or a string with the error message.
* **validate:** A function to trigger validation (e.g., for onBlur).
* **loading:** A boolean that is true while the AI is generating the config.
* **config:** The raw FormAIConfig JSON object from the AI (contains mask, placeholder, regex, etc.).

## Looking for other frameworks?

* 🅰️ **Angular:** Coming Soon!
* 💚 **Vue:** Coming Soon!