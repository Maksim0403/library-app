export const Validators = {
  isDigits: (s: string) => /^\d+$/.test(s),
  isYear: (s: string) => /^\d{4}$/.test(s),
  isEmail: (s: string) => /^\S+@\S+\.\S+$/.test(s),
};
