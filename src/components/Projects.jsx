import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Projects.css';

const projectsData = [
    {
        title: "Case Companion",
        description: "AI-powered legal assistant that helps users navigate legal complexities with intelligent recommendations and case analysis.",
        tech: ["Django", "HTML/CSS/JS", "Gemini API"],
        gradient: "linear-gradient(135deg, #CD8B76 0%, #F4B4A4 100%)",
        icon: "⚖️",
        githubLink: "https://github.com/Laksh-Devloper/Case-Companion"
    },
    {
        title: "Curo",
        description: "Health-focused AI assistant with advanced disease prediction capabilities, providing personalized health insights and recommendations.",
        tech: ["Machine Learning", "Django", "Gemini API"],
        gradient: "linear-gradient(135deg, #8D5B4C 0%, #CD8B76 100%)",
        icon: "🏥",
        githubLink: "https://github.com/Laksh-Devloper/Curaid"
    },
    {
        title: "Disease Prediction System",
        description: "High-accuracy ML model predicting Diabetes, Heart Disease & Parkinson's with 90%+ accuracy using advanced algorithms.",
        tech: ["Scikit-learn", "Pandas", "NumPy"],
        gradient: "linear-gradient(135deg, #6B4423 0%, #8D5B4C 100%)",
        icon: "🧬",
        githubLink: "https://github.com/Laksh-Devloper/Disease-Prediction-System-"
    },
    {
        title: "Cute 3D Room Portfolio",
        description: "Cute 3D Room Portfolio built using Three.js + Vite ,It’s an interactive, playful, room portfolio inspired by modern 3D web experiences and customized with my own assets, models, and tweaks",
        tech: ["Three.js", "Vite", "HTML/CSS/JS", "Blender"],
        gradient: "linear-gradient(135deg, #F4B4A4 0%, #CD8B76 100%)",
        icon: "🚀",
        githubLink: "https://github.com/Laksh-Devloper/Cute-3d-Room-Portfolio-using-Three.JS"
    },
    {
        title: "FOUNDRY-AI",
        description: "AI-powered startup toolkit that generates creative names, professional logos, and complete website designs for new ventures.",
        tech: ["Gemini API", "FLUX", "Streamlit", "Netlify"],
        gradient: "linear-gradient(135deg, #F4B4A4 0%, #CD8B76 100%)",
        icon: "🚀",
        githubLink: "https://github.com/Laksh-Devloper/Ai-Startup-Name-Logo-Website-Generator-"
    },
    {
        title: "Interview-Prep AI",
        description: "Analyse your resume with one on one session with the ai , Job description tailored rinterview also available",
        tech: ["Gemini API", "Django", "HTML/CSS/JS"],
        gradient: "linear-gradient(135deg, #F4B4A4 0%, #CD8B76 100%)",
        icon: "🚀",
        githubLink: "https://github.com/Laksh-Devloper/Interview-Preparation-AI-"
    },
    {
        title: "Discord Entertainment Bot - Chintu",
        description: "Ultimate Discord bot designed to bring joy, laughter, and entertainment to your server! This open-source project is dedicated to providing a seamless and delightful experience for your community through a variety of entertainment features and a rich collection of memes.**_",
        tech: ["Python", "discord.py", "PIllow", "APIs"],
        gradient: "linear-gradient(135deg, #F4B4A4 0%, #CD8B76 100%)",
        icon: "🚀",
        githubLink: "https://github.com/Laksh-Devloper/Chintu---Discord-Entertainment-and-Memes-Bot-Chatbot-made-with-discord.py--"
    },
    {
        title: "InsightFlow---Data-to-Actionable-Insights",
        description: "Transform Data into Wisdom - InsightFlow is a full-stack intelligent data analysis platform that converts raw datasets into actionable insights through automated cleaning, interactive visualizations, and AI-powered analysis.",
        tech: ["Python", "React", "Flask", "Plotly", "Pandas", "Numpy", "Matplotlib", "scikit-learn"],
        gradient: "linear-gradient(135deg, #F4B4A4 0%, #CD8B76 100%)",
        icon: "🚀",
        githubLink: "https://github.com/Laksh-Devloper/InsightFlow---Data-to-Actionable-Insights"
    }

];



export default function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const projectVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <section className="projects" id="projects" ref={ref}>
            <div className="container">
                <motion.div
                    className="projects-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="section-header" variants={projectVariants}>
                        <span className="section-tag">What I've Built</span>
                        <h2>Featured Projects</h2>
                        <p className="section-subtitle">
                            Real-world solutions powered by AI and modern technology
                        </p>
                    </motion.div>

                    <div className="projects-grid">
                        {projectsData.map((project, index) => (
                            <motion.div
                                key={project.title}
                                className="project-card glass-card"
                                variants={projectVariants}
                                whileHover={{ y: -15 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="project-icon" style={{ background: project.gradient }}>
                                    {project.icon}
                                </div>

                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.description}</p>

                                <div className="project-tech">
                                    {project.tech.map((tech) => (
                                        <span key={tech} className="tech-badge">{tech}</span>
                                    ))}
                                </div>

                                <a
                                    href={project.githubLink}
                                    className="project-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View on GitHub <span className="arrow">→</span>
                                </a>

                                <div className="project-overlay" style={{ background: project.gradient }}></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
