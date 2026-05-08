// src/Data/project.js
import LeonImage from "../assets/images/me.png";
import RobloxImage from "../assets/images/roblox.png";
import SeminarImage from "../assets/images/seminar.png";
export const personalInfo = {
  name: "Affa Van Leon",
  tagline: "Web & UI Developer",
  bio: "Web & UI Developer with experience creating modern websites, Roblox maps, and application projects. Passionate about crafting clean interfaces, interactive experiences, and visually engaging digital products.",
  email: "Leonbusiness205@gmail.com",
  github: "https://github.com/affaririzkyf",
  linkedin: "https://www.linkedin.com/in/affari-rizky-f-1b3555284/",
  cv: "/cv-kamu.pdf", // taruh di folder public/
  photo: LeonImage, 
};

export const skills = [ 
  { name: "React", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "HTML & CSS", category: "Frontend" },
  { name: "Kotlin", category: "Frontend" },
  { name: "XML", category: "Frontend" },
  { name: "Luau", category: "Frontend"}, 
  { name: "Laravel", category: "Frontend"},
  { name: "Git & GitHub", category: "Tools" },
  { name: "Android Studio", category: "Tools" },
  { name: "Netbeans", category: "Tools" },
  { name: "Figma", category: "Design" },
  { name: "Alightmotion", category: "Design" },
  { name: "Canva", category: "Design" },
  // tambah sesuai skill kamu
];

export const projects = [
  {
    id: 1,
    title: "Map Roblox",
    description: "Project ini saya buat untuk mendampatkan agar anda membeli barang di roblox dan mendapatkan cashback robux sekitar 20%.",
    tags: ["Luau"],
    image: RobloxImage  ,
    github: "https://github.com/...",
    demo: "https://www.roblox.com/games/103008305820216/Method-20-Cashback-Robux",
  },
  {
    id: 2,
    title: "Aplikasi Seminar",
    description: "Sebuah Aplikasi untuk mendaftar seminar. dengan fitur login,register,submit seminar",
    tags: ["XML", "Kotlin"],
    image: SeminarImage,
    github: "https://github.com/affaririzkyf/UTS_Mobile1.git",
    demo: null,
  },
];
