# Form validation for Webflow

Replaces Webflow's default form behaviour with custom validation: your own error texts,
a red error state on fields, a loading state on the submit button and accessible errors.
No dependencies, works with any number of forms on a page.

## Features

- Required text fields, email format check, checkboxes and radio groups
- Three error display modes per form: custom texts, browser bubbles or both
- Error state class `is--error` on the invalid field (on the visual box for checkboxes)
- Errors clear one field at a time as the user fixes them
- Submit button switches to a loading text and blocks double clicks
- Button resets automatically on success or when Webflow shows the error message
- Phone fields (`type="tel"`) accept only digits and `+`
- `Enter` in any field runs the same validation as the button
- Accessibility: `aria-invalid`, `aria-describedby`, `role="alert"`, focus on the first invalid field

## Element structure

```
Form Block
├── Form                          ← data-functional-form
│   │                               data-validation-mode="custom"   (optional)
│   │
│   ├── Field wrapper (Div)
│   │   ├── Label
│   │   ├── Input                 ← id="email" · type="email" · wr-type="required-field"
│   │   └── Text Block            ← wr-type="error" · wr-error-id="email"
│   │                               text: "Please enter a valid email"
│   │
│   ├── Checkbox Field
│   │   ├── Checkbox              ← wr-type="required-field"
│   │   ├── Label
│   │   └── Text Block            ← wr-type="error"
│   │
│   ├── Radio group wrapper (Div) ← wr-type="required-field"
│   │   ├── Radio Button × N
│   │   └── Text Block            ← wr-type="error"
│   │
│   └── Button (Div or Link)      ← data-submit-button="true"
│       │                           data-waiting-text="Sending..."   (optional)
│       └── Span                  "Send"
│
├── Success Message               (Webflow default)
└── Error Message                 (Webflow default)
```

## Attributes

| Attribute | Put it on | What it does |
|---|---|---|
| `data-functional-form` | `<form>` | Turns validation on for this form |
| `data-validation-mode` | `<form>` | `custom` (default): your error texts only · `browser`: browser bubbles only · `both`: both |
| `data-submit-button="true"` | Your custom button | The script validates on click and submits the form |
| `data-waiting-text` | Your custom button | Button text while sending (default: `Waiting...`) |
| `wr-type="required-field"` | Input, textarea, select, checkbox, or a radio group wrapper | Field must be filled, checked or selected |
| `wr-type="error"` | Text element | Error text for a field, hidden until needed |
| `wr-error-id` | Error text element | ID of the input it belongs to. Without it, the nearest `wr-type="error"` in the same parent is used |

`type="email"` adds a format check, `type="tel"` filters out everything except digits and `+`.

## Setup in Webflow

1. **Form.** Select the `Form` element (the form itself, not the Form Block around it) →
   Settings → Custom Attributes → add `data-functional-form` with an empty value.
2. **Button.** Delete Webflow's native Submit button. Add your own Div or Link block styled as a button,
   put the label inside a `Span`, then add the attribute `data-submit-button` = `true`.
3. **Required fields.** On each required input add `wr-type` = `required-field`.
   For a radio group, add it to the wrapper that holds the radio buttons.
   Don't turn on Webflow's **Required** checkbox: the script handles it.
4. **Error texts.** Under each required field add a Text Block with the error message and the attribute
   `wr-type` = `error`. Set it to `display: none` in the Designer so it doesn't flash on load.
   If the field has an ID, add `wr-error-id` = that ID to link them explicitly.
5. **Error state.** Create a combo class `is--error` on your input class (for example, a red border).
   For checkboxes, style `is--error` on the checkbox's visual box (`.w-checkbox-input`).
6. **Script.** Paste [`form-validation.js`](form-validation.js) into **Page settings → Custom code →
   Before `</body>` tag** (or Site settings to cover every page), wrapped in `<script></script>`.
7. **Test.** Publish, open the browser console (`⌥⌘J` in Chrome) and look for
   `[form-validation] ready, mode: custom`. Then submit the form empty, and try `test@test` in the email field.

## How it works

The native Submit button is removed, so the browser never runs its own validation.
On click, the script checks every `wr-type="required-field"` element, marks the invalid ones and, if everything
is valid, dispatches a `submit` event that Webflow's form handler picks up as usual.
In `browser` and `both` modes the script passes its own errors to the browser via `setCustomValidity`,
so the bubbles always match the script's rules.

## Customising

- **Error class:** change `ERROR_CLASS` at the top of the script.
- **Bubble texts:** edit `DEFAULT_MESSAGES`. They're used only when a field has no `wr-type="error"` text.
- **Email rule:** edit the regular expression in `isValidEmail`.
