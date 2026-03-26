const verifyAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden"
    });
  }
};

module.exports = verifyAdmin;
