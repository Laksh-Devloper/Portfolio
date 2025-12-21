import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './About.css';

export default function About() {
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

    const itemVariants = {
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

    return (
        <section className="about" id="about" ref={ref}>
            <div className="container">
                <motion.div
                    className="about-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <span className="section-tag">Get to know me</span>
                        <h2>About Me</h2>
                    </motion.div>

                    <motion.div className="about-grid" variants={itemVariants}>
                        <div className="about-text glass-card">
                            <p>
                                I'm passionate about building intelligent systems that solve real-world problems.
                                My journey in Computer Science has been driven by curiosity and a desire to create
                                meaningful impact through technology.
                            </p>
                            <p>
                                With expertise in <strong>AI, automation, and modern web development</strong>, I've built
                                AI assistants, disease prediction models, and legal AI tools. I thrive on turning
                                complex challenges into elegant, user-friendly solutions.
                            </p>
                            <p>
                                As a problem-solver at heart, I'm constantly exploring new technologies and pushing
                                the boundaries of what's possible with code.
                            </p>
                        </div>

                        <div className="education-cards">
                            <motion.div className="glass-card education-card" variants={itemVariants}>
                                <div className="card-icon">🎓</div>
                                <h3>Bachelor of Technology</h3>
                                <p className="degree">Computer Science</p>
                            </motion.div>

                            <motion.div className="glass-card education-card" variants={itemVariants}>
                                <div className="card-icon">📚</div>
                                <h3>Diploma</h3>
                                <p className="degree">Computer Science & Engineering</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
