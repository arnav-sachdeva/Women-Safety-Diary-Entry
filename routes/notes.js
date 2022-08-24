const router = require('express').Router();
const Profanity = require('profanity-js');
let Note = require('../models/note.model');
const fast2sms = require('fast-two-sms');

router.route('/').get((req,res) => {
  Note.find()
    .then(notes => res.json(notes))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const googleId = req.body.googleId;
  const title = req.body.title;
  const description = req.body.description;

  const newNote = new Note({
    googleId,
    title,
    description
  });

  newNote.save()


 


  .then(() => res.json('Note added!'))
  .catch(err => res.status(400).json('Error: ' + err));


  
//declare profanity words

  let config = {
    wordsList: ['rape','harass','raped','forced', 'dowry']
};



// check profanity and send message
const profanity = new Profanity(description, config)

if(profanity.isProfane(description)){
  const response = fast2sms.sendMessage({
    authorization: "",
    message: "Alert in the following Google ID: " + googleId,
    numbers: [""]
  });
}
  
});

// Using this to fetch notes of a particular user with googleId
router.route('/:googleId').get((req, res) => {
  Note.find({googleId : req.params.googleId})
    .then(note => res.status(200).json(note))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:_id').delete((req, res) => {
  Note.deleteOne({_id:req.params._id})
    .then(() => res.json('Note deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:_id').put((req, res) => {
  Note.findOne({_id:req.params._id})
    .then(note => {
      note.title = req.body.title;
      note.description = req.body.description;

      note.save()
        .then(() => res.json('Note updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;