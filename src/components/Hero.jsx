import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <section className="hero" id="home">
            <div className="grid-bg"></div>
            <div className="container">
                <motion.div
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="hero-tag" variants={itemVariants}>
                        <span className="tag-dot"></span>
                        Available for opportunities
                    </motion.div>

                    <motion.h1 className="hero-title glow" variants={itemVariants}>
                        Lakshya Bhawsar
                    </motion.h1>

                    <motion.p className="hero-tagline" variants={itemVariants}>
                        Building intelligent systems, one idea at a time.
                    </motion.p>

                    <motion.p className="hero-description" variants={itemVariants}>
                        I'm a Computer Science student focused on AI, automation, and modern web experiences.
                        <br />
                        I build real-world solutions using AI, machine learning, and full-stack development.
                    </motion.p>

                    <motion.div className="hero-cta" variants={itemVariants}>
                        <a href="#projects" className="btn btn-primary">
                            View Projects
                        </a>
                        <a href="/resume.pdf" className="btn btn-secondary" download>
                            Download Resume
                        </a>
                    </motion.div>

                    <motion.div className="hero-scroll" variants={itemVariants}>
                        <div className="scroll-indicator">
                            <span></span>
                        </div>
                        <p>Scroll to explore</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
