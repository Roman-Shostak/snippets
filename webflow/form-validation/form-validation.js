/**
 * Form validation for Webflow forms
 *
 * Custom validation with your own error texts, a red error state on fields,
 * a loading state on the submit button and accessible errors
 * (aria-invalid, aria-describedby, role="alert").
 * Handles every form[data-functional-form] on the page.
 *
 * Where:    Webflow → Page or Site settings → Custom code → Before </body> tag
 * Requires: form[data-functional-form]
 *           a custom button [data-submit-button="true"] with its label in a <span>
 *           fields marked wr-type="required-field"
 * Optional: data-validation-mode="custom | browser | both" on the form
 *           wr-type="error" + wr-error-id="<input id>" for error texts
 *           data-waiting-text="Sending..." on the button
 * Depends:  none
 * Docs:     README.md in this folder
 */

// Safety net: keeps Webflow.push working even if this code runs before webflow.js
var Webflow = Webflow || [];

Webflow.push(function () {
  const LOG = '[form-validation]';
  const ERROR_CLASS = 'is--error'; // class added to a field with an error
  let errorIdCounter = 0;

  // Browser bubble texts, used when a field has no [wr-type="error"] element
  const DEFAULT_MESSAGES = {
    required: 'Please fill out this field.',
    email: 'Please enter a valid email address.',
    checkbox: 'Please check this box to continue.',
    radio: 'Please select one of the options.',
  };

  function initializeForm(form) {
    // Error display mode: custom texts, browser bubbles or both
    const mode = form.getAttribute('data-validation-mode') || 'custom';
    const showBrowserErrors = mode === 'browser' || mode === 'both';
    const showCustomErrors = mode !== 'browser';

    let hasFormErrors = false;

    // Clears every error in the form: classes, texts, bubbles, aria
    const resetAllErrors = function () {
      form.querySelectorAll('[wr-type="error"]').forEach((el) => (el.style.display = 'none'));
      form.querySelectorAll('.' + ERROR_CLASS).forEach((el) => el.classList.remove(ERROR_CLASS));
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        el.setCustomValidity('');
        if (el.getAttribute('aria-invalid') === 'true') {
          el.setAttribute('aria-invalid', 'false');
          el.removeAttribute('aria-describedby');
        }
      });
    };

    resetAllErrors();

    // Finds the error text for a field: by wr-error-id first, then the nearest one
    const resolveErrorEl = function (field) {
      const fieldId = field.getAttribute('id');
      if (fieldId) {
        const linked = form.querySelector('[wr-error-id="' + fieldId + '"]');
        if (linked) return linked;
      }
      return field.parentNode.querySelector('[wr-type="error"]');
    };

    // Marks a field as invalid
    const fieldError = function (visualEl, controls, errorEl, defaultMessage) {
      // Bubble text: from [wr-type="error"], otherwise the default one
      const message = (errorEl && errorEl.textContent.trim()) || defaultMessage;

      if (errorEl && showCustomErrors) {
        errorEl.style.display = 'block';
        errorEl.setAttribute('role', 'alert');
        if (!errorEl.id) errorEl.id = 'wr-error-' + ++errorIdCounter;
      }

      visualEl.classList.add(ERROR_CLASS);

      (controls || []).forEach((control) => {
        control.setAttribute('aria-invalid', 'true');
        if (showCustomErrors && errorEl && errorEl.id) {
          control.setAttribute('aria-describedby', errorEl.id);
        }
        if (showBrowserErrors) control.setCustomValidity(message);
      });

      hasFormErrors = true;
    };

    // Phone fields keep only digits and +
    form.querySelectorAll('input[type="tel"]').forEach((phoneInput) => {
      phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9+]/g, '');
      });
    });

    const formErrorState = form.parentNode.querySelector('.w-form-fail');
    if (formErrorState) formErrorState.style.display = 'none';

    const submitButton = form.querySelector('[data-submit-button="true"]');
    if (!submitButton) {
      console.warn(LOG, 'no [data-submit-button="true"] inside the form, skipping', form);
      return;
    }

    // Submit button: loading state while the form is being sent
    const buttonTextEl = submitButton.querySelector('span');
    const originalSubmitText = buttonTextEl ? buttonTextEl.textContent : '';
    const loadingText = submitButton.getAttribute('data-waiting-text') || 'Waiting...';

    const resetSubmitButton = function () {
      submitButton.style.pointerEvents = 'auto';
      submitButton.removeAttribute('aria-disabled');
      if (buttonTextEl) buttonTextEl.textContent = originalSubmitText;
    };

    const setSubmitButtonLoading = function () {
      submitButton.style.pointerEvents = 'none';
      submitButton.setAttribute('aria-disabled', 'true');
      if (buttonTextEl) buttonTextEl.textContent = loadingText;
    };

    // Restores the button when Webflow hides the form (success) or shows .w-form-fail
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const isFormHidden = form.style.display === 'none';
          const isErrorVisible = formErrorState && formErrorState.style.display !== 'none';
          if (isFormHidden || isErrorVisible) resetSubmitButton();
        }
      });
    });
    observer.observe(form, { attributes: true });
    if (formErrorState) observer.observe(formErrorState, { attributes: true });

    const isValidEmail = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    const validateForm = function () {
      // Every check starts from a clean slate
      resetAllErrors();
      hasFormErrors = false;

      form.querySelectorAll('[wr-type="required-field"]').forEach((field) => {
        const errorEl = resolveErrorEl(field);

        if (field.getAttribute('type') === 'checkbox') {
          if (!field.checked) {
            const checkboxUI = field.parentNode.querySelector('.w-checkbox-input');
            fieldError(checkboxUI || field, [field], errorEl, DEFAULT_MESSAGES.checkbox);
          }
        } else if (field.querySelector('input[type="radio"]')) {
          const radioGroup = field.querySelectorAll('input[type="radio"]');
          const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
          if (!isChecked) fieldError(field, radioGroup, errorEl, DEFAULT_MESSAGES.radio);
        } else if (field.value.trim().length === 0) {
          fieldError(field, [field], errorEl, DEFAULT_MESSAGES.required);
        } else if (field.getAttribute('type') === 'email' && !isValidEmail(field.value)) {
          fieldError(field, [field], errorEl, DEFAULT_MESSAGES.email);
        }
      });

      return !hasFormErrors;
    };

    submitButton.addEventListener('click', function (e) {
      e.preventDefault();
      if (validateForm()) {
        setSubmitButtonLoading();
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      } else if (showBrowserErrors) {
        // Browser bubble next to the first invalid field (the browser sets focus itself)
        form.reportValidity();
      } else {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
      }
    });

    // Clears the error only on the field that changed, not on its neighbours
    const clearErrors = function () {
      this.classList.remove(ERROR_CLASS);
      if (this.getAttribute('type') === 'checkbox') {
        const checkboxUI = this.parentNode.querySelector('.w-checkbox-input');
        if (checkboxUI) checkboxUI.classList.remove(ERROR_CLASS);
      }

      const errorMsg = resolveErrorEl(this);
      if (errorMsg) errorMsg.style.display = 'none';

      [this, ...this.querySelectorAll('input, select, textarea')].forEach((el) => {
        if (typeof el.setCustomValidity === 'function') el.setCustomValidity('');
        if (el.getAttribute('aria-invalid') === 'true') {
          el.setAttribute('aria-invalid', 'false');
          el.removeAttribute('aria-describedby');
        }
      });
    };

    form.querySelectorAll('[wr-type="required-field"], [type="checkbox"]').forEach((field) => {
      if (field.querySelector('input[type="radio"]')) {
        field.querySelectorAll('input[type="radio"]').forEach((radio) => {
          radio.addEventListener('change', clearErrors.bind(field));
        });
      } else if (field.getAttribute('type') === 'checkbox') {
        field.addEventListener('change', clearErrors);
      } else {
        field.addEventListener('input', clearErrors);
      }
    });

    // Enter in any field goes through the same validation as the button
    form.querySelectorAll('input').forEach((field) => {
      field.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitButton.click();
        }
      });
    });

    console.log(LOG, 'ready, mode:', mode, form);
  }

  const forms = document.querySelectorAll('form[data-functional-form]');
  if (!forms.length) {
    console.log(LOG, 'no form[data-functional-form] on this page, skipping');
    return;
  }
  forms.forEach(initializeForm);
});
