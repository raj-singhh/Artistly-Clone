// src/lib/data.js

let uniqueIdCounter = 0;
const generateUniqueId = () => `id-${uniqueIdCounter++}`;

export const dummyArtists = [
  {
    id: generateUniqueId(),
    name: "Melody Strings",
    category: "Singers",
    priceRange: "$1000 - $2000",
    location: "Mumbai",
    bio: "A soulful singer known for mesmerizing audiences with acoustic performances and captivating stage presence. Specializes in pop, classical, and fusion genres.",
    imageUrl: "https://placehold.co/400x300/F0F8FF/000?text=Melody+Strings"
  },
  {
    id: generateUniqueId(),
    name: "Rhythm Squad",
    category: "Dancers",
    priceRange: "$2000 - $3000",
    location: "Delhi",
    bio: "An energetic dance group specializing in contemporary and Bollywood styles, bringing dynamic performances to any event. Their synchronized moves and vibrant costumes leave audiences in awe.",
    imageUrl: "https://placehold.co/400x300/F5FFFA/000?text=Rhythm+Squad"
  },
  {
    id: generateUniqueId(),
    name: "Eloquent Orators",
    category: "Speakers",
    priceRange: "$500 - $1500",
    location: "Bangalore",
    bio: "Motivational speakers and corporate trainers who deliver impactful sessions designed to inspire and educate. They cover topics from leadership to personal development.",
    imageUrl: "https://placehold.co/400x300/F0FFF0/000?text=Eloquent+Orators"
  },
  {
    id: generateUniqueId(),
    name: "Beat Blasters",
    category: "DJs",
    priceRange: "$1500 - $2500",
    location: "Chennai",
    bio: "Dynamic DJs spinning tracks for all kinds of events, from high-energy parties to grand festivals. Their versatile music selection ensures a memorable experience for everyone.",
    imageUrl: "https://placehold.co/400x300/FFF0F5/000?text=Beat+Blasters"
  },
  {
    id: generateUniqueId(),
    name: "Classical Harmony",
    category: "Singers",
    priceRange: "$500 - $1500",
    location: "Kolkata",
    bio: "A classical Indian vocalist with a captivating voice, performing traditional ragas and devotional music. Her performances evoke deep emotion and tranquility.",
    imageUrl: "https://placehold.co/400x300/FFFACD/000?text=Classical+Harmony"
  },
  {
    id: generateUniqueId(),
    name: "Fusion Steps",
    category: "Dancers",
    priceRange: "$1000 - $2000",
    location: "Hyderabad",
    bio: "A solo dancer showcasing a unique blend of traditional and modern dance forms. Their innovative choreography and expressive movements create stunning visual narratives.",
    imageUrl: "https://placehold.co/400x300/E6E6FA/000?text=Fusion+Steps"
  }
];
