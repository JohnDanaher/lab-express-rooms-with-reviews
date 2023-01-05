const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/create", isLoggedIn, (req, res) => {
    res.render("room/create");
  });

router.post("/create", isLoggedIn, (req, res) => {
    const { name, description, imageUrl } = req.body;
    const creator = req.session.currentUser;

    Room.create({ name, description, imageUrl, owner: creator._id })
          .then(newRoom => {
            res.redirect('/room/list')
          })
          .catch(error => console.log(`Error while creating a new room: ${error}`));
});

router.get("/list", (req, res) => {

    Room.find()
      .then(roomList => {
        res.render('room/list', { rooms: roomList });
      })
      .catch(err => console.log(`Error while getting the rooms from the DB: ${err}`));
});


router.get('/edit/:id', isLoggedIn, (req, res) => {
    const {id} = req.params;

    Room.findById(id)
    .then(roomToEdit => {
        res.render('room/edit', roomToEdit)
    })
    .catch(error => console.log(error))
  });

router.post("/edit/:id", isLoggedIn, (req, res) => {
    const { name, description, imageUrl } = req.body;
    const user = req.session.currentUser;
    const {id} = req.params;

    Room.findByIdAndUpdate(id, { name, description, imageUrl }, { new: true })
    .then((room) => {
        if(room.owner._id.toString() == user._id){
        res.redirect(`/room/list`)
        } else {
            res.render("auth/login")
        }
    })
    .catch(error => console.log(`Error while updating a single movie: ${error}`));
});

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const user = req.session.currentUser;

    Room.findById(id)
    .then((room) => {
        if(room.owner._id.toString() == user._id){
            Room.findByIdAndRemove(id)
            .then(() => res.redirect('/room/list'))
        } else {
            res.render("auth/login")
        }
    })
    .catch(err => console.log(err))
})

module.exports = router;
