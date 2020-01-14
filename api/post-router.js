const router = require('express').Router();

const Data = require('../data/db.js');

// ✔ GET -> Posts (general)
router.get('/', (req, res) => {
  Data.find()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The posts information could not be retrieved" })
    })
})

//Todo GET -> Posts (Specific ID)


//Todo GET -> Comments (Specific ID)


//Todo POST -> Posts


//Todo POST -> Comments (Specific ID)


//Todo DELETE -> Posts (Specific ID)


//Todo PUT -> Posts (Specific ID)

module.exports = router