// Setup basic express server
var express = require('express');
var app = express();
var mysql = require('mysql');
var gcm = require('node-gcm');

//var path = require('path');
//var url = require('url');

var server = require('http').Server(app);
var io = require('socket.io')(server);

//var port = process.env.PORT || 1337;

var port = process.env.PORT || 3000;
var request = require('request');
var baseUrl = 'http://api.apixu.com/v1/';
var apiType = 'history.json?key=d9d7ad5df78e45eba77154309171008'

//var proimageDir = 'http://notosolutions.net/stux/uploads/product/thumb/';
//var imageDir = 'http://notosolutions.net/stux/uploads/user/thumb/';

var fs = require('fs');

app.get('/', function (req, res) {
  //res.end("Socket Connected!");
  res.sendfile('index.html', {
    root: __dirname
  });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  /*user: "root",
  password: "popboxMy$QlU$er",*/
  database: "zadmin_popboxchat",
  charset: 'utf8mb4'
});

con.connect(function (err) {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});



app.get('/joinLocationAPI', function (req, res) {

  var place_id = req.query.place_id;
  var user_id = req.query.user_id;


  // TODO: Un-Comment the below code if the user_id and place_id should be number this is just a check for data validator

  /*
  if (isNaN(place_id) || isNaN(user_id)) {
    console.log('data not good to go');
    res.send(JSON.stringify('DATA IS NOT VALID, PLEASE CHECK PARAMETERS'))
    return;
  }
  */

  console.log("place_id", place_id);
  console.log("user_id", user_id);



  function placeUserCallback(results) {
    var box_id = results[0].id;
    con.query(`SELECT * FROM box_users WHERE box_id=${box_id} AND user_id=${user_id}`, (error, results) => {

      if (error) {
        res.send(JSON.stringify(error));
        var obj = {
          data: 'place_id is not valid'
        }
        return;
      }

      if (results.length) {
        res.send(JSON.stringify(results));
        return;
      }

      con.query(`SELECT * FROM users WHERE id=${user_id}`, (error, results) => {
        if (error) {
          res.send(JSON.stringify(error));
          return;
        }

        if (!results.length) {
          res.send('User with this user_id does not exist');
          return;
        }

        con.query(`INSERT INTO box_users (box_id,user_id) VALUES (${box_id},${user_id})`, (error, results) => {
          if (error) {
            res.send(JSON.stringify(error));
            return;
          }
          con.query(`SELECT * FROM box_users WHERE box_id=${box_id} AND user_id=${user_id}`, (error, results) => {
            if (error) {
              return;
            }
            res.send(JSON.stringify(results));
            return;
          })
        })
      })
    })
  }
  
  con.query(`SELECT * FROM box WHERE id=${place_id}`, (error, results) => {
    if (error) {
      // res.send(JSON.stringify(error));
      res.status(400);
      res.send('place_id is not valid')
      return;
    }
    if (!results.length) {


      res.send('No Data Avalilabe with this place_id');
      return;


      // TODO :- Add in box if waana create a new place with new id : un-comment the below code-block && comment the above code-block ELSE Vice-Versa

      /*
      con.query(`INSERT INTO box (place_id) VALUES (${place_id})`, (error, results) => {
        if (error) {
          console.log('the place_id is not valid');
          console.log("error", error);
          res.send(JSON.stringify(error));
        }
        if (results) {
          con.query(`SELECT * FROM box WHERE id=${place_id}`, (error, results) => {
            if (error) {
              console.log('error from db connection or the place_id not valid');
              console.log('error', error);
              res.send(JSON.stringify(error));
              return;
            }
            placeUserCallback(results);
          })
        }
      })
      */

    } else {
      placeUserCallback(results);
    }
  })
});









// con.query(`SELECT * FROM box WHERE place_id=${place_id}`, (error, box_results) => {

//   // console.log(error);
//   // console.log(results);

//   // TODO :- If we uncomment the above code for data validating then we doesn't need this error validator for each then please comment the 
//   // below code block

