const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const User = require("./User");
const slugify = require("slugify");

//each of the field ensures the mongoDB documents adhere to this
const tagSchema = new mongoose.Schema(
  {
    tagName: {
        type: String,
        required:true,
        unique:true
    },
    articles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Article'
    }]
  }
);

tagSchema.plugin(uniqueValidator);




module.exports = mongoose.model("Tag", tagSchema);
