import type { Action } from 'svelte/action';

/**
 * Svelte action that constrains the node's max-height to the visual viewport
 * while a text input inside it is focused (i.e. keyboard is likely open).
 * Resets fully on blur so the drawer returns to its natural layout.
 */
export const keyboardViewport: Action = (node) => {
  if (!window.visualViewport) return;

  let inputFocused = false;

  const update = () => {
    if (!inputFocused) return;
    node.style.maxHeight = `${window.visualViewport!.height}px`;
  };

  const reset = () => {
    node.style.maxHeight = '';
  };

  const onFocusIn = (e: FocusEvent) => {
    const target = e.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      inputFocused = true;
      window.visualViewport!.addEventListener('resize', update);
      // Delay to let the keyboard finish opening
      setTimeout(update, 300);
    }
  };

  const onFocusOut = () => {
    inputFocused = false;
    window.visualViewport!.removeEventListener('resize', update);
    reset();
  };

  node.addEventListener('focusin', onFocusIn);
  node.addEventListener('focusout', onFocusOut);

  return {
    destroy() {
      node.removeEventListener('focusin', onFocusIn);
      node.removeEventListener('focusout', onFocusOut);
      window.visualViewport?.removeEventListener('resize', update);
      reset();
    }
  };
};
