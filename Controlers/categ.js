const Category = require('../Models/Category');
const Note = require('../Models/Note');
const { validationResult } = require('express-validator');
const User = require('../Models/User');


// get all categories
exports.getCategs = (req, res, next) => {
    Category.find()
      .select('notes creator title -_id')
      .populate('creator','name -_id')
      .populate('notes','title content tags -_id')
      .then(categories => {
            res.status(200).json({
                message:'Fetched categories successfully.',
                categories: categories
            })
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      })
}


// create category in db
exports.createCateg = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const error = new Error('! Validation failed, entered data is incorrect !');
      error.statusCode = 422;
      throw error;
  }
  const title = req.body.title;
  const categ = new Category({
      title: title,
      creator: req.userId
  });
  categ
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then( user => {
      user.categories.push(categ);
      return user.save();
    })
    .then( result => {  
      res.status(201).json({
          message: 'Category created successfully.',
          category: categ,
          creator: {_id: result._id, name: result.name}
      })
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
}


// get category by Id
exports.getCateg = (req, res, next) => {
  const categId = req.params.categId;
  Category.findById(categId, {notes: 1, title:1 ,_id: 0})
    .populate('notes','title content tags -_id')
    .then(categ => {
      if(!categ){
          const error = new Error('! Could not find category !');
          error.statusCode = 404;
          throw error;
      };
      res.status(200).json({ message:'Category fetched.', category: categ });
    }) 
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
};


// edit category
exports.updateCateg = (req, res, next) => {
  const categId = req.params.categId;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const error = new Error('!Validation failed, entered data is incorrect !');
      error.statusCode = 422;
      throw error;
  }
  const title = req.body.title;

  Category.findById(categId)
    .then(categ => {
      if(!categ){
          const error = new Error('! Could not find category !');
          error.statusCode = 404;
          throw error;
      }
      //checked logged in user
      if(categ.creator.toString() !== req.userId){
        const error = new Error('! Not authorized !');
        error.statusCode = 403;
        throw error;
      }
      categ.title = title;
      return categ.save();
    })
    .then(result => {
      res.status(200).json({message: 'Category updated.', category: result});
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
}


// delete category
exports.deleteCateg = (req, res, next) => {
  const categId = req.params.categId;
  Category.findById(categId)
    .then(categ => {
      if(!categ){
          const error = new Error('! Could not find category !');
          error.statusCode = 404;
          throw error;
      }
      //check logged in user
      if(categ.creator.toString() !== req.userId){
        const error = new Error('! Not authorized !');
        error.statusCode = 403;
        throw error;
      }
      return Note.deleteMany({category : categId});
    })
    .then(result => {
      return Category.findByIdAndRemove(categId);
    })
    .then(result => {
      return User.findById(req.userId)
    })
    .then(user => {  
      user.categories.pull(categId);
      return user.save();
    })
    .then(user => {
      res.status(200).json({message: 'Deleted calegory.'});
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
}