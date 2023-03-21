const ql= require('ql');
const conn=ql.createConnection
({

    host:'localhost',
    user:'root',
    password:'root',
    database:'ilost'
});
conn.connect();


function addaccounts(unts)
{
    const{id,username,password,permission}=unts;
    const ins='INSTERT INTO accounts (id,username,password,permission) VALUES('${id}','${username}','${password}','${permission}')';
    conn.query
    (query,(err,result)=>
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log('Added Successfully!');
        }

    });
}
module.exports={addaccounts};

function addfounded(ms)
{
    const{id,item,founded,owner}=ms;
    const ins='INSTERT INTO founded (id,item,founded,owner) VALUES('${id}','${item}','${founded}','${owner}')';
    conn.query
    (query,(err,result)=>
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log('Added Successfully!');
        }

    });
}
module.exports={addfounded};

function additems(em)
{
    const{id,item_name,lost_since,image,foundlost_by}=em;
    const ins='INSTERT INTO items (id,item_name,lost_since,image,foundlost_by) VALUES('${id}','${item_name}','${lost_since}','${image}','${foundlost_by}')';
    conn.query
    (query,(err,result)=>
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log('Added Successfully!');
        }

    });
}
module.exports={additems};

function addmessages(ge)
{
    const{id,mesage,sender,receiver}=ge;
    const ins='INSTERT INTO messages (id,message,sender,receiver) VALUES('${id}','${message}','${sender}','${receiver}')';
    conn.query
    (query,(err,result)=>
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log('Added Successfully!');
        }

    });
}
module.exports={addmessages};

function addreport(on)
{
    const{id,reason,item}=on;
    const ins='INSTERT INTO report (id,reason,item) VALUES('${id}','${reason}','${item}')';
    conn.query
    (query,(err,result)=>
    {
        if(err)
        {
            console.error(err);
        }
        else
        {
            console.log('Added Successfully!');
        }

    });
}
module.exports={addreport};