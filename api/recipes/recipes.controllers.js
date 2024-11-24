const User = require("../../models/User");
const Recipe = require('../../models/Recipe');

exports.createRecipe = async (req, res, next) => {
  try {
    const { name, author, ingredients } = req.body;

    if (!name || !author || !ingredients) {
      return res.status(400).json({ message: 'All fields are required.' }); //400 Bad Request
    }

    const newRecipe = new Recipe({
      name, 
      author, 
      ingredients,
      // createdBy: req.user.id // Uncomment if associating with a user
    });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe created successfully!', recipe: newRecipe }); // 201 successfully created
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); //500 error in server 
    next(err);
  }
};

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes); // 200 everything ok
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });//500 error in server
    next(err);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });// 404 not found 
    }
    res.status(200).json(recipe); // 200 everything ok
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });//500 error in server
    next(err);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    const { name, author, ingredients } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, author, ingredients },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found.' }); ///404 not found 
    }

    res.status(200).json({ message: 'Recipe updated successfully!', recipe: updatedRecipe }); // 200 everything ok
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); //500 error in server
    next(err);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });//404 not found 
    }
    res.status(200).json({ message: 'Recipe deleted successfully!' });// 200 ok 
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); //500 error in server
    next(err);
  }
};
