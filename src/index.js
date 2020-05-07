const digitsOnly = /^\d+$/;

function maskUSPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  if (digitsOnly.test(phone) === false || phone.length !== 10) {
    return phone;
  }

  const codeArea = phone.substring(0, 3);
  const prefix = phone.substring(3, 6);
  const suffix = phone.substring(6, 10);
  return `(${codeArea}) ${prefix}-${suffix}`;
}

export default maskUSPhone;
