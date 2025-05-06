const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

let data = JSON.parse(fs.readFileSync('data.json'));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function validateUser(req, res, next) {
  const user = req.body;
  
  if (data.some(u => u.id === user.id)) {
    return res.send("error: ID duplicated" );
  }
  
  if (data.some(u => u.email === user.email)) {
    return res.send("error: Email duplicated" );
  }

  next();
}

app.post('/', validateUser, (req, res) => {
  data.push(req.body);
  saveData();
  res.send("created successfully");
});

app.get('/', (req, res) => {
  res.json(data);
});


app.patch('/:id', validateUser, (req, res) => {
  data[index] = { ...data[index], ...req.body };
  saveData();
  res.json("User updated successfully");
});

app.delete('/:id', (req, res) => {
  data = data.filter(u => u.id !== req.params.id);
  saveData();
  res.json("User deleted successfully");
});