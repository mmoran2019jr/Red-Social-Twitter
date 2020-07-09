'use strict'

var Following = require("../models/following.model");
var User = require("../models/user.model");
var Follower = require("../models/follower.model");


function follow(req, res, substring) {
    let user = req.user.username
    let username = substring[1]


    if (username) {
        if (user === username) {
            return res.status(200).send({ error: "Esta opcion no es valida" });
        } else {
            Following.findOne({ username: username, 'followings.username': username }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion1" });
                if (followingUser) return res.status(404).send({ message: "Ya sigues a este usuario" });
                if (!followingUser) {

                    User.findOne({ username: username }, (err, findUser) => {

                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion2" });
                        if (!findUser) return res.status(404).send({ error: "El usuario que quieres seguir no existe" });
                        if (findUser) {

                            Following.findOneAndUpdate({ username: user }, { $push: { followings: { username: username } } }, { new: true }, (err, updateFollowing) => {

                                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion3" });
                                if (!updateFollowing) return res.status(404).send({ error: "No has podido seguir al usuario" });
                                if (updateFollowing) {

                                    User.findOneAndUpdate({ username: user }, { $inc: { "numFollowing": 1 } }, { new: true }, (err, followingInc) => {

                                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion4" });
                                        if (!followingInc) return res.status(404).send({ error: "No se ha podido agregar el usuario" });
                                        if (followingInc) {

                                            Follower.findOneAndUpdate({ username: username }, { $push: { followers: { username: user } } }, { new: true }, (err, updateFollower) => {

                                                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion5" });
                                                if (!updateFollower) return res.status(404).send({ error: "No se ha podido agregar al seguidor" });
                                                if (updateFollower) {
                                                    User.findOneAndUpdate({ username: username }, { $inc: { "numFollowers": 1 } }, { new: true }, (err, followerInc) => {

                                                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion5" });
                                                        if (!followerInc) return res.status(404).send({ error: "No se ha podido aumentar los seguidores" });
                                                        if (followerInc) return res.status(200).send({ Num_Followings: updateFollowing });
                                                    });
                                                }

                                            });

                                        }

                                    });
                                }

                            });

                        }

                    });
                }

            });
        }
    } else {
        return res.status(500).send({ message: "Llenar todos los campos" });
    }
}


function unfollow(req,res,substring){
    let user = req.user.username
    let username = substring[1]

    if (username) {
        if (user === username) {
            return res.status(200).send({ error: "Esta opcion no es valida" });
        } else {
            Following.findOne({ username: user, 'followings.username': username }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion1" });
                if (!followingUser) return res.status(404).send({ error: "No puedes dejar de seguir a un usuario que no sigues" });
                if (followingUser) {

                    User.findOne({ username: username }, (err, findUser) => {

                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion2" });
                        if (!findUser) return res.status(404).send({ error: "El usuario que quieres seguir no existe" });
                        if (findUser) {

                            Following.findOneAndUpdate({ username: user }, { $pull: { followings: { username: username } } }, { new: true }, (err, updateFollowing) => {

                                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion3"});
                                if (!updateFollowing) return res.status(404).send({ error: "No se ha podido dejar de seguir al usuario"});
                                if (updateFollowing) {

                                    User.findOneAndUpdate({ username: user }, { $inc: { "numFollowing": - 1 } }, (err, followingInc) => {

                                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion4"});
                                        if (!followingInc) return res.status(404).send({ error: "No se ha podido dejar de seguir al usuario" });
                                        if (followingInc) {

                                            Follower.findOneAndUpdate({ username: username }, { $pull: { followers: { username: user } } }, (err, updateFollower) => {

                                                if (err) return res.status(500).send({ error: "No se puede realizar esta peticion5" });
                                                if (!updateFollower) return res.status(404).send({ error: "No has podido dejar de seguir al usuario" });
                                                if (updateFollower) {
                                                    User.findOneAndUpdate({ username: username }, { $inc: { "numFollowers": - 1 } }, (err, followerInc) => {

                                                        if (err) return res.status(500).send({ error: "No se puede realizar esta peticion6" });
                                                        if (!followerInc) return res.status(404).send({ error: "No se ha podido decrementar los seguidos" });
                                                        if (followerInc) return res.status(200).send({ Num_Followings: updateFollowing });
                                                    });
                                                }

                                            });

                                        }

                                    });
                                }

                            });

                        }

                    });
                }

            });
        }
    } else {
        return res.status(500).send({ message: "Llenar todos los campos" });
    }
}


module.exports = {
    follow,
    unfollow
}