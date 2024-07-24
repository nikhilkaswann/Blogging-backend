const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const User = require("./User");
const slugify = require("slugify");

//each of the field ensures the mongoDB documents adhere to this
const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tagList: [
      {
        type: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    favoritesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

articleSchema.plugin(uniqueValidator);


//middleware to run before saving the article

articleSchema.pre('save', function(next){

    this.slug = slugify(this.title, {lower:true, replacement:'-'});

    next();
} )

//user is the logged in user
articleSchema.methods.toArticleResponse = async function (user) {
  const authorObj = await User.findById(this.author).exec();

  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favourited: false,
    favouritesCount: this.favouritesCount,
    author: authorObj.toProfileJSON(user),
  };
};

articleSchema.methods.addComment = async function (commentId) {

  if(this.comments.indexOf(commentId) === -1){
    this.comments.push(commentId);
  }
  return this.save();
};


articleSchema.methods.removeComment = async function (commentId) {
  if(this.comments.indexOf(commentId) !== -1){
    this.comments.remove(commentId);
  }
  return this.save();
};

module.exports = mongoose.model("Article", articleSchema);
