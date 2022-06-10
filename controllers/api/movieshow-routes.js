//change name of this file to movieshow routes
const router = require('express').Router();
const { MovieShow, StreamingService, User } = require('../../models/index.js');
const withAuth = require('../../utils/auth');
const { Op } = require("sequelize");

//AA - need to put withAuth back in these once complete.

// Raj advice===what you could try if you want to put withAuth back in is put it back in to the 
// post route and then hit the login route first with a valid username and password in the JSON and then try hitting the post route
router.post('/', (req, res) => {

    MovieShow.create({
      title: req.body.title,
      yearReleased: req.body.yearReleased,
    //   user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
//could send query params on url and use in where clause by name
//to access query params, use req.query.whateverparamiscalled
//can use where clause for genres too. [op.or]. can detect if there's a query param of genres.
// ***SAM- linking MovieShow 'GET' route data to 'StreamingService' in models
// Get all posts
router.get("/", async (req, res) => {
  MovieShow.findAll({
      attributes: ["id", "title", "yearReleased", "image_url",],
      include: [{
              model: StreamingService,
              attributes: ["id"],
          },
      ],
    })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});


//get route for search form
router.get('/search', async (req, res) => {
  try {
    const { title, yearReleased, streamingservice_id, genre, rating } = req.body
    const orArray = []
    if (title) {
      //in this movie title, find all space characters, replace pluses with spaces.
      orArray.push( { title: title.replace(/\+/g, ' ') })
    }
    if (yearReleased) {
      orArray.push({ yearReleased })
    }
    if (streamingservice_id) {
      orArray.push({ streamingservice_id })
    }
    if (genre) {
      orArray.push({ genre })
    }
    if (rating) {
      orArray.push({ rating })
    }

    const results = await MovieShow.findAll({
      where: { [Op.or]: orArray }
    })
    console.log(results)
    res.json(results)
  } catch(err) {
    res.status(500).json(err)
    }
});


//update existing movie or show
// router.put('/:id', withAuth, async (req, res) => {
//   try {
//     const [affectedRows] = await MovieShow.update(req.body, {
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (affectedRows > 0) {
//       res.status(200).end();
//     } else {
//       res.status(404).end();
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
