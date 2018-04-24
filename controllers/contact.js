const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contacto'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('Nombre', 'El Nombre no puede ir vacio').notEmpty();
  req.assert('Correo', 'Correo no valido').isEmail();
  req.assert('Mensaje', 'Mensaje no puede ir en blanco').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'your@email.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contacto por WolfClover',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('Enviado', { msg: 'Correo ha sido Enviado Exitosamente!' });
    res.redirect('/contact');
  });
};
