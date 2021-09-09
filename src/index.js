const express = require("express");
const path = require("path");
const expressEJSLayouts = require('express-ejs-layouts');
const auth = require("./middleware/auth");
const mongoose = require('mongoose');
const User = require("./models/User");
const Task = require("./models/Task");
const Submission = require("./models/Submission");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


require('dotenv').config({
    path: path.join(__dirname, "../.env")
});

mongoose.connect(process.env.MONGO_URL);
let db = mongoose.connection;
db.once('open', () => {
    console.log(`Connected to ${db.host}`);
});
db.on('error', function (err) {
    console.log(`Connection Failed Error : ${err}`);
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "../node_modules")));
app.use("/public", express.static(path.join(__dirname, "./public")));


app.use(expressEJSLayouts);
app.set('layout', path.join(__dirname, './templates/layouts/layout'));
app.set('views', path.join(__dirname, './templates/views'));
app.set('view engine', 'ejs');


app.get("/", auth, async (req, res) => {
    const default_params = {
        tasks: []
    };
    res.render("index", { ...default_params, ...req.details, page: "dashboard" });
});

app.get("/tasks", auth, async (req, res) => {
    const ptasks = await Task.find({ status: 0 }).populate('user');
    const tasks = await Task.find().populate('user');
    res.render("tasks", { ptasks: ptasks, tasks: tasks, ...req.details, page: "tasks" });
});

app.get("/tasks/:_id", auth, async (req, res) => {
    const task = await Task.findById(req.params._id).populate('user');
    const submissions = await Submission.find({ task: req.params._id }).populate('user');
    res.render("task_view", { task, submissions, ...req.details, page: "tasks" })
});

app.post("/tasks", auth, async (req, res) => {
    const task = new Task({ user: req.user._id, ...req.body });
    try {
        await task.save();
        res.redirect("/tasks?msg=added_success");
    } catch (error) {
        res.status(401).send("Error");
    }
});

app.get("/login", (req, res) => {
    res.render("login", { layout: path.join(__dirname, './templates/layouts/form') });
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
        res.send("Invalid Email id");
    }

    if (user.password != password) {
        res.send("Invalid Password")
    }

    const payload = {
        user: {
            id: user._id
        }
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        (err, token) => {
            if (err) {
                res.send("Sorry We Can't Process Your Request");
            } else {
                res.cookie("jwt", token, { secure: true, httpOnly: true });
                res.redirect('/');
            }
        }
    );
});

const PORT = 5000;
const server = app.listen(PORT, () => {
    console.log(`Server Running at port: ${PORT}`);
})