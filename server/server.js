const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.join(__dirname, '..', 'dist');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const result = dotenv.config();

const { USER_ID, USER_PWD } = result.parsed;
// console.log(USER_ID, USER_PWD);

const transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: USER_ID,
    pass: USER_PWD
  }
}

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
});

app.post('/send', (req, res) => {
  const { name, email, message } = req.body;
  const content = `name: ${name} \nemail: ${email} \nmessage: ${message} `;
  console.log(content);

  const mail = {
    from: name,
    to: USER_ID,
    subject: 'New Message from Protfolio Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'Failed to send message'
      })
    } else {
      res.json({
        msg: 'Message sent successfully'
      })
    }
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});