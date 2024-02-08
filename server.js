const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Funzione per l'autenticazione degli utenti
function authenticate(username, password) {
  // Carica dati utente da JSON
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

  // Controlla se le credenziali sono valide
  if(users[username] && users[username].password === password){
    return users[username].info;
  }
  else{
    return null;
  }
}

// Questo ti porta alla pagina di login
app.get('/', (req, res) => {
  res.render('login');
});

// Pagina di login
app.post('/login', (req, res) => {
  const {username, password} = req.body;

  // Qui viene eseguita l'autenticazione
  const user = authenticate(username, password);

  if(user){
    // Se l'autenticazione ha successo, reindirizza alla pagina App_GrantedUser
    res.render('App_GrantedUser', {username, password});
  }
  else{
    // Se l'autenticazione fallisce, reindirizza alla pagina notPermissionToAccess
    res.redirect('/notPermissionToAccess');
  }
});

// Questo ti porta alla pagina di sign up
app.get('/sign_up', (req, res) => {
  res.render('sign_up');
});

// Qui viene gestita la registrazione
app.post('/sign_up', (req, res) => {
  const {username, password} = req.body;

  try{
    // Qui viene letto il file utenti.json
    const users = JSON.parse(fs.readFileSync('utenti.json', 'utf-8'));

    // Qui viene verificato se l'utente esiste già
    
    // Qui aggiunto il nuovo utente
    users[username] = {password: password, info: 'nuovo Utente'};
    
    // Qui viene scritto l'oggetto aggiornato nel file users.json
    fs.writeFileSync('users.json', JSON.stringify(utenti, null, 2));
    
    // Qui si viene reindirizzati in un'area riservata dopo la registrazione
    if (users[username]) {
      res.redirect('/'); // oppure viene gestito il caso in cui l'utente esista già
      return;
    }
    res.redirect('/');
  }
  catch(error){
    console.error('Errore durante la registrazione:', error);
    res.status(500).send('Errore durante la registrazione');
  }
});

// Questo ti porta alla pagina di accesso negato
app.get('/accessDenied', (req, res) => {
  res.render('accessDenied');
});

// Gestione della cancellazione dell'utente
app.post('/deleteUser', (req, res) => {
  // Qui viene verificata la password e cancellato l'utente dal file users.json
  // Reindirizza all'area riservata dopo la cancellazione
  const {username, password} = req.body;
  res.redirect('/');
});

// Qui viene gestita la modifica dell'utente
app.post('/modifyUser', (req, res) => {
  // Qui viene verificata la password e cancellato l'utente dal file users.json
  // Reindirizza all'area riservata dopo la modifica
  const oldUsername = req.body.oldUsername;
  const oldPassword = req.body.oldPassword;
  const newUsername = req.body.newUsername;
  const newPassword = req.body.newPassword;
  res.redirect('/');
});

// Qui avviato il server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
