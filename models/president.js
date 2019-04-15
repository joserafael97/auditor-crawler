const moongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// https://github.com/dnrocha1/webdev-backend/blob/master/server/user/user.model.js

const UserSchema = new moongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    debt: [{ 
        type: moongoose.Schema.Types.ObjectId, ref: 'Transaction' 
    }],
    receiving: [{ 
        type: moongoose.Schema.Types.ObjectId, ref: 'Transaction'
     }]
    /*friends: [{
        type: moongoose.Schema.Types.ObjectId, ref: 'User'
    }],*/
});

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, null, (errr, hash) => {
            user.password = hash;
            next();
        });
    });
});
  
UserSchema.method({
    comparePassword (reqPassword, userPassword) {
        return bcrypt.compareSync(reqPassword, userPassword)
    }
});
  
module.exports = moongoose.model('User', UserSchema);