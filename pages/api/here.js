import { Pool } from 'pg';
import { isJsxAttribute } from 'typescript';

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});
export default async function handel(req,res){
    const{action}=req.query;
    if(req.method==='GET'){   
        if(action==='getallusers'){
            try{ 
            const query=`select
            * from "user_register"`;
            const result = await pool.query(query)
            res.status(200).json({data:result.rows})
            }catch(error){
            console.error("Error fetching users:", error);
            res.status(500).json({message:"table dosent found"})
        }
        }
        else if(action==='getuser'){
        const {userid}=req.query;
        const query=`select * from "user_registration" where userid=$1`;
        const values=[userid];
        const result = await pool.query(query,values);
        res.status(200).json({data:result.rows})
        }
    }
    if(req.method==='POST'){
        if(action==='post'){
        const {post,postedby}=req.body;
        const query=`insert into "post" (post,postedby) values($1,$2)`;
        const values=[post,postedby]
        await pool.query(query,values)
        res.status(200).json({message:"post created"});
        }

        if(action==='register'){
        const {name,email}=req.body;
        const query=`insert into "user_registration" (name,email) values($1,$2)`;
        const values=[name,email]
        await pool.query(query,values)
        res.status(200).json({message:"USER REGISTERED"});
        }
        
    }
    if(req.method==='DELETE'){
        if(action==='delete_user'){
        const {userid}=req.query;
        const deleteuser=`delete from "user_registration" where userid=$1`;
        const values=[userid]
        await pool.query(deleteuser,values);
        res.status(200).json({message:"deleted user"});
        }

        if(action==='delete_post'){
        const {postid}=req.query;
        const query=`delete from "post" where postid=$1`;
        const values=[postid]
        await pool.query(query,values);
        res.status(200).json({message:"Post deleted"});
        }
        
    }
    if(req.method==='PUT'){
        if(action==='update_user'){
        const {userid,name,email} = req.body;
        const query =`update "user_registration" set name=$2,email=$3 where userid=$1`;
        const values=[userid,name,email];
        await pool.query(query,values);
        res.status(200).json({message:"user updated"});
        }
        if(action==='update_post'){
        const {postid,post} = req.body;
        const query =`update "post" set post=$2 where postid=$1`;
        const values=[postid,post];
        await pool.query(query,values);
        res.status(200).json({message:"Post updated"});
        }
    }
}

try{
    const {postid,post} = req.body;
        const query =`update "post" set post=$2 where postid=$1`;
        const values=[postid,post];
        await pool.query(query,values);
        res.status(200).json({message:"Post updated"});
}catch(error){
    console.log(error);
    res.status(500).json({message:"this is error message"})
}