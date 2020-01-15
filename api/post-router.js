const router = require('express').Router();

const Data = require('../data/db.js');

//TODO There are two problems where you need to cancell the requests or else data is still sent through

// ✔ GET -> Posts (general)
router.get('/', (req, res) => {
  Data.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      //console.log(err)
      res.status(500).json({ error: "The posts information could not be retrieved" });
    });
});

// ✔ GET -> Posts (Specific ID)
router.get('/:id', (req, res) => {
  const id = req.params.id;

  Data.findById(id)
    .then(post => {
      //console.log(post)
      if(!post) {
        res.status(404).json({ message: "The post with that ID does not exist." });
      } else {
        res.status(200).json(post);
      };
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be retrieved." })
    });
});


// ✔ GET -> Comments (Specific ID)
router.get('/:id/comments', (req, res) => {
  const id = req.params.id;

  Data.findPostComments(id)
    .then(comments => {
      //console.log(comments)
      res.status(200).json(comments)
    })
    .catch(err => {
      res.status(500).json({ error: "The comments info could not be retrieved." });
    });
});


// ✔ POST -> Posts
router.post('/', (req, res) => {

  Data.insert(req.body)
    .then(post => {
      //console.log(post) //post = post id
      //console.log(req.body) //req.body = title / contents
      if(!req.body.title || !req.body.contents) { //TODO: Cancell Request
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      }else
        res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: " There was an error while saving the post to the database." });
    });
});


// ✔ POST -> Comments (Specific Post ID)
router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  req.body = {...req.body, post_id : id};

  Data.findById(id)
    .then(post => {
      if(!post) {
        res.status(404).json({ error: "No posts with that ID." });
      }else if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
      }else if(post) {
        Data.insertComment(req.body)
          .then(comment => {
            //console.log(comment)
            res.status(201).json(comment);
          })
          .catch(err => {
            console.log(err)
            res.status(400).json({ error: "You suck" });
          })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the comment to the database." });
    })
});


// ✔ DELETE -> Posts (Specific ID)
router.delete('/:id', (req, res) => {
  const id = req.params.id
  //console.log(id)

  Data.remove(id)
    .then(deletedPost => {
      res.status(200).json(deletedPost);
    })
    .catch(err => {
      res.status(404).json({ message: "The post with that ID doesn't exist." });
    });
});

// ✔ PUT -> Posts (Specific ID)
router.put('/:id', (req, res) => {
  const id = req.params.id;
  //console.log("id", id)

  Data.update(id, req.body)
    .then(post => {
      //console.log('Post',post)
      if(!post) {
        res.status(404).json({ errorMessage: "The user with that ID does not exist." });
      }else if (!req.body.title || !req.body.contents) { //TODO: Cancell Request
        res.status(400).json({ errorMessage: "Please provide a title or some content for the post." });
      } else
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ error: "The new post info could not be updated." });
    });
});



module.exports = router