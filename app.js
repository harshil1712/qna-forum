const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"harshil",
    database:"test"
});

db.connect((err)=>{
    if(err){
        console.log(err);
    } else{
        console.log("DB connected");
    }
});

app.get('/', (req,res)=>{
    res.send({
        message:'Getting'
    })
})

app.post('/api/login/mod',(req,res)=>{
    const user={
        id:1,
        username: 'mod',
        email:'mod@user.com'
    }
    jwt.sign({user}, 'secretkey',{ expiresIn: '24h'}, (err, token)=>{
        if(err){
            console.log(err)
        }
        res.json({ token })
    })
});

app.post('/api/login',(req,res)=>{
    const user={
        id:1,
        username: 'user',
        email:'user@user.com'
    }
    jwt.sign({user}, 'secretkey',{ expiresIn: '24h'}, (err, token)=>{
        if(err){
            console.log(err)
        }
        res.json({ token })
    })
});

app.get('/api', (req,res)=>{
    let sql = `SELECT * FROM ques`;
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.post('/api/addques', verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretkey', (err)=>{
        if(err){
            res.sendStatus(403);
        } else{
            let ques1 = {
                ques_body:"First question",
                user_id:1
            }
            let sql = `INSERT INTO ques SET ?`;
            let query = db.query(sql, ques1, (err,result)=>{
                if(err) throw err;
                res.send(result);
            })
        }
    })
})

app.post('/api/addans/:quesID', verifyToken, (req,res)=>{

    jwt.verify(req.token, 'secretkey',(err)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            let sql = `INSERT INTO ans WHERE ques_id = '${ques_id}'`;
            let query = db.query(sql, (err,result)=>{
                if(err) throw err;
                res.send(result);
            })
        }
    })
    
})

app.get('/api/mod/ques/:id', verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretkey', (err, atuhData)=>{
        if(err){
            res.sendStatus(403)
        } else {
            res.json({
                message: 'get'
            })
        }
    })
})

app.delete('/api/mod/ques/:id', verifyToken, (req,res)=>{
    jwt.verify(req.token, 'secretkey', (err, atuhData)=>{
        if(err){
            res.sendStatus(403)
        } else {
            let sql = `DELETE FROM ques WHERE ques_id = '${id}'`;
            let query = db.query(sql, (err, result)=>{
                if(err) throw err;
                res.send(result);
            })
        }
    })
})

function verifyToken(req,res, next) {
    const bearerHeader = req.header['authorization'];
    if( typeof bearerHeader != 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403)
    }
}

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
})
