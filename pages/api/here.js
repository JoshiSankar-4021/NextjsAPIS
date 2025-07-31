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

    if(req.method==='GET'){
        const query=`select
        * from "user_registration"`;
        const result = await pool.query(query)
        res.status(200).json({data:result.rows})
    }
    if(req.method==='POST'){
        const {name,email}=req.body;
        const query=`insert into "user_registration" (name,email) values($1,$2)`;
        const values=[name,email]
        await pool.query(query,values)
        res.status(200).json({message:"USER REGISTERED"});
    }
    if(req.method==='DELETE'){
        const {userid}=req.query;
        const query=`delete from "user_registration" where userid=$1`;
        const values=[userid]
        await pool.query(query,values);
        res.status(200).json({message:"deleted user"});
    }
    if(req.method==='PUT'){
        const {userid,name,email} = req.body;
        const query =`update "user_registration" set name=$2,email=$3 where userid=$1`;
        const values=[userid,name,email];
        await pool.query(query,values);
        res.status(200).json({message:"user updated"});
    }
}