import express from "express";
import User from "../Schemas/User.js";
import Contact from "../Schemas/Contact.js";
import bcrypt from "bcrypt"

const router = express.Router();

router.get('/', (req, res) => {
    res.render("content/auth.ejs");
});

router.get('/signup', (req, res) => {
    res.render('content/signup.ejs', { userId: req.session.userId});
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        req.flash("success_msg", "You have been registered successfully");
        res.redirect('/login');
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.get('/login', (req, res) => {
    res.render('content/login.ejs', {userId: req.session.userId});
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash("error_msg", "Invalid Credentials");
            return res.redirect("/login");
        }
        req.session.userId = user._id;
        res.redirect("/blog");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


router.get('/about', (req, res) => {
    res.render('content/about.ejs', { userId: req.session.userId});
});


router.get('/contact', (req, res) => {
    res.render('content/contact.ejs', { userId: req.session.userId});
});

router.post('/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    try {
        const contact = new Contact({ name, email, phone, subject, message });
        await contact.save();
        req.flash("success_msg", "Contact saved successfully");
        res.redirect('/login');
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default router;
