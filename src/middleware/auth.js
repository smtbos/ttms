const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { use } = require('d:/_temp/shop/routes/auth.route');
module.exports = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.redirect("/login");
    } else {

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const id = decode.user.id;
            const user = await User.findOne({ _id: id }).select("name");
            if (!user) {
                res.send("Invalid Auth");
            }
            req.details = { name: user.name };
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                msg: 'Token is not Valid'
            });
        }
    }
};