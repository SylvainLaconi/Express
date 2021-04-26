const connection = require("./db-config");

const express = require("express");
const movies = require("./movies");
const { connect } = require("./db-config");
const port = 3000;
const app = express();

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

//Création d'une route GET pour afficher la page home

app.get("/", (req, res) => {
  res.send("Welcome to my favourite movie list");
});

//Création d'une route GET pour afficher tous les movies

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

//Création d'une route GET pour sélection d'un movie par son id

app.get("/api/movies/:id", (req, res) => {
  connection.query(
    "SELECT * from movies WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Création d'une route GET pour sélection des movies sur leur duration

app.get("/api/search", (req, res) => {
  connection.query(
    "SELECT * FROM movies WHERE duration <=?",
    [req.query.maxDuration],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//Création d'une route POST pour ajouter un nouveau film

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving the movie");
      } else {
        res.status(201).send("Movie successfully saved");
      }
    }
  );
});

//Création d'une route POST pour ajouter un nouveau user

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES (?, ?, ?)",
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        res.status(500).send("Error saving new user");
      } else {
        res.status(201).send("User correctly saved");
      }
    }
  );
});

//Création d'une route GET pour visualiser la liste des users

app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send("Fail to reach users");
    } else {
      res.status(200).json(results);
    }
  });
});

//Création d'une route PUT pour modifier un user

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userPropsToUpdate = req.body;
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [userPropsToUpdate, userId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

//Création d'une route PUT pour modifier un movie

app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const moviePropsToUpdate = req.body;
  connection.query(
    "UPDATE movies SET ? WHERE id = ?",
    [moviePropsToUpdate, movieId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("Movie updated successfully 🎉");
      }
    }
  );
});

//Création d'une route DELETE pour supprimer un user

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  connection.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting an user");
      } else {
        res.status(200).send("User successfully deleted");
      }
    }
  );
});

//Création d'une route DELETE pour supprimer un movie

app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  connection.query(
    "DELETE FROM movies WHERE id = ?",
    [movieId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting movie");
      } else {
        res.status(200).send("Movie successfully deleted");
      }
    }
  );
});
