exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", { pageTitle: "Página não encontrada", path: "/404" });
};

exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", { pageTitle: "Algo inesperado aconteceu", path: "/500" });
};
