const express = require("express");
const multer = require("multer"); // Import multer for handling file uploads
const mongoose = require("mongoose");
// Import the customerDetail model
const customerDetail = require("./models/customerDetail.model.js");
const Image = require("./models/image.model"); // Import the Image model
const path = require("path");
const fs = require("fs");
const Country = require("./models/countries.model.js"); // Import the Country model
const countries = require("./db/countries.js");
const cors = require("cors"); // Import CORS package

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET, POST",
  allowedHeaders: "Content-Type, Authorization"
}));
app.use(cors()); // Enable CORS for all routes
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

// Define routes
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// Get all customer details
app.get("/api/getCustomersDetails", async (req, res) => {
  try {
    const data = await customerDetail.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer detail by ID
app.get("/api/getCustomersDetails/:id", async (req, res) => {
  try {
    const data = await customerDetail.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new customer detail
app.post("/api/customerDetails", async (req, res) => {
  try {
    const data = await customerDetail.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing customer detail
app.put("/api/updateCustomerDetails/:id", async (req, res) => {
  try {
    const data = await customerDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a customer detail
app.delete("/api/deleteCustomerDetails/:id", async (req, res) => {
  try {
    const data = await customerDetail.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if a docket number is already present
app.get("/api/checkDocketNumber/:docketNumber", async (req, res) => {
  try {
    const docketNumber = req.params.docketNumber;
    const data = await customerDetail.findOne({ docketNumber });
    if (data) {
      return res
        .status(200)
        .json({ message: "Docket number is already present", present: true });
    } else {
      return res
        .status(200)
        .json({ message: "Docket number is not present", present: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/getCountries", async (req, res) => {
  try {
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Store images
app.post("/api/store-images", upload.single("image"), async (req, res) => {
  try {
    console.log("req.file:", req.file);
    const { customerName, customerNumber, docketNumber } = req.body;
    const imageData = new Image({
      customerName,
      customerNumber,
      docketNumber,
      image: req.file.buffer,
    });
    console.log("imageData:", imageData);
    await imageData.save();
    res.status(201).json({ message: "Image stored successfully" });
  } catch (error) {
    console.error("Error storing image:", error);
    res.status(500).json({ message: error.message });
  }
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://teja205101:205AJe-T101@cluster0.c4kud.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to the MongoDB database");
  })
  .catch((error) => {
    console.error("Failed to connect to the MongoDB database", error);
  });

// ========================================================================

const bags = {
  "small": { "bag_name": "Small Bag", "limit_info": "Weight 1-5 kg", "image_url": "images/bags-01.png", "id": 1, "length": 30, "width": 20, "height": 10, "volumetric_max": 6000, "max_weight": 5, "type": "website" },
  "medium": { "bag_name": "Medium Bag", "limit_info": "Weight 6-10 kg", "image_url": "images/bags-02.png", "id": 2, "length": 40, "width": 25, "height": 15, "volumetric_max": 15000, "max_weight": 10, "type": "website" },
  "large": { "bag_name": "Large Bag", "limit_info": "Weight 11-15 kg", "image_url": "images/bags-03.png", "id": 3, "length": 50, "width": 30, "height": 20, "volumetric_max": 30000, "max_weight": 15, "type": "website" },
  "xl": { "bag_name": "XL Bag", "limit_info": "Weight 16-20 kg", "image_url": "images/bags-04.png", "id": 4, "length": 60, "width": 40, "height": 25, "volumetric_max": 60000, "max_weight": 20, "type": "website" },
  "xxl": { "bag_name": "XXL Bag", "limit_info": "Weight 21-25 kg", "image_url": "images/bags-05.png", "id": 5, "length": 70, "width": 50, "height": 30, "volumetric_max": 105000, "max_weight": 25, "type": "website" }
};

const pricing = [
  { range: [0, 100], surface: 500, premium: 1000 },
  { range: [100, 250], surface: 700, premium: 1400 },
  { range: [250, 500], surface: 900, premium: 1800 },
  { range: [500, 1000], surface: 1200, premium: 2500 },
  { range: [1000, 1500], surface: 1600, premium: 3200 },
  { range: [1500, Infinity], surface: 2000, premium: 4000 }
];

app.get("/api/getBagsByDistance", (req, res) => {
  const distance = parseFloat(req.query.distance);
  if (isNaN(distance)) {
    return res.status(400).json({ error: "Invalid distance parameter" });
  }

  const costSlab = pricing.find(({ range }) => distance >= range[0] && distance < range[1]);
  if (!costSlab) {
    return res.status(400).json({ error: "Distance out of range" });
  }

  const response = {
    items: Object.fromEntries(
      Object.entries(bags).map(([key, bag]) => [
        key,
        {
          ...bag,
          surface_cost: costSlab.surface * (bag.max_weight / 5),
          premium_cost: costSlab.premium * (bag.max_weight / 5)
        }
      ])
    )
  };

  res.status(200).json(response);
});

// ======================================================================

const boxes = [
  { box_name: "5kg Box", limit_info: "Weight 1-5 kg", image_url: "images/boxes-01.png", id: 1, length: 30, width: 20, height: 10, max_weight: 5 },
  { box_name: "10kg Box", limit_info: "Weight 6-10 kg", image_url: "images/boxes-02.png", id: 2, length: 40, width: 25, height: 15, max_weight: 10 },
  { box_name: "15kg Box", limit_info: "Weight 11-15 kg", image_url: "images/boxes-03.png", id: 3, length: 50, width: 30, height: 20, max_weight: 15 },
  { box_name: "20kg Box", limit_info: "Weight 16-20 kg", image_url: "images/boxes-04.png", id: 4, length: 60, width: 40, height: 25, max_weight: 20 },
  { box_name: "25kg Box", limit_info: "Weight 21-25 kg", image_url: "images/boxes-05.png", id: 5, length: 70, width: 50, height: 30, max_weight: 25 },
  { box_name: "30kg Box", limit_info: "Weight 26-30 kg", image_url: "images/boxes-06.png", id: 6, length: 80, width: 55, height: 35, max_weight: 30 }
];

app.get("/api/getBoxes", (req, res) => {
  res.status(200).json({ items: boxes });
});

