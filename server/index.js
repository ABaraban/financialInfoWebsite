const express=require('express');
const app = express();
const mysql=require('mysql');
const bodyparser=require('body-parser');
const port=process.env.PORT||3456;
const cors=require('cors');
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

app.post('/', (req,res)=>{
    console.log("helloserver");
    const username=req.body.username;
    const password=req.body.password;
    const sqlinsert="INSERT INTO users (username, password) VALUES (?,?)"
    con.query(sqlinsert,[username, password],(err, result)=>{
        console.log(result);
    });
});
