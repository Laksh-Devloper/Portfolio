import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Skills.css';

const skillsData = {
    "Programming": ["C", "C++", "Python", "JavaScript"],
    "Web Development": ["HTML", "CSS", "React", "Django", "Node.js", "PHP"],
    "AI & Data": ["Machine Learning", "Pandas", "NumPy", "Gemini", "OpenAI", "RAG", "LangChain"],
    "Databases & Tools": ["MySQL", "MongoDB", "SQLite", "Git", "GitHub", "Postman", "Jupyter"],
    "Creative & 3D Web": ["Three.js", "GSAP", "Blender", "Lenis", "Spline"]
};

export default function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const categoryVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    const skillVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <section className="skills" id="skills" ref={ref}>
            <div className="container">
                <motion.div
                    className="skills-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="section-header" variants={categoryVariants}>
                        <span className="section-tag">My Arsenal</span>
                        <h2>Skills & Technologies</h2>
                    </motion.div>

                    <div className="skills-grid">
                        {Object.entries(skillsData).map(([category, skills], index) => (
                            <motion.div
                                key={category}
                                className="skill-category glass-card"
                                variants={categoryVariants}
                            >
                                <h3 className="category-title">{category}</h3>
                                <div className="skills-list">
                                    {skills.map((skill, skillIndex) => (
                                        <motion.span
                                            key={skill}
                                            className="skill-tag"
                                            variants={skillVariants}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
