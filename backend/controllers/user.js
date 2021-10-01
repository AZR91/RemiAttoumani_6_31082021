const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cryptojs = require('crypto-js');
require('dotenv').config();


exports.signup = (req, res, next) => {
  console.log("Je passe par là!");
   console.log(req.body);
   // console.log(res);
  const hashedEmail = cryptojs.HmacSHA512(req.body.email, process.env.SECRET_TOKEN).toString(cryptojs.enc.Base64);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: hashedEmail,
        password: hash
      });
      console.log(user);
      console.log("Je passe encore par là!");
      /** Résoudre ce save */
      /*user.save()
        .then(() => {res.status(201).json({ message: 'Utilisateur créé !' });
      console.log("J'entre dans le save!");})
        .catch(error => res.status(400).json({ error }));*/
         // new User(req.body).save();
         user.save(function(err, user){
 if(err) return console.error(err);
 console.log(" User saved succussffully");
         });
        console.log("Je passe encore encore par là!");
    })
    .catch(error => { 
      console.log(error)
      return res.status(500).json({ error }) });
};

exports.login = (req, res, next) => {
  const hashedEmail = cryptojs.HmacSHA512(req.body.email, process.env.SECRET_TOKEN).toString(cryptojs.enc.Base64);
  User.findOne({ email: hashedEmail })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};