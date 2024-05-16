const express = require("express");
const todos = require("./todos.json");
const verifyToken = require("./validationMiddleware");
const validateRequestBody = require("./validationMiddleware");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//Activate Middleware
app.use(express.json());
app.use(bodyParser.json());

//get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

//get perticular todo according to ID passes
app
  .route("/todos/:id")
  .get((req, res) => {
    console.log(req.params);
    const id = parseInt(req.params.id);

    const todo = todos.find((todo) => {
      return todo.id === id;
    });

    if (!todo) {
      res.status(404).send("Todo not Found");
    } else {
      res.json(todo);
    }
  })
  .put(validateRequestBody, (req, res) => {
    const id = parseInt(req.params.id);
    console.log(req.params);
    const updatedTodo = req.body;
    // console.log(updatedTodo);

    const index = todos.findIndex((todo) => id === todo.id);

    if (index === -1) {
      res.status(404).send("Todo not found");
      return;
    } else {
      todos[index] = { ...updatedTodo, id };
      res.send("Todo updated successfully :)");
    }
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((todo) => id === todo.id);

    if (index === -1) {
      res.status(404).send("Todo not found");
      return;
    } else {
      todos.splice(index, 1);
      res.send("Todo deleted successfully :)");
    }
  });

//Create new user
app.post("/todos", validateRequestBody, (req, res) => {
  try {
    const body = req.body;
    // console.log(body);
    todos.push({
      id: todos.length + 1,
      ...body,
    });
    res.send("Todo created successfully :)");
  } catch {
    return res.status(500).send("Error in posting todo");
  }
});

app.listen(3000, () => {
  console.log("Server Listening to port 3000");
});

//array to store user
const users = [
  {
    username: "Raviraj",
    password: '$2b$10$2n4jDTeKBMOWSNt04eeyuOYy3IRN6djshWAcLSPzvlXOgzgNTSp/2',
  },
];

// User registration (sign-up)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  // console.log("users:",users)
  res.status(201).json({ message: "User registered successfully" });
});

// User login (authentication)
app.post("/login", async (req, res) => {
  console.log(users);
  const { username, password } = req.body;
  console.log(req.body);
  // console.log(users)
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res
      .status(401)
      .json({ error: "Invalid username or password (usernameCheck)" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "your-secret-key", { expiresIn: "1h" });
  res.json({ token });
});


// Protected route example
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', username: req.username });
});
