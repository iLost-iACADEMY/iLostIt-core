const ql= require('ql');
const conn=ql.createConnection
({

    host:'localhost',
    user:'root',
    password:'root',
    database:'ilost'
});
conn.connect();

function deleteaccounts(delts)
{
    conn.query
    (
        'DELETE FROM accounts WHERE delts=?',[delts],
        function(err,results,fiels)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            console.log('Added Successfully!');
        }
    );
}

function deletefounded(ded)
{
    conn.query
    (
        'DELETE FROM founded WHERE ded=?',[ded],
        function(err,results,fiels)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            console.log('Added Successfully!');
        }
    );
}

function deleteitems(te)
{
    conn.query
    (
        'DELETE FROM items WHERE te=?',[te],
        function(err,results,fiels)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            console.log('Added Successfully!');
        }
    );
}

function deletemessages(ss)
{
    conn.query
    (
        'DELETE FROM messages WHERE ss=?',[ss],
        function(err,results,fiels)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            console.log('Added Successfully!');
        }
    );
}

function deletereport(rt)
{
    conn.query
    (
        'DELETE FROM report WHERE rt=?',[rt],
        function(err,results,fiels)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            console.log('Added Successfully!');
        }
    );
}
module.exports=
{
    deleteaccounts:deleteaccounts,
    deletefounded:deletefounded,
    deleteitems:deleteitems,
    deletemessages:deletemessages,
    deletereport:deletereport
};