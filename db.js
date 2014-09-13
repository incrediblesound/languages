var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  languages: Array
});

var LanguageSchema = new Schema({
	name: {type: String, unique: true},
  createdBy: String,
  wordCount: {type: Number, default: 0}
});

var WordSchema = new Schema({
  word: String,
  definition: String,
  classes: Array,
  transforms: Array,
  lang: String,
  examples: [Schema.Types.ObjectId]
});

var ClassSchema = new Schema({
  name: String,
  explanation: String,
  lang: String
});

// var TransformSchema = new Schema({
//   forms: Array,
//   lang: String
// });

var StructureSchema = new Schema({
  name: {type: String, unique: true},
  parts: Array,
  explanation: String,
  lang: String
});

var NoteSchema = new Schema({
  lang: String,
  content: String,
  meaning: String,
  writtenBy: String
})

var User = mongoose.model('user', UserSchema);
var Language = mongoose.model('language', LanguageSchema);
var Word = mongoose.model('word', WordSchema);
//var Transform = mongoose.model('transform', TransformSchema);
var Structure = mongoose.model('structure', StructureSchema);
var Class = mongoose.model('class', ClassSchema);
var Note = mongoose.model('note', NoteSchema);

mongoose.connect('mongodb://JamesBase:44XD43DzE43tzolhx3y7Wimbtns0jw2UjZt8BPuylg8-@ds050077.mongolab.com:50077/JamesBase');