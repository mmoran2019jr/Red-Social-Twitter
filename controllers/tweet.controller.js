'use strict'

var Tweet = require("../models/tweets.model");
var User = require("../models/user.model");

function add_tweet (req, res, substring) {
    let user = req.user.username
    substring.splice(0, 1)
    let descripcion_Tweet = substring.join(" ")

    if (descripcion_Tweet) {

        Tweet.findOneAndUpdate({ username: user }, { $push: { tweets: { description: descripcion_Tweet } } }, { new: true }, (err, updateTweet) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición 1" })
            if (!updateTweet) return res.status(404).send({ error: "No se ha podido agregar el tweet" })
            if (updateTweet) {

                User.findOneAndUpdate({ username: user }, { $inc: { "numTweets": 1 } }, { new: true }, (err, tweetInc) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta petición 2" })
                    if (!tweetInc) return res.status(404).send({ error: "No se ha podido agregar el tweet" })
                    if (tweetInc) return res.status(200).send({ Tweet_Agregado: updateTweet })

                })
            }

        })

    } else {
        return res.status(500).send({ message: "Faltan datos para completar la solicitud" });
    }

}


function edit_tweet (req,res,substring){
    let user = req.user.username
    let tweetId = substring[1]
    substring.splice(0, 2)
    let descripcion_Tweet = substring.join(" ")

    if (descripcion_Tweet) {

        Tweet.findOneAndUpdate({ username: user, 'tweets._id': tweetId }, { "$set": { "tweets.$.description": descripcion_Tweet } }, { new: true }, (err, updateTweet) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!updateTweet) return res.status(404).send({ error: "No se ha podido editar el tweet" })
            if (updateTweet) return res.status(200).send({ Tweet_Actualizado: updateTweet })

        })

    } else {
        return res.status(500).send({ message: "Faltan datos para completar la solicitud" })
    }

}


function delete_tweet (req,res, substring){
    let user = req.user.username
    let tweetId = substring[1]

    if (tweetId) {
        Tweet.findOne({ 'tweets._id': tweetId }, (err, tweetFinded) => {
            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición 1" })
            if (!tweetFinded) return res.status(404).send({ error: "No se ha encontrado el tweet" })
            if (tweetFinded) {

                Tweet.findOneAndUpdate({ username: user }, { $pull: { tweets: { _id: tweetId } } }, (err, deleteTweet) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta petición 2" })
                    if (!deleteTweet) return res.status(404).send({ error: "No se ha podido eliminar el tweet" })
                    if (deleteTweet) {

                        User.findOneAndUpdate({ username: user }, { $inc: { "numTweets": -1 } }, { new: true }, (err, tweetInc) => {

                            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición 3" })
                            if (!tweetInc) return res.status(404).send({ error: "No se ha podido decrementar los tweets" })
                            if (tweetInc) return res.status(200).send({ Tweet_Eliminado: deleteTweet })

                        })
                    }

                })

            }
        })

    } else {
        return res.status(500).send({ message: "Faltan datos para completar la solicitud" })
    }

}


function view_tweets (req,res,substring){
    let username = substring[1]

    if (username) {

        Tweet.findOne({ username: username }, (err, tweets) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta petición" })
            if (!tweets) return res.status(404).send({ error: "No existe el usuario" })
            if (tweets) return res.status(200).send({ User_Tweets : tweets })

        })

    } else {

        return res.status(500).send({ message: "Faltan datos para completar la solicitud" })
    }
}


module.exports = {
    add_tweet,
    edit_tweet,
    delete_tweet,
    view_tweets
}