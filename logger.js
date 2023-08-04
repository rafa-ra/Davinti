const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logs.txt");

const logDeleteContact = ({ contactId, contactName }) => {
  const logMessage = `Contato ID: ${contactId} - Nome: ${contactName} foi excluído em ${new Date()}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Erro ao escrever no arquivo de log:", err);
    }
  });
};

module.exports = { logDeleteContact };
