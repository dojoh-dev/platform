const $$ = <S extends Element>(selector: string): S => {
  const element = document.querySelector<S>(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
};

export default $$;
