// utils.js
const extractUserInfo = (message) => {
  const nameRegex = /nombre es (\w+)/i;
  const emailRegex = /correo es (\S+@\S+\.\S+)/i;

  const nameMatch = message.match(nameRegex);
  const emailMatch = message.match(emailRegex);

  const name = nameMatch ? nameMatch[1] : null;
  const email = emailMatch ? emailMatch[1] : null;

  return { name, email };
};

module.exports = { extractUserInfo };
