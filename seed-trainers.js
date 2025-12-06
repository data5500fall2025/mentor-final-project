const mongoose = require("mongoose");
const Trainer = require("./models/trainer-model");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://a02362497_db_user:bitenodebistro@cluster0.3k99g4e.mongodb.net/Final-Exam";

// Function to manually generate a slug like schema would
function createSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

async function seedTrainers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    // Clear old trainers
    await Trainer.deleteMany({});
    console.log("Old trainers removed.");

    let trainers = [
      {
        name: "Tim Johnson",
        imageUrl: "/assets/img/team/trainer-1-2.jpg",
        description:
          "Tim enjoys building functional websites. He is a great mentor and flexible with his time.",
      },
      {
        name: "Bob Smith",
        imageUrl: "/assets/img/team/trainer-1.jpg",
        description:
          "Bob specializes in concert piano performances and helps students express emotion through music.",
      },
      {
        name: "Carla Reyes",
        imageUrl: "/assets/img/team/trainer-2-2.jpg",
        description:
          "Carla is an expert artist with advanced pottery skills. She loves transforming clay into art.",
      },
      {
        name: "David Lee",
        imageUrl: "/assets/img/team/trainer-3-2.jpg",
        description:
          "David captures life’s moments with photography and teaches students how to visualize their shots.",
      },
      {
        name: "Emma Chen",
        imageUrl: "/assets/img/team/trainer-2.jpg",
        description:
          "Emma is a talented graphic designer who loves helping students build creative portfolios.",
      },
      {
        name: "Frank Muller",
        imageUrl: "/assets/img/team/trainer-3.jpg",
        description:
          "Frank is a finance expert and DJ known as 'franko'. He helps students understand money and business.",
      }
    ];

    // ADD SLUGS MANUALLY
    trainers = trainers.map(t => ({
      ...t,
      slug: createSlug(t.name)
    }));

    // Insert into MongoDB
    await Trainer.insertMany(trainers);

    console.log("Trainers added successfully!");
    await mongoose.connection.close();
    console.log("Done.");
  } catch (err) {
    console.error("Error seeding trainers:", err);
  }
}

seedTrainers();
