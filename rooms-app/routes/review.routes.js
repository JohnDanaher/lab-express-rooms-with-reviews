const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const Review = require("../models/Review.model")
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/write/:id", (req, res) => {
    const {id} = req.params;

    Room.findById(id)
    .then((room) => {
    res.render('review/write', room)
    })
    .catch(error => console.log(error))
})

  router.post("/write/:id", isLoggedIn, (req, res) => {
    const { review } = req.body;
    const creator = req.session.currentUser;
    const {id} = req.params;

    Review.create({ user: creator, comment: review })
        .then(newReview => {
            Room.findById(id)
                .then(room => {
                    if(creator._id == room.owner){
                    res.redirect(`/review/write/${id}`)
                    }
                    else{
                        room.reviews.push(newReview._id);
                        room.save()
                        .then(() => res.redirect(`/review/write/${id}`))
                    }
                })
                .catch(err => console.log(err))
        })

        .catch(err => console.log(err));
});

router.get("/reviews/:id", (req, res) => {
    const {id} = req.params;

    Room.findById(id)
    .populate('reviews')
    .then((room) => {
        res.render("review/reviews", {reviews: room.reviews})
    })
    .catch(error => console.log(error))

})


module.exports = router;
