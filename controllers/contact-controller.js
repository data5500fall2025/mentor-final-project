const Contact = require("../models/contact-model");



// Show contact form
exports.getContact = (req, res, next) => {
  try {
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
    });
  } catch (err) {
    next(err);
  }
};

// Thank-you page
exports.getThanks = (req, res, next) => {
  try {
    res.render("thanks", {
      pageTitle: "Thank You",
      pageClass: "contact-page",
    });
  } catch (err) {
    next(err);
  }
};

// Handle contact form submission
exports.postContact = async (req, res, next) => {
  try {
    await Contact.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      phone: req.body.phone,
      message: req.body.message,
    });

    res.redirect("/contacts/thanks");
  } catch (err) {
    console.error("Contact submission error:", err);

 
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
      errorMessage: "Something went wrong. Please try again.",
      formData: req.body,
    });
  }
};

// ADMIN CONTACT RESPONSE ROUTES

// List contacts with no response
exports.getContactsWithNoResponse = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ response: "" });

    res.render("admin/contact-list", {
      pageTitle: "Respond to Contacts",
      pageClass: "admin-page",
      contacts,
    });
  } catch (err) {
    next(err);
  }
};

// Show response form for a single contact
exports.getContactResponseForm = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      // If contact doesn't exist, send to list view instead of crashing
      return res.redirect("/admin/contacts");
    }

    res.render("admin/contact-response", {
      pageTitle: "Respond to Contact",
      pageClass: "admin-page",
      contact,
    });
  } catch (err) {
    next(err);
  }
};

// Save admin's contact response
exports.postContactResponse = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.redirect("/admin/contacts");
    }

    contact.response = req.body.response;
    contact.responseDate = new Date();

    await contact.save();

    res.redirect("/admin/contacts");
  } catch (err) {
    next(err);
  }
};
