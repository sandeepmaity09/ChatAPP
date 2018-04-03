var con = require('../../config/database.config')
// console.log('config con', con);

joinLocationController = function (req, res) {

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
};

module.exports = joinLocationController;