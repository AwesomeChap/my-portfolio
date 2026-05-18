const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.join(__dirname, '..', 'dist');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { startKeepAlive } = require('./keepAlive');
const result = dotenv.config();

const {
  USER_ID,
  APP_PASSWORD
} = result.parsed || process.env;

const transport = {
  host: 'smtp.gmail.com', 
  port: 465,
  secure: true,
  auth: {
    user: USER_ID,
    pass: APP_PASSWORD
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

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

app.post('/send', (req, res) => {
  const { name, email, message } = req.body;
  const content = `name: ${name} \nemail: ${email} \nmessage: ${message} `;

  const mail = {
    from: name,
    to: "jatin@jatinkumar.tech",
    subject: 'New Message from Contact Form',
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

// Express 4: serve index.html for client-side routes (e.g. reload on /projects)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  startKeepAlive();
});