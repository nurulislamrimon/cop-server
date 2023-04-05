const maxLength = 8;

function memberCopIDValidator(v) {
  return /COP\d{3}[A-Z][A-Z]/.test(v);
}
module.exports = { memberCopIDValidator, maxLength };
