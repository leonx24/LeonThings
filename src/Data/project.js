// src/Data/project.js
import LeonImage from "../assets/images/me.png";
import RobloxImage from "../assets/images/roblox.png";
import TabImage from "../assets/images/customtab.png";
import BotImage from "../assets/images/leonbot.png";
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
  { name: "Python", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Kotlin", category: "Frontend" },
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

  title: "Roblox Cashback Map",

  description:
    "A Roblox game project designed to provide users with cashback rewards in Robux after purchasing selected in-game items. Built using Luau scripting with custom gameplay systems.",

  tags: ["Luau", "Roblox Studio"],

  image: RobloxImage,

  github: null,

  demo: "https://www.roblox.com/games/103008305820216/Method-20-Cashback-Robux",
},

{
  id: 2,

  title: "Custom Browser Tab",

  description:
    "A futuristic custom browser start page built with React and Tailwind CSS featuring modern UI design, productivity widgets, and aesthetic dashboard components.",

  tags: [
    "React",
    "Tailwind CSS",
    "Vite",
    "JavaScript",
  ],

  image: TabImage,

  github: "https://github.com/affaririzkyf/custom-tab.git",

  demo: "https://custom-tab-ten.vercel.app",
},
{
  id: 3,
  title: "LeonBot Discord",
  description:
    "Futuristic multipurpose Discord bot with economy system, leveling XP, moderation tools, welcome system, reaction roles, and interactive minigames built using discord.py.",

  tags: [
    "Python",
    "discord.py",
    "MongoDB",
    "Railway",
    "Discord API",
  ],

  image: BotImage,

  github: "https://github.com/affaririzkyf/discord-bot",

  demo: "https://leonbot-web.vercel.app",
}
];
