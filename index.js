const express =require('express');
const path = require('path');
const User=require('./models/user');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt")
const app = express();
const port =3001;

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
    res.render('index');
}
);

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req,res)=>{
    const { username, email, password, DOB } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) { 
            const user=await new User({
                username,
                email,
                password:hash,
                DOB
            })
            const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });
            res.cookie('token', token);
            user.save();
            res.redirect('/profile');
        }  )
    })
    
})

app.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Something Went Wrong');
    }

    bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
            const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });
            res.cookie('token', token);
            res.redirect('/profile');
        } else {
            res.status(400).send('Something Went Wrong');
        }
    });
}
);

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


app.get('/profile', async (req,res)=>{
    const users = await User.find();
    res.render('profile', {users});
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}
);

