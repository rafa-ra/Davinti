const Contact = require("../models/contact");
const TelephoneNumber = require("../models/telephoneNumber");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const { logDeleteContact } = require("../logger");

//-----------------------------------------GET-------ADD--NEW--------CONTACTS
exports.getAddContact = (req, res, next) => {
  res.render("contacts/add-contact", {
    pageTitle: "Novo contato",
    path: "/add-contact",
    editMode: false,
    hasError: true,
    errorMessage: null,
    contact: { id: "", name: "", age: "", Telefones: [] },
  });
};

//--------------------------------------------------POST ADD CONTACT
exports.postAddContact = (req, res, next) => {
  function transformPhoneNumber(phoneNumber) {
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    const transformedNumber = digitsOnly.replace(
      /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
      "$1 $2 $3 $4"
    );
    return transformedNumber;
  }

  const telephone1 = transformPhoneNumber(req.body.telephone1);
  const telephone2 = transformPhoneNumber(req.body.telephone2);
  const telephones = [telephone1, telephone2];

  if (telephone2 === "") {
    telephones.pop();
  }

  const { name, age } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("contacts/add-contact", {
      pageTitle: "Novo contato",
      path: "/add-contact",
      editMode: false,
      hasError: true,
      contact: {
        id: "",
        nome: name,
        idade: age,
        Telefones: telephones,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  Contact.create({ nome: name, idade: age })
    .then((newContact) => {
      const telephonePromises = telephones.map((telephone) => {
        if (telephone != "") {
          return TelephoneNumber.create({
            NUMERO: telephone,
            IDCONTATO: newContact.id,
          });
        }
      });

      return Promise.all(telephonePromises);
    })
    .then(() => {
      res.redirect("/contacts");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

//-----------------------------------------GET-------ALL--------CONTACTS
exports.getContacts = (req, res, next) => {
  const searchQuery = req.query["search-input"];

  if (searchQuery) {
    Contact.findAll({
      include: [{ model: TelephoneNumber, attributes: ["NUMERO"] }],
      where: {
        [Op.or]: [
          { nome: { [Op.like]: `%${searchQuery}%` } },
          { "$Telefones.NUMERO$": { [Op.like]: `%${searchQuery}%` } },
        ],
      },
    })
      .then((contacts) => {
        if (!contacts) {
          return res
            .status(500)
            .json({ error: "Não foram encontrados contatos" });
        }
        res.render("contacts/contacts", {
          pageTitle: "Contatos",
          path: "/contacts",
          contacts: contacts,
          searchQuery: searchQuery, // Passar o valor de busca para a view
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/500");
      });
  }

  Contact.findAll({
    include: [{ model: TelephoneNumber, attributes: ["NUMERO"] }],
  })
    .then((contacts) => {
      if (!contacts) {
        return res
          .status(500)
          .json({ error: "Não foram encontrados contatos" });
      }
      res.render("contacts/contacts", {
        pageTitle: "Contatos",
        path: "/contacts",
        contacts: contacts,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

//-----------------------------------------POST----SEARCH------CONTACTS

// exports.postSearchContacts = (req, res, next) => {
//   const searchTerm = req.body["search-input"];

//   if (searchTerm === "") {
//     return res.redirect("/contacts");
//   }

//   return res.render("contacts/contacts", {
//     pageTitle: "Contatos",
//     path: "/contacts",
//     searchTerm: searchTerm,
//   });
// };

//-----------------------------------------GET-------EDIT--------CONTACT
exports.getEditContact = (req, res, next) => {
  const contactId = req.params.contactId;

  Contact.findByPk(contactId, { include: TelephoneNumber })
    .then((contact) => {
      contact.Telefones = contact.Telefones.map((tel) => {
        return tel.dataValues;
      });
      if (!contact) {
        return res.redirect("/500");
      }

      currentContact = contact.dataValues;
      res.render("contacts/add-contact", {
        pageTitle: "Editar contato",
        path: "/edit-contact",
        editMode: true,
        hasError: false,
        contact: contact,
        errorMessage: null,
      });
    })
    .catch((err) => console.log(err));
};
//-----------------------------------------POST-----EDIT-----------CONTACT
exports.postEditContact = (req, res, next) => {
  function transformPhoneNumber(phoneNumber) {
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    const transformedNumber = digitsOnly.replace(
      /^(\d{2})(\d{2})(\d{5})(\d{4})$/,
      "$1 $2 $3 $4"
    );
    return transformedNumber;
  }
  const telephone1 = transformPhoneNumber(req.body.telephone1);
  const telephone2 = transformPhoneNumber(req.body.telephone2);

  const errors = validationResult(req);
  const telephones = [telephone1, telephone2];
  const id = req.body.contactId;
  const name = req.body.name;
  const age = req.body.age;

  if (!errors.isEmpty()) {
    console.log("--------------", telephones, "------------");

    return res.status(422).render("contacts/add-contact", {
      pageTitle: "Editar contato",
      path: "/edit-contact",
      editMode: true,
      hasError: true,
      contact: {
        id: id,
        nome: name,
        idade: age,
        Telefones: telephones,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Contact.findByPk(id)
    .then((contact) => {
      if (!contact) {
        return res.redirect("/500");
      }
      return contact.update({ nome: name, idade: age });
    })
    .then((updatedContact) => {
      return TelephoneNumber.destroy({
        where: { IDCONTATO: updatedContact.id },
      });
    })
    .then((result) => {
      const telephonePromises = telephones.map((telephone) => {
        if (telephone !== "") {
          return TelephoneNumber.create({ NUMERO: telephone, IDCONTATO: id });
        }
      });

      return Promise.all(telephonePromises);
    })
    .then(() => {
      res.status(200).redirect("/contacts");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });
};

//-----------------------------------------DELETE-----CONTACT
exports.deleteContact = (req, res, next) => {
  const contactId = req.body.contactId;
  Contact.findByPk(contactId)
    .then((contact) => {
      const contactInfo = {
        contactId: contact.dataValues.id,
        contactName: contact.dataValues.nome,
      };
      logDeleteContact(contactInfo);
      return contact.destroy();
    })
    .then((result) => {
      res.redirect("/contacts");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/500");
    });

  // Contact.findByPk(id)
  //   .then((contact) => {
  //     if (!contact) {
  //       return res.status(404).json({ error: "Contato não encontrado" });
  //     }
  //     return Contact.destroy({ where: { id } });
  //   })
  //   .then(() => {
  //     res.status(204).json({ message: "Contato excluído" });
  //   })
  //   .catch((error) => {
  //     res.status(500).json({ error: "Falha ao excluir contato" });
  //   });
};
