const languageMiddleware = (req, res, next) => {
  const acceptedLanguage = req.headers["accept-language"];
  req.language = acceptedLanguage === "ar" ? "ar" : "en";
  next();
};

module.exports = languageMiddleware;
