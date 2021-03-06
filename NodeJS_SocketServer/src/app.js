var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const conn_sql = require("mssql/msnodesqlv8");
const conn = new conn_sql.ConnectionPool({
  database: 'PoolPortalNotifications',
  server: 'SSM-LP29\\MSSQLSERVER01', 
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
});

io.on('connection', socket => {
    connectMe();
    console.log(`Socket ${socket.id} has connected`);
    function connectMe() {
        conn.connect()
        .then(() =>{
            console.log('Connected in MSSQL successfully');  

            // get user notifications and update local variable
            socket.on('getNotifications', () => {
                socket.emit('server_current_notifications', {}); 
                let res = getNotifications(conn, socket);
                res.then( fulfilled =>{
                    console.log("Promise returned : " +fulfilled);
                })
                .catch(error => console.log("Promise returned : " +error))                         
            });

            // add user notification
            socket.on('addNotifications', () => {
                let res = addNotifications(conn);
                res.then( fulfilled =>{
                    console.log("Promise returned : " +fulfilled);
                })
                .catch(error => console.log("Promise returned : " +error))
            });

            socket.on('deleteNotifications', () => {
                let res = deleteNotifications(conn);
                res.then( fulfilled =>{
                    console.log("Promise returned : " +fulfilled);
                })
                .catch(error => console.log("Promise returned : " +error))
            });
        })
        .catch(error => {
            if(error.code === 'EALREADYCONNECTED'){
                console.log('Closing connection');
                conn.close();
                console.log('Opening connection');
                connectMe();
            }
            else{
                console.log('Closing connection due to error : ' +error.code);
                conn.close();                
            }
        })
    }
});

http.listen(4444, "0.0.0.0", () => {
    console.log('Listening on port 4444');
});

function getNotifications(conn,socket){

    show_query = "select * from Notifications"

    console.log('Performing query : ' +show_query);
    
    let promise = new Promise(
    function (resolve, reject) {
        conn.query(show_query, function (err,result) {
            if (err) reject(err)
            else{
                let records = Object.values(result.recordsets[0]);
                let notifications_array = [];
                for( index = 0 ; index < records.length ; index++){
                    notifications_array.push(records[index]);
                }
                // create object with all entries found
                socket.emit('server_current_notifications', {notifications_array});
                resolve('Rows fetched with success')
            }
        });          
    });
    return promise;
}


function deleteNotifications(conn){
    delete_query = "delete from Notifications"
    console.log('---------------')
    console.log('Performing query : '+delete_query);
    console.log('---------------')
    
    let promise = new Promise(
    function (resolve, reject) {
        conn.query(delete_query, function (err,result) {
            if (err) {
                reject(err)
            } 
            else {
                resolve('Rows affected : ' +result.rowsAffected)
            }
        });
    });
    return promise;
}

function addNotifications(conn) {
    
    add_query = 
    "INSERT INTO Notifications (NotificationText, UserId, Domain, IsEnabled)"
    +" VALUES ('New Notification', 'greg.mavridakhs@gmail.com', 'TnT', 0)"

    console.log('---------------')
    console.log('Performing query : '+add_query);
    console.log('---------------')

    let promise = new Promise(
        function (resolve, reject) {
            conn.query(add_query, function (err,result) {
                if (err) {
                    reject(err)
                } 
                else {
                    resolve('Rows affected : ' +result.rowsAffected)
                }
            });
    });
    return promise;
} 