//   if (error) {
//     // if place_id does not exist or the place_id is not a valid value
//     console.log('error from db connection or the place_id is not valid');
//     console.log("error", error);
//     res.send(JSON.stringify(error));
//     return;
//   }

//   if (!box_results.length) {
//     console.log('this is the error when not able to finde place_id');
//     console.log('error = null & results = []');
//     res.send('No Data Avalilabe with this place_id');
//     return;

//     // TODO: Here we can add a new box if the new box is not exist
//     // I.E:- we can create a new entry if unable to find the place with this id

//     // TODO: Use the below code if we're creating a new box with place_id for user exists of not at the top rather then two level later.

//     /*
//     con.query(`INSERT INTO box (place_id) VALUES (${place_id})`, (err, res) => {

//     })
//     */
//   }


//   // con.query(`SELECT * FROM users WHERE id=${user_id}`, (error, users_results) => {

//   //   if (error) {
//   //     console.log('error from db connection or the user_id is not valid');
//   //     console.log("error", error);
//   //     res.send(JSON.stringify(error));
//   //     return;
//   //   }

//   //   // if (!users_results.length) {

//   //   // }

//   // })

//   // if (!results.length) {
//   //   // Success Condition :- When there is no data with the search query of place_id i.e => results array empty
//   //   console.log('this is the error when not able to finde place_id');
//   //   console.log('error = null & results = []');
//   //   res.send('No Data Avalilabe with this place_id');
//   //   return;
//   //   // TODO:- create this place_id and add this into box and box_users table
//   // }

//   // place id's are unique so only one result
//   // result = id,place_id,created_on

//   var box_id = box_results[0].id;

//   console.log("box_id", box_id);

//   /*

//   Conditions

//   1. box_id not available in the box_users
//   2. user_id not avalilable in the box_users
//   3. both are not available

//   */

//   con.query('SELECT * FROM box_users WHERE box_id = ' + box_id + ' AND user_id = ' + user_id, function (error, results) {

//     console.log(results);

//     if (error) {
//       // this error happns when the user_id is not valid 
//       console.log('the provided user_id is not valid');
//       console.log(error);
//       res.send(JSON.stringify(error));
//       return;
//     }

//     if (results.length > 0) {
//       // the record exists so return the response from here
//       console.log("results", results);
//       res.send(JSON.stringify(results));
//       return;
//     }

//     // else {
//     console.log("box_id", box_id);
//     console.log("user_id", user_id);

//     // Now if the data does not match in the box_users table then check if the user_id with the id exists

//     con.query(`SELECT * FROM users WHERE id = ${user_id}`, function (err, res) {

//       if (err) {
//         // This check is for if anyhow the user_id is not in valid format or i.e. not a number
//         console.log('this is error no user found', err);
//         res.send(JSON.stringify(err));
//         return;
//       }

//       console.log(res);

//       // If the res array is not empty means the user exists in the users table

//       if (!res.length) {

//         // con.query(`INSET INTO box (place_id) VALUES (${place_id})`, (err, res) => {
//         //   if (err) {
//         //     console.log('the data for box inserting is not valid');
//         //     console.log('error', err);
//         //     return;
//         //   }

//         //   console.log('this is the result after inserting into box', res);
//         // })
//         con.query(`INSERT INTO box_users (box_id,user_id) VALUES (${box_id},${user_id})`, function (err, res) {
//           if (err) {
//             console.log('this is error', err);
//             return;
//           }
//           console.log('this is result', res);
//         })
//       } else {
//         console.log('No user exists with this id');
//       }
//     })
//     // }
//   });

//   // res.end(JSON.stringify(results));

// });









