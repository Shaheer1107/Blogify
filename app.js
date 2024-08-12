import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import flash from "connect-flash";
import connectDB from "./config/db.js";
import generalRoutes from "./Routes/general.js";
import postRoutes from "./Routes/post.js";
import path from "path";

const app = express();
const port = 3000;
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));

connectDB();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Ensure the views directory is set

app.use('/', generalRoutes);
app.use('/blog', postRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
