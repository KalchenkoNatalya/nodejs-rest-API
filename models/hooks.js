export const handleSaveError = (error, data, next) => {
  console.log(error.name);
  console.log(error.code);
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  next();
};

export const runValidateAtUpdate = function (next) {
  this.getOptions.runValidators = true;
  next();
};
