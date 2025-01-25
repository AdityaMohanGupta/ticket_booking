const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const path = require('path'); //module of nodejs no need to intall
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid');
const passport =require('passport');
const { Strategy } =require('passport-google-oauth20');
const cookieSession=require('cookie-session');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userRoutes = require('./router/userRoutes');
const seatRoutes = require('./router/seats');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


mongoose.connect(process.env.Mongoo)
.then(()=>{
    console.log("DB connected successfully")
})
.catch((err)=>{
    console.log("DB error"); 
    console.log(err)
})

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const config={
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    COOKIE_KEY_1:process.env.COOKIE_KEY_1,
    COOKIE_KEY_2:process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS ={
    callbackURL: '/auth/google/callback',
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done){
    // console.log('Google profile', profile);
    done(null,profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback))

//save the session to the cookie
passport.serializeUser((user,done)=>{
    done(null,user.id);
});


//read the session to the cookie
passport.deserializeUser((id,done)=>{
    done(null,id);
});





app.use(cookieSession({
    name: 'session',
    maxAge: 24*60*60*1000,
    keys: [config.COOKIE_KEY_1,config.COOKIE_KEY_2],
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname , 'public')))
app.use(express.urlencoded({extended:true})); //for form encocoded data
app.use(methodOverride('_method')) //method-overding for post to patch
app.use(express.static(path.join(__dirname, "..", "client")));// Middleware to serve static files
app.use(express.json());

app.use(userRoutes);
app.use(seatRoutes);


function checkLoggedIn(req,res,next){
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader ? authHeader.split(' ')[1] : null);
    // Check Google OAuth session
    if (req.isAuthenticated() && req.user) {
        // console.log('Authenticated via Google:', req.user);
        return next();
    }
    // Check JWT
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { provider: 'jwt', ...decoded };
            // console.log('Authenticated via JWT:', decoded);
            return next();
        } catch (error) {
            // console.error('JWT verification failed:', error);
            return res.redirect('/login');
        }
    }
    // console.log('User is not authenticated.');
    return res.redirect('/login');
    next();
}


// Route to create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sample Product',
                        },
                        unit_amount: 2000, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}`,
            cancel_url: `${baseUrl}`,
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/auth/google',
    passport.authenticate('google' ,{
        scope: ['email'],
    }));

app.get('/auth/google/callback',
    passport.authenticate('google' ,{
        failureRedirect: '/failure',
        successRedirect: '/',
        session: true,
    }),
    (req,res)=>{
        // console.log('google called us back')
    }
);

app.get('/auth/logout',(req,res)=>{
    req.logout(); //Remove req.user and clears any logged in session
    res.clearCookie('token');
    return res.redirect('/');
});

app.get('/failure',(req,res)=>{
    return res.send('Failed to log in !');
})


// idhar pe data daal denge ki looged in hai ki nhi
app.get('/api/isLoggedIn', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ isLoggedIn: true, provider: 'google' });
    }
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.json({ isLoggedIn: true, provider: 'jwt' });
        } catch {
            return res.json({ isLoggedIn: false });
        }
    }
    return res.json({ isLoggedIn: false });
});


//  root 
app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname,"..","client","index.html"))
})


app.get('/about',(req,res)=>{
    res.render('about');
})

app.get('/contact',(req,res)=>{
    res.render('contact');
})

app.get('/termsuse',(req,res)=>{
    res.render('termsuse');
})

app.get('/privacy',(req,res)=>{
    res.render('privacy');
})


app.get('/ai',(req,res)=>{
    res.render('ai', { result: "Your response will appear here." });
})


app.post('/ai', async (req, res) => {
    const prompt = req.body.write;
    // console.log(prompt);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.render('ai', { result: { text: text } });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.render('ai', { result: { text: "Error generating response. Please try again." } });
    }
});


app.get('/signup',(req,res)=>{
    res.render('signup', { error: null, email: null });
    // res.redirect('/');
})

app.get('/login',(req,res)=>{
    res.render('login', { error: null, email: null });
    // res.redirect('/');
})

app.get('/movies',checkLoggedIn,(req,res)=>{
    res.render('movies');
})

app.get('/concerts',checkLoggedIn,(req,res)=>{
    res.render('concerts');
})

app.get('/sports',checkLoggedIn,(req,res)=>{
    res.render('sports');
})

app.get('/movies/seat',checkLoggedIn,(req,res)=>{
    res.render('seat');
})

app.get('/movies/seat/checkout',checkLoggedIn,(req,res)=>{
    res.render('checkout', { stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
})

const port=process.env.PORT || 8080;
app.listen(port , ()=>{
    console.log("server running at port 8080")
})
