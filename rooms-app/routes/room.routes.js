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

    Room.create({ name, description, imageUrl })
          .then(newRoom => {
            res.redirect('/room/list')
          })
          .catch(error => console.log(`Error while creating a new room: ${error}`));
});

router.get("/list", isLoggedIn, (req, res) => {
    // Room.find()
    // .then(rooms => res.render("room/list", rooms))
    Room.find()
      .then(roomList => {
        console.log(roomList);
        res.render('room/list', { rooms: roomList });
      })
      .catch(err => console.log(`Error while getting the rooms from the DB: ${err}`));
});

router.get('/edit/:id', isLoggedIn, (req, res) => {
    const {id} = req.params;

    Room.findById(id)
    .then(roomToEdit => {
        console.log(id);
        res.render('room/edit', roomToEdit)
    })
    .catch(error => console.log(error))
  });

router.post("/edit/:id", isLoggedIn, (req, res) => {
    const { name, description, imageUrl } = req.body;
    const {id} = req.params;

    Room.findByIdAndUpdate(id, { name, description, imageUrl }, { new: true })
    .then(() => res.redirect(`/room/list`))
    .catch(error => console.log(`Error while updating a single movie: ${error}`));
});



module.exports = router;
