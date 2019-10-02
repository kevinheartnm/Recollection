const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);


// embedded day practive
const topFiveSchema = new Schema({
  maxTime: {type:Number, default: 0},
  referenceID: String ,
  title: {type:String, default: ""},
  timestamp: {type: Date, default: Date.now()}
});

const userSchema = new Schema({
  code: String,
  name: {
    type: String,
    unique: true
  },
  password: String,
  mastercards: [
   {
     type: mongoose.Schema.Types.ObjectId,
     ref: "mastercards"
   }
 ],
 topfiveMaster:[topFiveSchema]
});
// count the master card the user has
userSchema.virtual('countCards').get( function(){
  return this.mastercards.length;
});

userSchema.pre('remove', async function(next){
  // $in - querys
  // remove all sub cards related to user
    // const SubCards = mongoose.model('subcards');

    // should populate all the mastercards then remove all subcard from individual master cards
    // then remove the master cards, repeat until finish
  // await mongoose.model('subcards').remove({ _id : { $in : this } });

  // remove all the masterCards associated with this user
  // const MasterCards = mongoose.model('mastercards');
  await mongoose.model('mastercards').remove({ _id: { $in : this.mastercards } });
  next();
});

module.exports = mongoose.model('users', userSchema);
