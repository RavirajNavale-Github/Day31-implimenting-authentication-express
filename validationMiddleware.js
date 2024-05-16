function validateRequestBody(req, res, next) {
  // const { title, completed, category } = req.body;
  // // console.log('Hello from middleware')
  // // console.log(title, completed);

  // // && !title && !completed && !category
  // if (typeof completed !== Boolean) {
  //   return res.status(400).json({
  //     error:
  //       "Have you provided title and completed and category if Yes then check completed status it should be in true or false",
  //   });
  // }

  // // if((!title && !completed)){
  // //     return res.status(400).json({error: 'Title and status are required'});
  // // }
  next();
};


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};



module.exports = validateRequestBody, verifyToken;
