import { assets } from "../assets";

const tours = [
  {
    id: "01",
    title: "Westminister Bridge",
    city: "London",
    distance: 300,
    address:"somewhere",
    price: 99,
    maxGroupSize: 10,
    desc: "Westminster Bridge, a London icon, spans the River Thames with its distinctive green hue, offering stunning views of landmarks like the Houses of Parliament and Big Ben.",
    reviews: [
      
    ],
    avgRating: 4.5,
    photo: assets.tourImg01,
    featured: true,
  },
  {
    id: "02",
    title: "Bali, Indonesia",
    city: "Indonesia",
    distance: 400,
    price: 99,
    maxGroupSize: 8,
    desc: "Bali, Indonesia, renowned for its lush landscapes, vibrant culture, and stunning beaches, captivates visitors with its spiritual charm and natural beauty.",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.5,
      },
      {
        name: "jhon doe",
        rating: 3.5,
      },
      {
        name: "jhon doe",
        rating: 4,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg02,
    featured: true,
  },
  {
    id: "03",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Snowy Mountains, Thailand doesn't exist; however, Thailand boasts stunning tropical landscapes and cultural richness, with no snowy peaks in its terrain.",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg03,
    featured: true,
  },
  {
    id: "04",
    title: "Beautiful Sunrise, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Beautiful Sunrise, Thailand paints a serene picture of Thailand's tranquil beaches or scenic landscapes, where the first light of day casts a mesmerizing glow over the horizon, creating moments of serene beauty and tranquility",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg04,
    featured: true,
  },
  {
    id: "05",
    title: "Nusa Pendia Bali, Indonesia",
    city: "Indonesia",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Nusa Penida, Bali, Indonesia, offers breathtaking cliffs, pristine beaches, and vibrant marine life, making it a paradise for adventurers and nature lovers alike.this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg05,
    featured: false,
  },
  {
    id: "06",
    title: "Cherry Blossoms Spring",
    city: "Japan",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Cherry Blossoms in Spring symbolize renewal and beauty, adorning landscapes with their delicate pink and white blooms, enchanting visitors with their ephemeral splendor.",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg06,
    featured: false,
  },
  {
    id: "07",
    title: "Holmen Lofoten",
    city: "France",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Holmen Lofoten, located in Norway's stunning Lofoten archipelago, is a picturesque haven boasting dramatic landscapes, charming fishing villages, and the mesmerizing Northern Lights, making it a dream destination for nature enthusiasts and photographers alike.this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg07,
    featured: false,
  },
  {
    id: "08",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    price: 99,
    maxGroupSize: 8,
    desc: "Beautiful Snowy Mountains evokes images of majestic peaks blanketed in pristine snow, offering breathtaking vistas and exhilarating adventures for outdoor enthusiasts seeking the tranquil",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: assets.tourImg03,
    featured: false,
  },
];

export default tours;
