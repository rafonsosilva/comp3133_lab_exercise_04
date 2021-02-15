const express = require('express')
const mongoose = require('mongoose')
const User = require('./schemas/User')

const usersData = require('./UserData.json')

const app = express()
const port = 3000

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

mongoose.connect(
  'mongodb://localhost:27017/lab-exercise-04',
  {
    useUnifiedTopology: true
  }
)
  .then(() => console.log('Mongo DB connected'))
  .catch(err => console.log('Error:', err))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/users', (req, res) => {
  let errors = []
  usersData.map(async (user) => {
    const newUser = new User(user)
    let error = newUser.validateSync();
    errors.push({ ...error.errors, user: newUser.id });
    await newUser.save()
    
  })

  let ErrMsg = "";

  errors.map((msg) => {
    ErrMsg += `ID: ${msg.user}\n`;

    Object.keys(msg).map((key) => {
      if(msg[key].message !== undefined)
      ErrMsg += `${msg[key].message}\n`
    });

    ErrMsg += "\n"
  });

  if (ErrMsg !== '') {
    res.send(ErrMsg)
  } else {
    res.send('Data successfully saved in the database')
  }

  
})

