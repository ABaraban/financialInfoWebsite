const express=require('express');
const app = express();
const mysql=require('mysql');
const bodyparser=require('body-parser');
const port=process.env.PORT||3456;
const cors=require('cors');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.listen(port,()=>{
    console.log('Listening on port '+port);
});

const con=mysql.createPool({
    host: 'ec2-52-14-184-36.us-east-2.compute.amazonaws.com',
    user: 'user',
    password: 'password',
    database: 'portfolio'
});
app.get('/', (req,res)=>{
    res.send('hello world');
});

app.post('/login', (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const sqlinsert="SELECT * from users where username = ?"
        con.query(sqlinsert,[username],(err, result)=>{
            console.log(result);
            if(result.length==0){
                res.send("wronguser");
            }
            else{
                bcrypt.compare(password,result[0].password, function(error,re){
                    console.log(error);
                    console.log("re"+re);
                    if(re){
                        res.send("success");
                    }
                    else{
                        res.send("wrongpass");
                    }
                })
            }
        });
});
app.post('/createUser', (req,res)=>{
    console.log(con);
    const username=req.body.username;
    const password=req.body.password;
    bcrypt.hash(password,10,function(err,hash){
        if(err) console.log(err);
        const sqlinsert="INSERT INTO users (username, password) VALUES (?,?)"
        con.query(sqlinsert,[username, hash],(err, result)=>{
            if(result==undefined){
                res.send('failure');
            }
            else{
                res.send('success');
            }
            console.log(result);
        });
    });
    
});
app.post('/email', (req,res)=>{
    let emailreg = new RegExp(/^[\w!#$%&'*+\/=?^_`{|}π~.-]+@([\w\-]+(?:\.[\w\-]+)+)$/);
        let outcome=0;
        if(!emailreg.test(req.body.email)){
            res.send("invalid email");
        }
        //WE USED THE CODE FROM https://www.w3schools.com/nodejs/nodejs_email.asp AS A TEMPLATE FOR THE CODE BELOW
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'wustl330portfolio@gmail.com',
              pass: 'Portfolio'
            }
        });
        var mailOptions = {
            from: 'wustl330portfolio@gmail.com',
            to: req.body.email,
            subject: 'Invite to portfolio app',
            text: "You are invited to the wustl portfolio app. Click this link to join: "+req.body.url
          };
          try{
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error)
                }
                else{
                  console.log('Email sent: ' + info.response);
                  res.send("success");
                } 
              });
          }
          catch(err){
              res.send("Email failed to send");
          }
       
});
app.post('/addfav', (req,res)=>{
    const ticker=req.body.ticker;
    const username=req.body.user;
    const sqlinsert="INSERT INTO favorites (ticker, username) VALUES (?,?)"
        con.query(sqlinsert,[ticker, username],(err, result)=>{
            if(result==undefined){
                res.send('failure');
            }
            else{
                res.send('success');
            }
            console.log(result);
        });
});
app.post('/loadfavorites',(req,res)=>{
    console.log(req.body.user);
    const sqlselect="SELECT * from favorites WHERE username=?"
        con.query(sqlselect,req.body.user,(err, result)=>{
            res.send(result);
            console.log(result);
        });
});
app.post('/changepass',(req,res)=>{
    const sqlinsert="UPDATE users SET password=? WHERE username=?"
    console.log(req.body.newpass);
    console.log(req.body.user);
        bcrypt.hash(req.body.newpass,10,function(err,hash){
            if(err) console.log(err);
            con.query(sqlinsert,[hash, req.body.user],(err, result)=>{
                if(result==undefined){
                    res.send('failure');
                }
                else{
                    res.send('success');
                }
                console.log(result);
            });
        });
})