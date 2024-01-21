function jfDebounceHandle(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function jfDebounce(event, handler, timeout = 300, args = []) {
  if (Array.isArray(timeout)) {
    args = timeout;
    timeout = 300;
  }
  const debouncedHandler = jfDebounceHandle(() => handler(...args), timeout);
  window.addEventListener(event, debouncedHandler);
}
