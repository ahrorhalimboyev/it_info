const bcrypt = require("bcrypt");
const { errorHandler } = require("../helpers/error_handler");
const { userValidation } = require("../validations/user.validations");
const User = require("../models/user");

exports.addUser = async (req, res) => {
    try {
        const { error, value } = userValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const {
            user_name,
            user_email,
            user_password,
            user_info,
            user_photo,
            user_is_active,
        } = value;
        const user = await User.findOne({ user_email });
        if (user) {
            return res.status(400).send({ message: "User exists" });
        }

        const hashedPassword = await bcrypt.hash(user_password, 8);
        const newUser = await User({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_info,
            user_photo,
            user_is_active,
        });
        await newUser.save();
        res.status(200).send({ message: "User added" });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length < 1) {
            return res.status(400).send({ message: "Users not found" });
        }
        res.json(users);
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { error, value } = userValidation(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const {
            user_name,
            user_email,
            user_password,
            user_info,
            user_photo,
            user_is_active,
        } = value;
        const hashedPassword = await bcrypt.hash(user_password, 8);
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    user_name,
                    user_email,
                    user_password: hashedPassword,
                    user_info,
                    user_photo,
                    user_is_active,
                },
            }
        );
        if (updatedUser.acknowledged) {
            res.status(200).send({ message: "User updated" });
        } else {
            res.status(400).send({ message: "User is not updated" });
        }
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        const user = await User.findOne({ user_email });
        if (!user) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }
        const validPassword = await bcrypt.compare(
            user_password,
            user.user_password
        );
        if (!validPassword) {
            return res
                .status(400)
                .send({ message: "Email or password is incorrect" });
        }
        res.status(200).send({ message: "Welcome to system" });
    } catch (error) {
        errorHandler(res, error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const deletedUser = await User.deleteOne({ _id: req.params.id });
        if (deletedUser.acknowledged) {
            res.status(200).send({ message: "User deleted" });
        } else {
            res.status(200).send({ message: "User is not deleted" });
        }
    } catch (error) {
        errorHandler(res, error);
    }
};
