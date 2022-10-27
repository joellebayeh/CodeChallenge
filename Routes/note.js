const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const noteControler = require('../Controlers/note');
const isAuth = require('../middleware/is-auth');

 
// GET /Note/notes
router.get('/notes', isAuth, noteControler.getNotes);

// GET /Note/notes:tag
router.get('/notes/:tag', isAuth, noteControler.getNotesByTag)

// POST /Note/note
router.post(
    '/note/:categId', isAuth,  
    [
        body('title').trim().isLength({min: 5 , max: 15}),
        body('content').trim().isLength({min : 5}),
        body('tags').not().isEmpty()
    ], 
    noteControler.createNote
);

// GET /Note/note/:noteId
router.get('/note/:noteId', isAuth, noteControler.getNote); 

// PUT /Note/note/:noteId
router.put(
    '/note/:noteId', isAuth, 
    [
        body('title').trim().isLength({min: 5 , max: 15}),
        body('content').trim().isLength({min : 5}),
        body('tags').not().isEmpty()
    ],
    noteControler.updateNote
); 

// DELETE /Note/note/:noteId
router.delete('/note/:noteId', isAuth, noteControler.deleteNote); 


module.exports = router;