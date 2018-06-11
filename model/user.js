var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    saltRounds = 10,
    emailVal = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


var UserSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return emailVal.test(v);
            },
            message: '{PATH} debe ser valido!'
        },
        required: [true, '{PATH} is required'],
    },
    password: {
        type: String,
        /*validate: {
            validator: function (v) {
                return /^[a-zA-Z$.0-9 ]+$/.test(v);
            },
            message: '{PATH} must not have space!'
        },*/
        required: [true, '{PATH} is required'], min: [6, '{PATH} requires minimum 6 digits']
    },
    facebookId: {type: String, default: ''},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

UserSchema.pre('save', function (next) {
    var self = this;
    mongoose.models["User"].findOne({email: self.email}, function (err, user) {
        console.log('schema user',self)
        if (!user) {
            bcrypt.hash(self.password, saltRounds, function (err, hash) {
                if (err) {
                    return next(err);
                } else {
                    self.password = hash;
                    next();
                }
            });
        } else {
            if(self.__v != undefined && user._id.equals(self._id)){
                // only hash the password if it has been modified (or is new)
                if (!self.isModified('password')) {
                    return next();
                }
                bcrypt.hash(self.password, saltRounds, function (err, hash) {
                    if (err) {
                        return next(err);
                    } else {
                        self.password = hash;
                        next();
                    }
                });
            }else {
                next(new Error("Username already exists!"));
            }
        }
    })
})

UserSchema.statics = {}

UserSchema.methods = {
    comparePassword: function (data, cb) {
        var self = this;
        bcrypt.compare(data, self.password, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, result)
            }
        });
    }
};

var User = mongoose.model('User', UserSchema);

module.exports = User;