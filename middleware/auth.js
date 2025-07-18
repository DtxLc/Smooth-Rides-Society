// Authentication middleware

// Check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/login");
}

// Check if user is NOT logged in (for login/register pages)
const isNotLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect("/cars");
}

// Check if user is the owner of a resource
const isOwner = (model) => {
  return async (req, res, next) => {
    try {
      const item = await model.findById(req.params.id);

      if (!item) {
        return res.status(404).render("404", { title: "Not Found" });
      }

      if (item.owner && item.owner.toString() === req.session.user._id) {
        return next();
      }

      res.status(403).render("error", {
        title: "Unauthorized",
        error: { message: "You do not have permission to perform this action" },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  isOwner,
  isLoggedIn,
  isNotLoggedIn,
}