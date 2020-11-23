const express=require('express');
const app = express();
const mysql=require('mysql');
const bodyparser=require('body-parser');
const port=process.env.PORT||3456;
const cors=require('cors');
const bcrypt=require('bcrypt');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.listen(port,()=>{
    console.log('Listening on port '+port);
});

const con=mysql.createPool({
    host: 'localhost',
    user: 'wustl_inst',
    password: 'wustl_pass',
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
