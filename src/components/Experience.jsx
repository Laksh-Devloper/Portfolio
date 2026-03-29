import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Experience.css';

const experiences = [
    {
        role: "GenAI, AI/ML Intern",
        company: "BluCursor Infotech Pvt Ltd",
        type: "Full Time Deployment",
        duration: "MAR_2026 - PRESENT",
        impact: "HIGH_YIELD",
        bullets: [
            "Building end-to-end AI applications and RAG architectures; integrating LLMs with LangChain and LangGraph for scalable workflows.",
            "Developing agentic AI systems for automated task execution and intelligent form handling, reducing manual effort by 40%.",
            "Implementing embedding-based retrieval pipelines to enhance contextual understanding, improving response accuracy by 32%.",
            "Optimizing and fine-tuning model inference and API integrations, reducing latency by 25% and token usage by 18%."
        ]
    },
    {
        role: "AI / ML Intern",
        company: "TechSaksham (Microsoft & SAP)",
        type: "Remote Deployment",
        duration: "FEB_2025 - APR_2025",
        impact: "OPERATIONAL",
        bullets: [
            "Developed a disease prediction ML system covering Diabetes, Heart Disease, and Parkinson's.",
            "Trained models on 1,000+ medical records achieving 90%+ prediction accuracy across the board.",
            "Improved diagnostic speed by 60% compared to traditional manual methods.",
            "Performed extensive data preprocessing, feature engineering, and model evaluation."
        ]
    }
];

export default function Experience() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="experience" id="experience" ref={ref}>
            <div className="container">
                <div className="record-layout">
                    
                    <div className="sect-header">
                        <span className="mono-text header-id">SRV_REC</span>
                        <h2>SERVICE // RECORD</h2>
                    </div>

                    <div className="timeline-grid">
                        {experiences.map((exp, idx) => (
                            <motion.div 
                                key={exp.duration}
                                className="tactical-box exp-card"
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 * idx }}
                            >
                                <div className="exp-info">
                                    <div className="exp-duration mono-text">
                                        [{exp.duration}]
                                    </div>
                                    <h3 className="exp-role">{exp.role}</h3>
                                    <div className="exp-company mono-text">
                                        <span>// {exp.company}</span>
                                        <span className="exp-impact">{exp.impact}</span>
                                    </div>
                                </div>
                                <div className="exp-details">
                                    <p className="exp-type mono-text alert-type">TACTICS: {exp.type}</p>
                                    <ul className="obj-list">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i}>
                                                <span className="bullet-point"></span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
