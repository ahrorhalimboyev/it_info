const { errorHandler } = require("../helpers/error_handler");
const Author = require("../models/author");
const { authorValidation } = require("../validations/author.validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");

const generateAccessToken = (id, is_expert, authorRoles) => {
  const payload = {
    id,
    is_expert,
    authorRoles,
  };
  return jwt.sign(payload, config.get("secret"), {
    expiresIn: "1h",
  });
};

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const {
      author_first_name,
      author_last_name,
      author_nick_name,
      author_full_name,
      author_password,
      confirm_password,
      author_email,
      author_phone,
      author_info,
      author_position,
      author_photo,
      is_expert,
      birth_date,
      birth_year,
    } = value;

    const author = await Author.findOne({ author_email });
    if (author) {
      return res.status(400).send({ message: "Author exists" });
    } else {
      // const hashedPassword = bcrypt.hashSync(author_password, 7);

      const hashedPassword = await bcrypt.hash(author_password, 7);

      const newAuthor = await Author({
        author_first_name,
        author_last_name,
        author_nick_name,
        author_full_name,
        author_password: hashedPassword,
        author_email,
        author_phone,
        author_info,
        author_position,
        author_photo,
        is_expert,
        birth_date,
        birth_year,
      });
      await newAuthor.save();
    }
    res.status(200).send({ message: "Author added" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { author_email, author_password } = req.body;
    const author = await Author.findOne({ author_email });
    if (!author) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }

    // const validPassword = bcrypt.compareSync(
    //     author_password, // ochiq password req.body dan olingan
    //     author.author_password // bazadagi hashlangan password
    // );

    const validPassword = await bcrypt.compare(
      author_password,
      author.author_password
    );

    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Email or password is incorrect" });
    }

    const token = generateAccessToken(author._id, author.is_expert, [
      "READ",
      "WRITE",
    ]);
    res.status(200).send({ token: token });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    if (authors.length < 1) {
      return res.status(400).send({ message: "Authors not found" });
    }
    res.json(authors);
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    const deleted = await Author.deleteOne({ _id: req.params.id });
    if (!deleted.acknowledged) {
      return res.status(400).send({ message: "Author is not deleted" });
    }
    res.status(200).send({ message: "Author deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};

// const updateAuthor = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid id" });
//         }
//         const author = await Author.findOne({ _id: req.params.id });
//         if (!author) {
//             return res.status(400).send({ message: "Author not found" });
//         }
//         const { author_name, parent_author_id } = req.body;

//         if (parent_author_id) {
//             const updated = await Author.updateOne(
//                 { _id: req.params.id },
//                 { $set: { author_name, parent_author_id } }
//             );
//         } else {
//             const updated = await Author.updateOne(
//                 { _id: req.params.id },
//                 { $set: { author_name } }
//             );
//         }
//         res.status(200).send({ message: "Author updated" });
//     } catch (error) {
//         errorHandler(res, error);
//     }
// };

const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findOne({ _id: req.params.id });
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getAuthorByName = async (req, res) => {
  try {
    const { author_first_name } = req.params;
    const author = await Author.findOne({
      author_first_name: {
        $regex: req.params.author_first_name,
        $options: "i",
      },
    });
    if (!author) {
      return res.status(400).send({ message: "Author not found" });
    }
    res.json(author);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addAuthor,
  getAllAuthors,
  loginAuthor,
  deleteAuthor,
  // updateAuthor,
  getAuthorById,
  getAuthorByName,
};
