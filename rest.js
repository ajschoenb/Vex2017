var mysql = require("mysql");
var fs = require("fs");

function rest_router(router, connection) {
  var self = this;
  self.handleRoutes(router, connection);
}

rest_router.prototype.handleRoutes = function(router, connection) {
  var most_recent = 0;
  var query_bool = 0;
  var query_res = "";
  router.get("/", function(req, res) {
    var teams_sql = "SELECT * FROM teams ORDER BY team_num ASC";
    var team_list = "";
    connection.query(teams_sql, function(err, rows) {
      for(var x in rows) {
        team_list += "<tr class=\"clickable-row\" data-href=\"/team/" + rows[x].team_num + "\"><td>" + rows[x].team_num + "</td><td>" + rows[x].team_name + "</td></tr>";
      }
      var scores_sql = "SELECT * FROM teams ORDER BY avg_contributed_score DESC, team_num ASC";
      var score_list = "";
      connection.query(scores_sql, function(err, rows) {
        for(var x in rows) {
          score_list += "<tr class=\"clickable-row\" data-href=\"/team/" + rows[x].team_num + "\"><td>" + rows[x].team_num + "</td><td>" + rows[x].avg_contributed_score + "</td><td>" + rows[x].avg_driver_rating + "</td></tr>";
        }
        res.render("pages/index", {
          team_list: team_list,
          score_list: score_list
        });
      });
    });
  });
  router.get("/data-entry", function(req, res) {
    var message = "";
    if(most_recent == -1) {
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like this is a duplicate entry. Data not queried.</p></div>";
    }
    else if(most_recent != -1 && most_recent != 0) {
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data for <b>"+ most_recent +"</b> has been <b>successfully</b> entered.</p></div>";
    }
    res.render("pages/data_entry", {
      message: message
    });
  });
  router.post("/parse-data", function(req, res) {
    var match_num = req.body.match_num || 0;
    var team_num = req.body.team_num || 0;
    var driver_rating = req.body.driver_rating || 0;
    var tele_star_near = req.body.tele_star_near || 0;
    var tele_star_far = req.body.tele_star_far || 0;
    var tele_star_miss = req.body.tele_star_miss || 0;
    var tele_cube_near = req.body.tele_cube_near || 0;
    var tele_cube_far = req.body.tele_cube_far || 0;
    var tele_cube_miss = req.body.tele_cube_miss || 0;
    var tele_low_hang = req.body.tele_low_hang || 0;
    var tele_high_hang = req.body.tele_high_hang || 0;
    var tele_hang_fail = req.body.tele_hang_fail || 0;
    var auto_star_near = req.body.auto_star_near || 0;
    var auto_star_far = req.body.auto_star_far || 0;
    var auto_star_miss = req.body.auto_star_miss || 0;
    var auto_cube_near = req.body.auto_cube_near || 0;
    var auto_cube_far = req.body.auto_cube_far || 0;
    var auto_cube_miss = req.body.auto_cube_miss || 0;
    var auto_low_hang = req.body.auto_low_hang || 0;
    var auto_high_hang = req.body.auto_high_hang || 0;
    var auto_hang_fail = req.body.auto_hang_fail || 0;
    var auto_score = 1 * auto_star_near + 2 * auto_star_far + 2 * auto_cube_near + 4 * auto_cube_far + 4 * auto_low_hang + 12 * auto_high_hang;
    var contrib_score = auto_score + 1 * tele_star_near + 2 * tele_star_far + 2 * tele_cube_near + 4 * tele_cube_far + 4 * tele_low_hang + 12 * tele_high_hang;
    var insert_sql = "INSERT INTO matches (match_num, team_num, tele_star_near, tele_star_far, tele_star_miss, tele_cube_near, tele_cube_far, tele_cube_miss, " +
    "tele_low_hang, tele_high_hang, tele_hang_fail, auto_star_near, auto_star_far, auto_star_miss, auto_cube_near, auto_cube_far, auto_cube_miss, auto_low_hang, " +
    "auto_high_hang, auto_hang_fail, driver_rating, contributed_score, auto_score) VALUES (" + match_num + ", " + team_num + ", " + tele_star_near + ", " + tele_star_far +
    ", " + tele_star_miss + ", " + tele_cube_near + ", " + tele_cube_far + ", " + tele_cube_miss + ", " + tele_low_hang + ", " + tele_high_hang + ", " + tele_hang_fail +
    ", " + auto_star_near + ", " + auto_star_far + ", " + auto_star_miss + ", " + auto_cube_near + ", " + auto_cube_far + ", " + auto_cube_miss + ", " + auto_low_hang +
    ", " + auto_high_hang + ", " + auto_hang_fail + ", " + driver_rating + ", " + contrib_score + ", " + auto_score + ")";
    connection.query(insert_sql, function(err) {
      if(!err) {
        most_recent = team_num;
        updateTeams(team_num);
      }
      else {
        console.log(err);
        most_recent = -1;
      }
      res.redirect("/data-entry");
    });
  });
  router.get("/team/:team_num", function(req, res) {
    updateTeams(req.params.team_num);
    var team_num = req.params.team_num;
    var team_name = "";
    var tele_star_near = 0;
    var tele_star_far = 0;
    var tele_star_miss = 0;
    var tele_cube_near = 0;
    var tele_cube_far = 0;
    var tele_cube_miss = 0;
    var tele_low_hang = 0;
    var tele_high_hang = 0;
    var tele_hang_fail = 0;
    var auto_star_near = 0;
    var auto_star_far = 0;
    var auto_star_miss = 0;
    var auto_cube_near = 0;
    var auto_cube_far = 0;
    var auto_cube_miss = 0;
    var auto_low_hang = 0;
    var auto_high_hang = 0;
    var auto_hang_fail = 0;
    var avg_contrib_score = 0;
    var avg_auto_score = 0;
    var avg_driver_rating = 0;
    var team_sql = "SELECT * FROM teams WHERE team_num=" + team_num;
    connection.query(team_sql, function(err, rows) {
      team_name = rows[0].team_name;
      tele_star_near = rows[0].avg_tele_star_near;
      tele_star_far = rows[0].avg_tele_star_far;
      tele_star_miss = rows[0].avg_tele_star_miss;
      tele_cube_near = rows[0].avg_tele_cube_near;
      tele_cube_far = rows[0].avg_tele_cube_far;
      tele_cube_miss = rows[0].avg_tele_cube_miss;
      tele_low_hang = rows[0].tot_tele_low_hang;
      tele_high_hang = rows[0].tot_tele_high_hang;
      tele_hang_fail = rows[0].tot_tele_hang_fail;
      auto_star_near = rows[0].avg_auto_star_near;
      auto_star_far = rows[0].avg_auto_star_far;
      auto_star_miss = rows[0].avg_auto_star_miss;
      auto_cube_near = rows[0].avg_auto_cube_near;
      auto_cube_far = rows[0].avg_auto_cube_far;
      auto_cube_miss = rows[0].avg_auto_cube_miss;
      auto_low_hang = rows[0].tot_auto_low_hang;
      auto_high_hang = rows[0].tot_auto_high_hang;
      auto_hang_fail = rows[0].tot_auto_hang_fail;
      avg_contrib_score = rows[0].avg_contributed_score;
      avg_auto_score = rows[0].avg_auto_score;
      avg_driver_rating = rows[0].avg_driver_rating;
    });

    var no_auto_sql = "SELECT * FROM matches WHERE team_number = " + team_num + " AND auton_score = 0"
    var next_team_sql = "SELECT team_num FROM teams WHERE team_num > " + team_num;
    var prev_team_sql = "SELECT team_num FROM teams WHERE team_num < " + team_num + " ORDER BY team_num DESC";
    var first_team_sql = "SELECT team_num FROM teams";
    var last_team_sql = "SELECT team_num FROM teams ORDER BY team_num DESC";
    var no_autos = 0;
    connection.query(no_auto_sql, function(err, rows, fields) {
      for(var x in rows) {
        no_autos++;
      }
    });
    connection.query(first_team_sql, function(err, rows, fields) {
      first_team = rows[0].team_num;
    });
    connection.query(last_team_sql, function(err, rows, fields) {
      last_team = rows[0].team_num;
    });
    connection.query(next_team_sql, function(err, rows, fields) {
      if (team_num == last_team) {
        next_team = first_team;
      }
      else {
        next_team = rows[0].team_num;
      }
    });
    connection.query(prev_team_sql, function(err, rows, fields) {
      if (team_num == first_team) {
        prev_team = last_team;
      }
      else {
        prev_team = rows[0].team_num;
      }
      res.render("pages/team", {
        team_number: team_num,
        team_name: team_name,
        previous_team: prev_team,
        next_team: next_team,
        no_autos: no_autos,
        avg_auto_score: avg_auto_score,
        avg_contrib_score: avg_contrib_score,
        auto_star_near: auto_star_near,
        auto_star_far: auto_star_far,
        auto_star_miss: auto_star_miss,
        auto_cube_near: auto_cube_near,
        auto_cube_far: auto_cube_far,
        auto_cube_miss: auto_cube_miss,
        auto_low_hang: auto_low_hang,
        auto_high_hang: auto_high_hang,
        auto_hang_fail: auto_hang_fail,
        tele_star_near: tele_star_near,
        tele_star_far: tele_star_far,
        tele_star_miss: tele_star_miss,
        tele_cube_near: tele_cube_near,
        tele_cube_far: tele_cube_far,
        tele_cube_miss: tele_cube_miss,
        tele_low_hang: tele_low_hang,
        tele_high_hang: tele_high_hang,
        tele_hang_fail: tele_hang_fail,
        avg_driver_rating: avg_driver_rating
      });
    });
  });
  router.get("/sql", function(req, res) {
    var message = "";
    if(query_bool == -1)
      message = "<div class=\"alert alert-danger\" role=\"alert\"><p><b>Oh snap</b>, looks like there's a mistake in your query. Data not queried.</p></div>";
    else if(query_bool != -1 && query_bool != 0)
      message = "<div class=\"alert alert-success\" role=\"alert\"><p>Data has been <b>successfully</b> queried.</p></div>";
    res.render("pages/sql", {
      message: message,
      result: query_res
    });
    if(query_bool == 1)
    {
      query_res = "";
      query_bool = 0;
    }
  });
  router.post("/query", function(req, res) {
    var sql = req.body.query;
    query_res = "";
    connection.query(sql, function(err, rows, fields) {
      if(err)
      {
        console.log(err);
        query_bool = -1;
      }
      else
      {
        query_bool = 1;
        query_res += "<tr>";
        for(var p in rows[0])
        {
          query_res += "<th>" + p + "</th>";
        }
        for(var i in rows)
        {
          query_res += "</tr><tr>";
          for(var p in rows[i])
          {
            query_res += "<td>" + rows[i][p] + "</td>";
          }
          query_res += "</tr>";
        }
      }
      res.redirect("/sql");
    });
  });

  function updateTeams(team_num) {
    console.log("Updating teams for " + team_num);
    var team_sql = "UPDATE teams SET num_matches=(SELECT COUNT(*) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_star_near=(SELECT AVG(tele_star_near) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_star_far=(SELECT AVG(tele_star_far) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_star_miss=(SELECT AVG(tele_star_miss) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cube_near=(SELECT AVG(tele_cube_near) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cube_far=(SELECT AVG(tele_cube_far) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_tele_cube_miss=(SELECT AVG(tele_cube_miss) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_low_hang=(SELECT SUM(tele_low_hang) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_high_hang=(SELECT SUM(tele_high_hang) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_tele_hang_fail=(SELECT SUM(tele_hang_fail) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_star_near=(SELECT AVG(auto_star_near) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_star_far=(SELECT AVG(auto_star_far) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_star_miss=(SELECT AVG(auto_star_miss) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_cube_near=(SELECT AVG(auto_cube_near) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_cube_far=(SELECT AVG(auto_cube_far) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_cube_miss=(SELECT AVG(auto_cube_miss) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_low_hang=(SELECT SUM(auto_low_hang) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_high_hang=(SELECT SUM(auto_high_hang) FROM matches WHERE team_num=" + team_num + "), " +
    "tot_auto_hang_fail=(SELECT SUM(auto_hang_fail) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_contributed_score=(SELECT AVG(contributed_score) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_auto_score=(SELECT AVG(auto_score) FROM matches WHERE team_num=" + team_num + "), " +
    "avg_driver_rating=(SELECT AVG(driver_rating) FROM matches WHERE team_num=" + team_num + ") WHERE team_num=" + team_num + ";";
    connection.query(team_sql, function(err) {
      if(err) {
        console.log(err);
      }
    });
  };
};

module.exports = rest_router;
