const bcrypt = require('bcrypt');
const User = require('../models/User');

// Signup route
authRoutes.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User created');
  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Invalid username length' });
  }
});

// Login route
authRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.send('Logout');
});

module.exports = authRoutes;
