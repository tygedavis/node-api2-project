const router = require('express').Router();

const Data = require('../data/db.js');

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
      if(post) {
        res.status(200).json(post);
      } else { //Todo Maybe check up on this error message, just returns an empty array
        res.status(404).json({ message: "The post with that ID does not exist." });
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
      if(!req.body.title || !req.body.contents) { //Todo: Maybe check out why the request still sends even when there is no title or contents
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      }else
        //console.log(post)
        res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: " There was an error while saving the post to the database." });
    });
});


//Todo POST -> Comments (Specific Post ID)
router.post('/:id/comments', (req, res) => {
  const id = req.params.id;
  //Data to send: text / post_id
  //console.log(req.body)

  Data.insertComment(req.body)
    .then(comment => {
      if(comment.post_id !== id) {
        res.status(404).json({ message: "The post with that ID does not exist." })
      }else if(!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
      }else
      res.status(201).json(comment)
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the comment to the database." });
    });
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
      }else if (!req.body.title || !req.body.contents) { //Todo: Still updates title/content when it's empty
        res.status(400).json({ errorMessage: "Please provide a title or some content for the post." });
      } else
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ error: "The new post info could not be updated." });
    });
});



module.exports = router