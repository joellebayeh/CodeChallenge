const {validationResult} = require('express-validator');
const Note = require('../Models/Note');
const Category = require('../Models/Category');
const User = require('../Models/User');



//get all notes
exports.getNotes = (req, res, next) => {
    Note.find()
      .select('title content tags category -_id')
      .populate('creator','name -_id')
      .populate('category','title -_id')
      .sort({updatedAt : -1})
      .then(notes => {
            res.status(200).json({
                message:'Fetched notes successfully.',
                notes: notes
            })
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      })
};


//get notes by tag
exports.getNotesByTag = (req, res, next) => {
  const tag = req.params.tag;
  Note.find({tags : tag})
    .select('title content tags category -_id')
    .populate('creator','name -_id')
    .populate('category','title -_id')
    .sort({updatedAt : -1})
    .then(notes => {
      res.status(200).json({
        message: 'Fetched notes by this tag successfully.',
        notes: notes
      })
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
    })
}


//create note in db
exports.createNote = (req, res, next) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('! Validation failed, entered data is incorrect !');
    error.statusCode = 422;
    throw error;
  }
  const categId = req.params.categId;
  const title = req.body.title;
  const content = req.body.content;
  const tags = req.body.tags;
  const note = new Note({
      title: title,
      content: content,
      creator: req.userId,
      category: categId,
      tags: tags
  });
  Category.findById(categId)
  .then(categ => {
      if(!categ){
          const error = new Error('! Could not find category !');
          error.statusCode = 404;
          throw error;
      }
      categ.notes.push(note);
      categ.save();
      return note.save()
  })
  .then(result => {
      res.status(201).json({
          message:'note created successfuly',
          note:result 
      })
  })
  .catch(err => {
      if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      
  })
}


// get note by Id
exports.getNote = (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId)
      .select('title content tags category -_id')
      .populate('creator','name -_id')
      .populate('category','title -_id')
      .then(note => {
        if(!note){
            const error = new Error('! Could not find note !');
            error.statusCode = 404;
            throw error;
        };
        res.status(200).json({ message:'Note fetched.', note: note })
      }) 
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
      })
};


// edit note
exports.updateNote = (req, res, next) => {
    const noteId = req.params.noteId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('! Validation failed, entered data is incorrect !');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    Note.findById(noteId)
      .then(note => {
        if(!note){
            const error = new Error('! Could not find note !');
            error.statusCode = 404;
            throw error;
        }
        //check logged in user
        if(note.creator.toString() !== req.userId){
          const error = new Error('! Not authorized !');
          error.statusCode = 403;
          throw error;
        }
        note.title = title;
        note.content = content;
        note.tags = tags;
        return note.save();
      })
      .then(result => {
        res.status(200).json({message: 'Note updated.', note: result});
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
      })
};


// delete note
exports.deleteNote = (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId)
      .then(note =>{
        if(!note) {
          const error=new Error('! could not find note !');
          error.statusCode=404;
          throw error;
        }
        //check logged in user
        if(note.creator.toString() !== req.userId){
          const error = new Error('! Not authorized !');
          error.statusCode = 403;
          throw error;
        }
        return Category.findById(note.category);
      })
      .then(categ => {
        if(!categ) {
          const error = new Error('! could not find category !');
          error.statusCode = 404;
          throw error;
        }
        categ.notes.pull(noteId) ;
        categ.save();
        return Note.findByIdAndRemove(noteId);
      })
      .then(result=>{
        res.status(200).json({message:'Delete note successfully.'})
      })
      .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};