import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Contact.css';

const socialLinks = [
    {
        name: "GitHub",
        username: "Laksh-Devloper",
        url: "https://github.com/Laksh-Devloper",
        icon: "💻",
        color: "#CD8B76"
    },
    {
        name: "LinkedIn",
        username: "Lakshya Bhawsar",
        url: "https://www.linkedin.com/in/lakshya-bhawsar",
        icon: "💼",
        color: "#F4B4A4"
    },
    {
        name: "Instagram",
        username: "@lakshh._.22",
        url: "https://www.instagram.com/lakshh._.22/",
        icon: "📸",
        color: "#8D5B4C"
    },
    {
        name: "Resume",
        username: "View PDF",
        url: "https://drive.google.com/file/d/15bRaYuTP2TL2QyVFSgN4aW6Iv_h_N3Wr/view?usp=sharing",
        icon: "📄",
        color: "#F5E6D3",
        download: false
    }
];

export default function Contact() {
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

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <section className="contact" id="contact" ref={ref}>
            <div className="container">
                <motion.div
                    className="contact-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div className="section-header" variants={itemVariants}>
                        <span className="section-tag">Let's Connect</span>
                        <h2>Get In Touch</h2>
                        <p className="section-subtitle">
                            Let's build something that matters.
                        </p>
                    </motion.div>

                    <div className="social-grid">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                className="social-card glass-card"
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={social.download}
                            >
                                <div className="social-icon" style={{ color: social.color }}>
                                    {social.icon}
                                </div>
                                <h3 className="social-name">{social.name}</h3>
                                <p className="social-username">{social.username}</p>
                                <div className="social-arrow">→</div>
                            </motion.a>
                        ))}
                    </div>

                    <motion.div className="cta-section" variants={itemVariants}>
                        <h3>Ready to collaborate?</h3>
                        <div className="cta-buttons">
                            <a href="mailto:lakshybhawsar1722@gmail.com" className="btn btn-primary">
                                Contact Me
                            </a>
                            <a href="https://drive.google.com/file/d/15bRaYuTP2TL2QyVFSgN4aW6Iv_h_N3Wr/view?usp=sharing" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                View Resume
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
