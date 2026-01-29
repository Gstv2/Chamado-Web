const PREFIX = 'helpdesk_tmpl_';

export const storageSet = (key, value) => {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
};

export const storageGet = (key) => {
  const item = localStorage.getItem(`${PREFIX}${key}`);
  return item ? JSON.parse(item) : null;
};

export const storageRemove = (key) => {
  localStorage.removeItem(`${PREFIX}${key}`);
};
