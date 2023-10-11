const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors'); 
const Review = require('./models/Review');
const Collection = require('./models/Collection');

const app = express();
const port = 4000;

// Connect to MongoDB
const uri = "mongodb+srv://markbosirekenyariri:09kumamoto.@cluster0.g3nicnh.mongodb.net/my_movie_app_db?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
// Define your routes and endpoints here
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// 2. Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// 3. Add a movie to a collection
app.post('/collections/:collectionId/movies', authenticateUser, async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { movieId } = req.body;

    // Check if the collection belongs to the authenticated user
    const collection = await Collection.findOne({ _id: collectionId, userId: req.user.userId });
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if the movie exists


    // Add the movie to the collection
    collection.movieIds.push(movieId);
    await collection.save();

    res.json({ message: 'Movie added to collection successfully' });
  } catch (error) {
    res.json(error)
    res.status(500).json({ error: error });
  }
});

// 4. Display collection
app.get('/collections/:collectionId', authenticateUser, async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Check if the collection belongs to the authenticated user
    const collection = await Collection.findOne({ _id: collectionId, userId: req.user.userId })
      .populate('movieIds');
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching collection' });
  }
});


// 5. Add a review
app.post('/reviews', authenticateUser, async (req, res) => {
  try {
    
    const { content, movieId, score } = req.body;

   if(!content || !movieId || !score){
    return res.status(400).json({ error: 'empty body' });
   }
    // Ensure the score is a valid number between 1 and 5
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Invalid score. Score must be between 1 and 5.' });
    }

    const review = new Review({ content, movieId, userId: req.user.userId, score });
    await review.save();

 

    res.json({ message: 'Review added successfully' ,review: review});
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


// 6. Display reviews
app.get('/reviews', authenticateUser, async (req, res) => {
  try {
    // Get reviews by the authenticated user
    const reviews = await Review.find({ userId: req.user.userId })
      .populate('movieId');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});
app.get('/reviews/:movieId', authenticateUser, async (req, res) => {
  try {
    const { movieId } = req.params;

    // Find reviews by movie ID and user ID
    const reviews = await Review.find({ movieId, userId: req.user.userId })
       

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});
// Add this endpoint after your other routes
app.post('/collections', authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    // Create a new collection with the provided name
    const collection = new Collection({ name, userId });
    await collection.save();

    res.json({ message: 'Collection created successfully', collection });
  } catch (error) {
    res.status(500).json({ error: 'Error creating collection' });
  }
});
// Get collections by user ID
app.get('/collections', authenticateUser, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.userId });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'No collection found' });
  }
});

// Get reviews by movie ID with user filter



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
