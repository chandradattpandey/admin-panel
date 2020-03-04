const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;
const UserSchema = new Schema({
    name:{type:String},
    age:{type:Number},
	email:{type:String,unique:true},
    password : String,
    role:{type:String,
            enum:['admin','subadmin','user']
        
        },
    is_deleted:{type:Boolean,default:false}        
});

UserSchema.pre('save', function(next) {
    var user = this;

    
    if (!user.isModified('password')) return next();

   
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log(candidatePassword);
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('user',UserSchema);





