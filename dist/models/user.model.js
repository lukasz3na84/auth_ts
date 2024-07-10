import { name } from "ejs";
import mongoose from "../utility/db.js";
import bcrypt from "bcrypt";
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: false,
        trim: true,
        minLength: 1,
        maxLength: 32
    },
    surname: {
        type: String,
        required: false,
        trim: true,
        minLength: 1,
        maxLength: 32
    },
    password: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 128
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 128,
        unique: true,
        match: /.+\@.+\..+/ // .+ - dowolone znaki, \@ - znak @, \. - znak . 
    },
    role: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 12,
        default: "user"
    },
    created: {
        type: Date,
        default: Date.now
    }
});
// mongoose hook
userSchema.pre("save", async function (next) {
    try {
        const user = this;
        if (!user.isModified("password")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hasshedPassword = await bcrypt.hash(this.password, salt);
        this.password = hasshedPassword;
        next();
    }
    catch (error) {
        return next(error);
    }
});
userSchema.methods.validPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    }
    catch (error) {
        throw new Error(error);
    }
};
const User = mongoose.model("User", userSchema);
function makeUser(email, password) {
    let role = "user";
    if (email.indexOf("admin") >= 0) {
        role = "admin";
    }
    return new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: password,
        role: role
    });
}
;
export { User, makeUser };
