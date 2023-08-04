const regex = /^(\+\d{2})?\s?\d{2}\s\d{5}\s\d{4}$/;

exports.isBrNumber = (value) => {
  return regex.test(value);
};
