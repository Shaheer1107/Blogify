import express from "express";
import Blog from "../Schemas/Blog.js";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    req.flash("error_msg", "Please log in to view this resource");
    res.redirect("/");
};

router.get('/', ensureAuthenticated, async(req, res) => {
    try {
        const blogs = await Blog.find({ user: req.session.userId });
        res.render("content/home.ejs", {blogs, userId: req.session.userId }); 
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/create', ensureAuthenticated, (req, res) => {
    res.render('content/create.ejs', { userId: req.session.userId });
});

router.post('/create', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        req.flash("error_msg", "Title and content are required");
        return res.redirect('/blog');
    }
    try {
        const newBlog = await new Blog({ title, content, user: req.session.userId });
        await newBlog.save();
        res.redirect('/blog');
    }
    catch (err) {
        res.status(500).send("Server error");
    }
});


router.get('/edit/:id', ensureAuthenticated, async(req, res) => {
    const editBlog = await Blog.findById(req.params.id);
    const editTitle = editBlog.title;
    const editContent = editBlog.content;
    res.render('content/edit.ejs', {userId: req.params.id, editTitle, editContent});
});

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    const {title, content } = req.body; 
    if (!title || !content) {
        req.flash("error_msg", "Title and content are required");
        return res.redirect('/');
    }

    try {
        await Blog.findByIdAndUpdate(req.params.id, { title, content, user: req.session.userId });
        res.redirect("/blog");
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blog');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

export default router;
