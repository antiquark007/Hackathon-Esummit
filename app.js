

const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const UserData = require('./model/user');
const Pickupdata = require('./model/pickup')
const Industrydata = require('./model/industry')
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/TRASH')
    .then(() => console.log("Connected to database"))
    .catch(err => console.log("Error in connecting to database: ", err));




app.use(session({ secret: 'hello' }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
function reqlogi(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/home')
    }
    else {
        next();
    }
}

app.set('view engine', 'ejs');


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const existingUser = await UserData.findOne({ username });

        if (existingUser) {
            req.flash('error', 'Username is already taken. Please choose another one.');
            return res.redirect('/home/register');
        }


        const existingEmail = await UserData.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Email is already in use.');
            return res.redirect('/home/register');
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new UserData({
            username,
            email,
            password: hashedPassword
        });


        await newUser.save();


        req.session.user_id = newUser._id;


        res.redirect('/home/user');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/home', (req, res) => {
    res.render('homepage.ejs')
})

app.get('/home/register', (req, res) => {
    res.render('register', { messages: req.flash('error') });
});
app.get('/home/user', reqlogi, (req, res) => {
    res.render('user.ejs')
})

app.get('/home/login', (req, res) => {
    res.render('login.ejs', { messages: req.flash('error') });

})
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserData.findOne({ username: username })
    if (!user) {
        req.flash('error', "check user name and password")
        res.redirect("/home/login")
    }
    else {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            req.session.user_id = user._id;
            res.render('user.ejs')
        }
        else {
            req.flash('error', "check user name and password")
            res.redirect("/home/login")
        }
    }

})
app.get('/home/user/pickup', (req, res) => {
    res.render('pickup.ejs', { messages: req.flash('success') });
})
app.post('/Pickupdata', async (req, res) => {
    const { name, contactNumber, wasteType, wasteWeight, pickupDate, pickupTime, pickupAddress, additionalNotes } = req.body;
    console.log("Data recieved")
    const newPickupdata = new Pickupdata({
        name: name,
        contactNumber: contactNumber,
        wasteType: wasteType,
        wasteWeight: wasteWeight,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        pickupAddress: pickupAddress,
        additionalNotes: additionalNotes
    })
    await newPickupdata.save();
    req.flash('success', "Pickup Succesfully Scheduled")
    res.redirect('/home/user/pickup');


})
app.get('/home/industry', (req, res) => {
    res.render('industry.ejs', { messages: req.flash('success') });
})
app.post('/industry', async (req, res) => {
    const { name, contactNumber, wasteType, wasteWeight, deadendDate, additionalNotes } = req.body;
    console.log("Data recieved")
    const newIndustrydata = new Industrydata({
        name: name,
        contactNumber: contactNumber,
        wasteType: wasteType,
        wasteWeight: wasteWeight,
        deadendDate: deadendDate,
        additionalNotes: additionalNotes
    })
    await newIndustrydata.save();
    req.flash('success', "Industry Succesfully Scheduled")
    res.redirect('/home/industry');

})

app.get('/home/employee', (req, res) => {
    res.render('employee.ejs')
})

app.get('/home/employee/industry', async (req, res) => {
    const industryData = await Industrydata.find();
    res.render('employeeindus.ejs', { industryData })
})

app.get('/home/employee/pickup', async (req, res) => {
    const pickupData = await Pickupdata.find();
    res.render('employeepick.ejs', { pickupData })
})
app.get('/home/user/product',(req,res)=>{
    res.render('product.ejs')
})


app.listen(4000, () => {
    console.log("Server running on port 4000");
});
