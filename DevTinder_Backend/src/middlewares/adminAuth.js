const AdminAuth = (req, res, next) => {
  console.log("Inside Admin Auth middleware !!");
  const token = "abc";
  const isAuthenticateAdmin = token === "abc";
  if (!isAuthenticateAdmin) {
    res.status(401).send("Unauthorized to access this admin portal !!");
  } else {
    next();
  }
};

module.exports = { AdminAuth };
