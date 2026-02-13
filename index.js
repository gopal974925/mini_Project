const express =require('express');
const path = require('path');
const User=require('./models/user');
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

app.post('/register',async (req,res)=>{
    const { username, email, password, DOB } = req.body;

    const user=new User({
        username,
        email,
        password,
        DOB
    })
    await user.save();

    console.log(user);
    res.redirect('/');
})


app.get('/profile', async (req,res)=>{
    const users = await User.find();
    res.render('profile', {users});
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}
);

