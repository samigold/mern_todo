const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UsersSchema = new mongoose.Schema({
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
}, {
    timestamps: true
})

//add the bcrypt hash function to the schema as a pre-save hook
UsersSchema.pre('save', async function(next){
    //check if the password is not modified
    if(!this.isModified('password')) {
        next();
    }

    //generate a salt
    //salt is a random string that is used to hash the password
    const salt = await bcrypt.genSalt(10);

    //hash the password
    this.password = await bcrypt.hash(this.password, salt);
});

UsersSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', UsersSchema);

module.exports = User;