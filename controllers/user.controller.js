'use strict'

//Import de dependencias
var jwt = require("../services/jwt");
var bcrypt = require("bcrypt-nodejs");

//Import de Modelos
var User = require("../models/user.model");
var Tweet = require("../models/tweets.model");
var Follower = require("../models/follower.model");
var Following = require("../models/following.model");

//Import de Controladores
var tweetController = require("../controllers/tweet.controller");
var followsControlller = require("../controllers/follows.controller");


function commands(req, res) {
    let params = req.body;
    let substring = params.commands.split(" ");
    let string = substring[0].toLowerCase();
    
    switch (string){
        case "register" :
            register(req,res,substring);
        break

        case "login":
            login(req, res, substring);
        break

        case "add_tweet":
            tweetController.add_tweet(req, res, substring);
        break

        case "edit_tweet":
            tweetController.edit_tweet(req,res, substring);
        break

        case "delete_tweet":
            tweetController.delete_tweet(req,res, substring);
        break

        case "view_tweets":
            tweetController.view_tweets(req,res,substring);
        break

        case "view_profile":
            view_profile(req,res, substring); 
        break

        case "follow":
            followsControlller.follow(req,res, substring);
        break 

        case "unfollow":
            followsControlller.unfollow(req,res,substring);
        break
    }
}

function register(req, res, substring) {
    let user = new User();
    let tweet = new Tweet();
    let follower = new Follower();
    let following = new Following();

    if (substring[1] && substring[2] && substring [3] && substring[4]) {
        user.name = substring[1]
        user.email = substring[2]
        user.username = substring[3]
        user.password = substring[4]

        User.find({ username: user.username }).exec((err, users) => {

            if (err) return res.status(500).send({ message: "Error al hacer la petición" })
            if (users && users.length >= 1) {
                return res.status(200).send({ message: "El usuario ya existe" })
            } else {
                bcrypt.hash(user.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion al guardar' })
                        if (usuarioGuardado) {
                            tweet.username = user.username
                            tweet.tweets = []
                            tweet.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar tweets" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            follower.username = user.username
                            follower.followers = []
                            follower.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar followers" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            following.username = user.username
                            following.followings = []
                            following.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error al generar followings" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            return res.status(200).send({ User: usuarioGuardado })
                        } else {
                            return res.status(200).send({ message: 'No se pudo registar el usuario' })
                        }
                    })
                })
            }

        })

    }else {
        return res.status(500).send({message: 'Faltan datos para completar la solicitud'})
    }
}


function login(req, res, substring) {
    let params = req.body
    let username = substring[1]
    let email = substring[1]
    let password = substring[2]

    if (substring[3]){
        var gettoken = substring[3].toLowerCase() == "true" ? true:false
    }else {
        return res.status(500).send({message: "Genera el token en la linea de comandos _true_"})
    }

    User.findOne({$or:[{username: username}, {email: email}]}, (err, usuario) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' })
        if (usuario) {
            bcrypt.compare(password, usuario.password, (err, check) => {
                if (check) {
                    if (gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    }
                    else {   
                        return res.status(200).send({error: 'El comando no es valido'})
                    }
                }
                else {
                    return res.status(404).send({ message: 'No se ha encontrado al usuario' })
                }
            })
        }
        else {
            return res.status(500).send({ message: 'No has podido ingresar'})
        }
    })

}

function view_profile(req,res,substring){
    let username = substring[1]
    
    if (username) {
        User.findOne({ username: username }, (err, user) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!user) return res.status(404).send({ error: "No existe el usuario" })
            if (user){

            Tweet.findOne({username: username},(err,tweets)=>{
                if(err) return res.status(500).send({error: "No se pudo realizar la peticion"})
                if (!tweets) return res.status(404).send({error: "No se han encontrado los tweets"})
                if (tweets){
                    user.password = undefined
                    tweets.username = undefined
                    return res.status(200).send({User_Profile: user, tweets})      
                 } 
                })
               
            }
        });

    } else {

        return res.status(500).send({ message: "Faltan datos para completar la solicitud" })

    }
}


module.exports = {
    commands
}