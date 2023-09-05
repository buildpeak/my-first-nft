export const validateNRIC = (nric) => {
  if (nric.length !== 9) {
    return false;
  }
  const nricRegex = /^[STFG]\d{7}[A-Z]$/;
  return nricRegex.test(nric);
};
