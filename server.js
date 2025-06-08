const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apgradejson = express();
const ports = 3000;


app.use(cors());
app.use(bodyParser.json());


const users = [];


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  
  const userExists = users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Користувач з таким email вже існує' });
  }
  
  
  const newUser = { email, password };
  users.push(newUser);
  
  res.status(201).json({ message: 'Користувач успішно зареєстрований' });
});


app.post('/login'), (req, res) => {
  const { email, password } = req.body;
}
  
  
  const userF = users.find(user => user.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Невірний email або пароль' });
  }
  
  res.json

  const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());


let upgrades = [
  {
    id: 1,
    name: "Click Accelerator",
    description: "speed of earning x10",
    price: 40000
  },
  {
    id: 2,
    name: "Coin Multiplier",
    description: "ClickCoins per click x10",
    price: 40000
  },
  {
    id: 3,
    name: "Power Tap",
    description: "ClickCoins per click x2",
    price: 40000
  }
];


let nextId = upgrades.length > 0 ? Math.max(...upgrades.map(u => u.id)) + 1 : 1;


function validateUpgrade(upgrade, isNew = true) {
  const errors = [];
  
  if (isNew && !upgrade.id) {
    upgrade.id = nextId++;
  }

  if (!upgrade.name || typeof upgrade.name !== 'string' || upgrade.name.trim() === '') {
    errors.push("Назва апгрейду є обов'язковою та не може бути порожньою");
  }

  if (!upgrade.description || typeof upgrade.description !== 'string' || upgrade.description.trim() === '') {
    errors.push("Опис апгрейду є обов'язковим та не може бути порожнім");
  }

  if (typeof upgrade.price !== 'number' || upgrade.price < 0) {
    errors.push("Ціна має бути додатнім числом");
  }

  return errors;
}


app.get('/upgrades', (req, res) => {
  res.json(upgrades);
});


app.get('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const upgrade = upgrades.find(u => u.id === id);

  if (!upgrade) {
    return res.status(404).json({ error: "Апгрейд не знайдено" });
  }

  res.json(upgrade);
});


app.post('/upgrades', (req, res) => {
  const upgrade = req.body;
  const validationErrors = validateUpgrade(upgrade, false);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  
  if (upgrades.some(u => u.name === upgrade.name)) {
    return res.status(400).json({ error: "Апгрейд з такою назвою вже існує" });
  }

  upgrade.id = nextId++;
  upgrades.push(upgrade);
  res.status(201).json(upgrade);
});


app.put('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const upgradeIndex = upgrades.findIndex(u => u.id === id);

  if (upgradeIndex === -1) {
    return res.status(404).json({ error: "Апгрейд не знайдено" });
  }

  const updatedUpgrade = req.body;
  const validationErrors = validateUpgrade(updatedUpgrade, false);

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  
  if (upgrades.some(u => u.name === updatedUpgrade.name && u.id !== id)) {
    return res.status(400).json({ error: "Апгрейд з такою назвою вже існує" });
  }

 
  updatedUpgrade.id = id;
  upgrades[upgradeIndex] = updatedUpgrade;
  res.json(updatedUpgrade);
});


app.delete('/upgrades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const upgradeIndex = upgrades.findIndex(u => u.id === id);

  if (upgradeIndex === -1) {
    return res.status(404).json({ error: "Апгрейд не знайдено" });
  }

  upgrades = upgrades.filter(u => u.id !== id);
  res.status(204).end();
});


app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apgradejsonjson = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const user = {
  'default': {
    id: 'default',
    balance: 0,
    coinsPerClick: 1,
    passiveIncomePerSecond: 1
  }
};


const checkUser = (req, res, next) => {
  const userId = req.body.userId || 'default';
  
  if (!users[userId]) {
    return res.status(404).json({ 
      error: 'Користувача не знайдено',
      code: 'USER_NOT_FOUND'
    });
  }
  
  req.user = users[userId];
  next();
};


app.post('/click', checkUser, (req, res) => {
  try {
    const user = req.user;
    user.balance += user.coinsPerClick;
    
    res.json({
      balance: user.balance,
      coinsPerClick: user.coinsPerClick
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Внутрішня помилка сервера',
      code: 'SERVER_ERROR'
    });
  }
});


app.post('/passive-income', checkUser, (req, res) => {
  try {
    const user = req.user;
    user.balance += user.passiveIncomePerSecond;
    
    res.json({
      balance: user.balance,
      passiveIncomePerSecond: user.passiveIncomePerSecond
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Внутрішня помилка сервера',
      code: 'SERVER_ERROR'
    });
  }
});


app.get('/user', checkUser, (req, res) => {
  res.json(req.user);
});


app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
  console.log('Доступні ендпоінти:');
  console.log(`POST /click - додати coinsPerClick до балансу`);
  console.log(`POST /passive-income - додати passiveIncomePerSecond до балансу`);
  console.log(`GET /user - отримати дані користувача`);
});

const USER = {
  id: 'default',
  balance: 0,
  coinsPerClick: 1,
  passiveIncomePerSecond: 1
};

const checkUSER = (req, res, next) => {
  if (!user) {
    return res.status(404).json({ 
      error: 'Користувача не знайдено',
      code: 'USER_NOT_FOUND'
    });
  }
  req.user = user;
  next();
};

app.post('/click', checkUser, (req, res) => {
  user.balance += user.coinsPerClick;
  res.json({
    balance: user.balance,
    coinsPerClick: user.coinsPerClick
  });
});

app.post('/passive-income', checkUser, (req, res) => {
  user.balance += user.passiveIncomePerSecond;
  res.json({
    balance: user.balance,
    passiveIncomePerSecond: user.passiveIncomePerSecond
  });
});

app.get('/user', checkUser, (req, res) => {
  res.json(user);
});

document.querySelector('.coingold').addEventListener('click', () => {
  fetch('http://localhost:3000/click', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector('#balance').textContent = data.balance;
  });
});

setInterval(() => {
  fetch('http://localhost:3000/passive-income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  .then(res => res.json())
  .then(data => {
    document.querySelector('#balance').textContent = data.balance;
  });
}, 1000);
1

