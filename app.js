const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Sample data
let animes = [
  { id: 1, title: 'Naruto', rating: 4.5, review: 'Great anime with amazing characters.', image: 'https://images.justwatch.com/poster/138627711/s592/naruto' },
  { id: 2, title: 'One Piece', rating: 4.8, review: 'Epic adventure with a fantastic storyline.', image: 'https://images.justwatch.com/poster/304340004/s592/sezon-3' },
  { id: 3, title: 'Attack on Titan', rating: 4.7, review: 'Intense and thrilling from start to finish.', image: 'https://images.justwatch.com/poster/306747132/s718/shingeki-no-kyojin.jpg' }
];

let users = [{ username: 'admin', password: 'admin', role: 'admin' }]; // Admin user example



// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.render('index', { animes });
});

// Anime details route
app.get('/anime/:id', (req, res) => {
  const anime = animes.find(a => a.id === parseInt(req.params.id));
  if (anime) {
    res.render('anime-details', { anime });
  } else {
    res.status(404).send('Anime not found');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user && user.role === 'admin') {
    req.user = user; // Set user to session or request for demo
    res.redirect('/admin');
  } else {
    res.send('Invalid credentials');
  }
});

// Register route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.redirect('/login');
});

// Admin route
app.get('/admin',(req, res) => {
  res.render('admin', { animes });
});


app.post('/admin', (req, res) => {
  const { title, rating, review, image } = req.body;
  const newAnime = { id: animes.length + 1, title, rating: parseFloat(rating), review, image };
  animes.push(newAnime);
  res.redirect('/');
});


app.get('/admin/edit/:id', (req, res) => {
  const anime = animes.find(a => a.id === parseInt(req.params.id));
  if (anime) {
    res.render('edit-anime', { anime });
  } else {
    res.status(404).send('Anime not found');
  }
});

app.post('/admin/edit/:id', (req, res) => {
  const anime = animes.find(a => a.id === parseInt(req.params.id));
  if (anime) {
    anime.title = req.body.title;
    anime.rating = parseFloat(req.body.rating);
    anime.review = req.body.review;
    anime.image = req.body.image;
  }
  res.redirect('/admin');
});

// Delete anime route
app.post('/admin/delete/:id', (req, res) => {
  animes = animes.filter(a => a.id !== parseInt(req.params.id));
  res.redirect('/admin');
});

app.get("/contact",(req,res) => {

res.redirect("/contact", {user: req.user || null})


})

app.listen(port, () => {
  console.log(`Anime site running at http://localhost:${port}`);
});
