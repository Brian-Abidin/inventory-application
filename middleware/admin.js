const basicAuth = require("express-basic-auth");

function myAuthorizer(username, password) {
  const userMatches = basicAuth.safeCompare(username, "customuser");
  const passwordMatches = basicAuth.safeCompare(password, "custompassword");
  console.log(userMatches, passwordMatches, "HELLOOOOO");
  return userMatches & passwordMatches;
}

function getUnauthorizedResponse(req, res) {
  // Check if credentials were provided but invalid
  if (req.auth) {
    console.log(`Invalid credentials for user: ${req.auth.user}`);
  } else {
    console.log("No credentials provided");
  }

  // Redirect to the login page
  res.redirect("/index"); //
}

const authMiddleware = basicAuth({
  authorizer: myAuthorizer,
  challenge: true, // makes the browser login popup
  unauthorizedResponse: getUnauthorizedResponse
});

module.exports = authMiddleware;
