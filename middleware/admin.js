const basicAuth = require("express-basic-auth");
require("dotenv").config();

function myAuthorizer(username, password) {
  const userMatches = basicAuth.safeCompare(username, process.env.ADMIN_USER);
  const passwordMatches = basicAuth.safeCompare(
    password,
    process.env.ADMIN_PASSWORD
  );
  return userMatches & passwordMatches;
}

function getUnauthorizedResponse(req) {
  // Check if credentials were provided but invalid
  if (req.auth) {
    return "Invalid credentials";
  }
  return "No credentials provided";
}

const authMiddleware = basicAuth({
  authorizer: myAuthorizer,
  challenge: true, // makes the browser login popup
  unauthorizedResponse: getUnauthorizedResponse
});

module.exports = authMiddleware;
