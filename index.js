const mysql = require('./connection.js');
const multer = require('multer');
const express = require('express');
const path = require('path');

const port = 3005
const app = express();

app.use(express.json());  
// app.use(express.static('public'));    
// app.set("view engine", "html");   
app.use('/pfp', express.static('pfp'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pfp/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/student-dashboard',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'student_dashboard.html'));
})

app.post('/login', (req, res) => {
    // Basic mock login that redirects to the dashboard
    res.redirect('/student-dashboard');
});

app.get('/employees', async(req,res)=>{
    const query = 'Select * from users;'
    try{
        const [rows] = await mysql.query(query);
        res.json(rows);
    }catch(err){
        res.status(500).send(err);
    }
});

app.post('/submit', upload.single('profile_pic'), async(req,res)=>{
    // console.log(req.body);
    const {user_id, f_name, l_name, email, password, role, sem, section, mentor,ph_num} = req.body;
    const fileUrl = req.file ? `/pfp/${req.file.filename}` : null;

    const query = `insert into users(user_id, f_name, l_name, email, password, role, profile_pic, sem, section, mentor_id,ph_num)values(?,?,?,?,?,?,?,?,?,?,?);`
    try{
        await mysql.query(query,[user_id, f_name, l_name, email, password, role,fileUrl,sem,section,mentor,ph_num]);
        res.json("Data Submitted Succefully.");
    }catch(err){
        res.status(500).send(err);
    }
});

app.get('/getMentors',async(req,res)=>{
    const q = 'Select user_id,profile_pic, f_name, l_name from users where role=\'mentor\'';
    try{
        const [rows] = await mysql.query(q);
        res.send(rows);
    }catch(err){
        res.status(500).send(err);
    }
})

app.listen(port,()=>{
    console.log("App is running on",port);
})