io.on('connection', function (socket) {
  var addedUser = true;
  socket.on('send message', function (data) {
    var chat_data = JSON.parse(data);
    var type = chat_data.type;
    var msgid = chat_data.message_id;
    var islike = chat_data.is_like;
    var boxid = chat_data.box_id;
    var useeridd = chat_data.user_id;
    var msssgidd = msgid;
    var isliketext = '';

    //console.log('requested message: ' + JSON.stringify(chat_data));
    io.emit('send message', chat_data.message);
    if (typeof chat_data.isliketext === undefined) {
      isliketext = 'No';
    } else {
      isliketext = chat_data.isliketext;
    }
    if (isliketext === false) {
      isliketext = 'Yes';
    }
    if (type != '' && msgid != '' && isliketext == '') {
      con.query("UPDATE messages SET `attachment_name` ='" + type + "' where id =" + msgid, function (err, res) {
        if (err) throw err;
        con.query('SELECT * FROM messages where status=1 and id =' + msgid, function (err, chat_row) {
          if (err) throw err;
          con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_row_token) {
            if (err) throw err;
            con.query('SELECT count(id) as chatCount FROM messages where box_id = ' + chat_row[0]['box_id'] + ' and status=1 ', function (err, chat_row_count) {
              con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_sender_name) {
                con.query('SELECT messages.*,users.* FROM messages LEFT JOIN users ON messages.user_id = users.id where messages.status=1 and messages.id =' + chat_row[0]['parent_id'], function (err, chat_row_reply) {
                  /*if(err) throw err;            
                    var gcm = require('node-gcm');
                    var sender = new  gcm.Sender('AAAAow9shaE:APA91bEtXJKsWaKdEXsbGuSPd3f31adh2cAxRKnNv0MNu_xV6CeUpKK6kWJcb8cGgF5cRDRWMqdB15tEX2p5j19CeBHe9vt4uPtqwhUAqwcRoN6DzNrhEqJ_gvSuJj37RTWDNVFLSL9R');
                     var message = new gcm.Message({
                      notification: {
                        msgcnt: 1,
                        title: "Popboxchat",
                        icon: "icon_push",
                        sound: 'default', 
                        body: "You have "+chat_row_count[0]['chatCount']+" unread messages",
                        type: "Chat",
                        sender_id: chat_row[0]['user_id'],
                        sender_name: chat_sender_name[0]['username'],
                        receiver_id: chat_row[0]['box_id'],
                        parent_id: chat_row[0]['parent_id'],
                        foreground:false
                      }
                    });
                    var regTokens = [chat_row_token[0]['token']];
              
                      sender.send(message, {registrationTokens: regTokens}, function (err, response) {
                      if(err){
                        console.log(err);
                      
                      }else{
                        console.log(response);
                      }
                     });*/
                  var employees = [];
                  employees.push({
                    results: chat_row_reply
                  });
                  var d = new Date(chat_row[0]['created_at']);
                  var day = d.getDate();
                  var month = d.getMonth() + 1;
                  var year = d.getFullYear();
                  if (day < 10) {
                    day = "0" + day;
                  }
                  if (month < 10) {
                    month = "0" + month;
                  }
                  var curr_hour = d.getHours();
                  var curr_min = d.getMinutes();
                  var curr_sec = d.getSeconds();
                  var date = year + "-" + month + "-" + day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
                  chat_row[0]['created_at'] = date;
                  chat_row[0]['reply'] = employees;
                  chat_row[0]['color'] = '0';
                  chat_row[0]['count'] = '0';
                  chat_row[0]['username'] = chat_sender_name[0]['username'];
                  setTimeout(function () {
                    socket.broadcast.emit('send', {
                      message: chat_row[0],
                      user: chat_sender_name[0]['username']
                    });
                  }, 100);
                  io.emit('sendandroid', {
                    message: chat_row[0],
                    user: chat_sender_name[0]['username']
                  });
                });
              });
            });
          });
        });
      });
    } else {
      if (isliketext == '') {
        con.query('INSERT INTO messages SET ?', chat_data, function (err, res) {
          if (err) throw err;
          con.query('SELECT * FROM messages where status=1 and id =' + res.insertId, function (err, chat_row) {
            if (err) throw err;
            con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_row_token) {
              if (err) throw err;
              con.query('SELECT count(id) as chatCount FROM messages where box_id = ' + chat_row[0]['box_id'] + ' and status=1 ', function (err, chat_row_count) {
                con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_sender_name) {
                  con.query('SELECT messages.*,users.* FROM messages LEFT JOIN users ON messages.user_id = users.id where messages.status=1 and messages.id =' + chat_row[0]['parent_id'], function (err, chat_row_reply) {
                    /*if(err) throw err;            
                    var gcm = require('node-gcm');
                    var sender = new  gcm.Sender('AAAAow9shaE:APA91bEtXJKsWaKdEXsbGuSPd3f31adh2cAxRKnNv0MNu_xV6CeUpKK6kWJcb8cGgF5cRDRWMqdB15tEX2p5j19CeBHe9vt4uPtqwhUAqwcRoN6DzNrhEqJ_gvSuJj37RTWDNVFLSL9R');
                     var message = new gcm.Message({
                      notification: {
                        msgcnt: 1,
                        title: "Popboxchat",
                        icon: "icon_push",
                        sound: 'default', 
                        body: "You have "+chat_row_count[0]['chatCount']+" unread messages",
                        type: "Chat",
                        sender_id: chat_row[0]['user_id'],
                        sender_name: chat_sender_name[0]['username'],
                        receiver_id: chat_row[0]['box_id'],
                        parent_id: chat_row[0]['parent_id'],
                        foreground:false
                      }
                    });
                    var regTokens = [chat_row_token[0]['token']];
              
                    sender.send(message, {registrationTokens: regTokens}, function (err, response) {
                      if(err){
                        console.log(err);
                      }else{
                        console.log(response);
                      }
                    });*/
                    var employees = [];
                    employees.push({
                      results: chat_row_reply
                    });
                    var d = new Date(chat_row[0]['created_at']);
                    var day = d.getDate();
                    var month = d.getMonth() + 1;
                    var year = d.getFullYear();
                    if (day < 10) {
                      day = "0" + day;
                    }
                    if (month < 10) {
                      month = "0" + month;
                    }
                    var curr_hour = d.getHours();
                    var curr_min = d.getMinutes();
                    var curr_sec = d.getSeconds();
                    var date = year + "-" + month + "-" + day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
                    chat_row[0]['created_at'] = date;
                    chat_row[0]['reply'] = employees;
                    chat_row[0]['color'] = '0';
                    chat_row[0]['count'] = '0';
                    chat_row[0]['username'] = chat_sender_name[0]['username'];
                    setTimeout(function () {
                      socket.broadcast.emit('send', {
                        message: chat_row[0],
                        user: chat_sender_name[0]['username']
                      });
                    }, 100);
                    io.emit('sendandroid', {
                      message: chat_row[0],
                      user: chat_sender_name[0]['username']
                    });
                  });
                });
              });
            });
          });
        });
      }
    }
    if (boxid != '' && useeridd != '' && msssgidd != '' && isliketext == 'Yes') {
      con.query('SELECT * FROM message_likes where message_id =' + msssgidd + ' and user_id=' + useeridd, function (err, chat_row_detail) {
        console.log('chat_row_detail' + JSON.stringify(chat_row_detail));
        if (islike == 1) {
          if (typeof chat_row_detail[0] !== "undefined") {
            console.log(chat_row_detail[0]['id']);
            con.query("DELETE FROM message_likes WHERE id=" + chat_row_detail[0]['id'], function (err, deletedata, fields) {
              // if any error while executing above query, throw error
              if (err) throw err;
              // if there is no error, you have the result
              console.log(deletedata);
            });
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            if (day < 10) {
              day = "0" + day;
            }
            if (month < 10) {
              month = "0" + month;
            }
            var curr_hour = d.getHours();
            var curr_min = d.getMinutes();
            var curr_sec = d.getSeconds();
            var date = year + "-" + month + "-" + day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
            var records = [
              [msssgidd, useeridd, date]
            ];
            con.query("INSERT INTO message_likes (message_id,user_id,created_at) VALUES ?", [records], function (err, result, fields) {
              // if any error while executing above query, throw error
              if (err) throw err;
              // if there is no error, you have the result
              console.log(result);
              /*con.query("SELECT id,username,token,device_type FROM users where active=1", function(err, rows, fields) {
                con.query("SELECT id,username,token,device_type FROM users where id="+useeridd, function(err, rowsss, fieldsss) {
                  con.query("SELECT id,message FROM messages where id="+msssgidd, function(err, msgdata, msgfield) {
                    rows.forEach(function(row) {
                      if(row.id != useeridd){
                        console.log(row.username);  
                        planPush = {};
                        planPush.device_type = row.device_type;
                        planPush.notification_type = 'Like Message';
                        planPush.pushMsg = rowsss.username+' Like '+msgdata.message;
                        planPush.registrationId = row.token;
                        pushSend(planPush,row, function(err, ret){
                           console.log(ret);
                        });
                      }
                      
                    });
                  });
                });
              });*/
            });
          } else {
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();
            if (day < 10) {
              day = "0" + day;
            }
            if (month < 10) {
              month = "0" + month;
            }
            var curr_hour = d.getHours();
            var curr_min = d.getMinutes();
            var curr_sec = d.getSeconds();
            var date = year + "-" + month + "-" + day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
            var records = [
              [msssgidd, useeridd, date]
            ];
            con.query("INSERT INTO message_likes (message_id,user_id,created_at) VALUES ?", [records], function (err, result, fields) {
              // if any error while executing above query, throw error
              if (err) throw err;
              // if there is no error, you have the result
              /*con.query("SELECT id,username,token,device_type FROM users where active=1", function(err, rows, fields) {
                con.query("SELECT id,username,token,device_type FROM users where id="+useeridd, function(err, rowsss, fieldsss) {
                  con.query("SELECT id,message FROM messages where id="+msssgidd, function(err, msgdata, msgfield) {
                    rows.forEach(function(row) {
                      if(row.id != useeridd){
                        console.log(row.username);  
                        planPush = {};
                        planPush.device_type = row.device_type;
                        planPush.notification_type = 'Like Message';
                        planPush.pushMsg = rowsss.username+' Like '+msgdata.message;
                        planPush.registrationId = row.token;
                        pushSend(planPush,row, function(err, ret){
                           console.log(ret);
                        });
                        
                      }
                      
                    });
                  });
                });
              });*/
            });
            type = 1;
            con.query("UPDATE messages SET `is_like` ='" + type + "' where id =" + msssgidd, function (err, res) {
              if (err) throw err;
              console.log(res);
            });
          }
        } else {
          if (typeof chat_row_detail[0] !== "undefined") {
            con.query("DELETE FROM message_likes WHERE id=" + chat_row_detail[0]['id'], function (err, deletedata, fields) {
              // if any error while executing above query, throw error
              if (err) throw err;
              // if there is no error, you have the result
              console.log(deletedata);
            });
            type = 0;
            con.query("UPDATE messages SET `is_like` ='" + type + "' where id =" + msssgidd, function (err, res) {
              if (err) throw err;
              console.log(res);
            });
          }
        }
      });
      con.query('SELECT * FROM messages where status=1 and id =' + msssgidd, function (err, chat_row) {
        con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_row_token) {
          con.query('SELECT count(id) as chatCount FROM messages where box_id = ' + chat_row[0]['box_id'] + ' and status=1 ', function (err, chat_row_count) {
            con.query('SELECT username FROM users where id =' + chat_row[0]['user_id'], function (err, chat_sender_name) {
              con.query('SELECT messages.*,users.* FROM messages LEFT JOIN users ON messages.user_id = users.id where messages.status=1 and messages.id =' + chat_row[0]['parent_id'], function (err, chat_row_reply) {
                con.query('SELECT count(id) as likeCount FROM message_likes where message_id = ' + msssgidd, function (err, chat_row_count_like) {
                  //var regTokens = [chat_row_token[0]['token']];
                  var employees = [];
                  employees.push({
                    results: chat_row_reply
                  });
                  var d = new Date(chat_row[0]['created_at']);
                  var day = d.getDate();
                  var month = d.getMonth() + 1;
                  var year = d.getFullYear();
                  if (day < 10) {
                    day = "0" + day;
                  }
                  if (month < 10) {
                    month = "0" + month;
                  }
                  var curr_hour = d.getHours();
                  var curr_min = d.getMinutes();
                  var curr_sec = d.getSeconds();
                  var date = year + "-" + month + "-" + day + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
                  chat_row[0]['created_at'] = date;
                  chat_row[0]['reply'] = employees;
                  chat_row[0]['color'] = '0';
                  chat_row[0]['count'] = chat_row_count_like[0];
                  chat_row[0]['username'] = chat_sender_name[0]['username'];
                  setTimeout(function () {
                    socket.broadcast.emit('msg', {
                      message: chat_row[0],
                      user: chat_sender_name[0]['username']
                    });
                    //socket.broadcast.emit('msgandroid', {message: chat_row[0],user:chat_sender_name[0]['username'] });
                  }, 100);
                  io.emit('msgandroid', {
                    message: chat_row[0],
                    user: chat_sender_name[0]['username']
                  });
                  //console.log('response'+JSON.stringify(chat_row[0]));
                });
              });
            });
          });
        });
      });
    }
  });
  // Function for send push notification
  function pushSend(pushInfo, pushData, cb) {
    console.log("pushSend");
    var gcm = require('node-gcm');
    //var sender = new gcm.Sender('AAAAFp9tg4A:APA91bECtd0namHkjFBMj7C3IMIgH3LKwtvS8EX_9MOzU0fodYPurGE46lZdmAD8tQT9Z-mJ1uZLu7aXwCRUIYEM-rQXDJuuWD1vG8KPY27lAsxMimTs47IwYvyUApqAqdOVIJGX01ba5kDIt9s-EEt3_ex_od1yVg');
    var sender = new gcm.Sender('AAAAow9shaE:APA91bEtXJKsWaKdEXsbGuSPd3f31adh2cAxRKnNv0MNu_xV6CeUpKK6kWJcb8cGgF5cRDRWMqdB15tEX2p5j19CeBHe9vt4uPtqwhUAqwcRoN6DzNrhEqJ_gvSuJj37RTWDNVFLSL9R');
    if (pushInfo.device_type == 1) {
      console.log(pushInfo.device_type);
      var message = new gcm.Message({
        collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
          msgcnt: 1,
          title: 'Popboxchat',
          icon: "icon_push",
          sound: 'default',
          message: pushInfo.pushMsg,
          body: 'Popboxchat',
          type: pushInfo.notification_type
        }
      });
    } else {
      var message = new gcm.Message({
        notification: {
          msgcnt: 1,
          title: "Popboxchat",
          icon: "icon_push",
          sound: 'default',
          body: pushInfo.pushMsg,
          type: pushInfo.notification_type,
          foreground: false
        }
      });
    }
    var regTokens = [pushInfo.registrationId];
    sender.send(message, {
      registrationTokens: regTokens
    }, function (err, response) {
      if (err) {
        return cb(err, null);
      } else {
        //console.log(response);
        return cb(null, response);
      }
    });
  }
  socket.on('receive message', function (data) {
    var chat_data = JSON.parse(data);
    console.log("chat_data", chat_data);
    // con.query(
    //  'UPDATE chats SET is_view = ? Where ID = ?',
    //      [0, chat_data.id],
    // function (err, result) {
    // if (err) throw err;
    // }
    // );
    //chat_data.is_view = 1;
    //console.log(chat_data);
  });
  /*socket.on('chat message', function(msg){
    console.log("msg", msg);
      io.emit('chat message', msg);
  });*/
});