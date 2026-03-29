import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Projects.css';

const operations = [
    {
        code: "OP_ZERO_ANALYST",
        desc: "Agentic AI Data Analyst terminal. Engages in natural language interrogation of tabular data grids.",
        tech: "PYTHON | REACT | FASTAPI",
        link: "https://github.com/Laksh-Devloper/ZeroAnalyst---Agentic-AI-Data-Analyst",
        status: "COMPLETED"
    },
    {
        code: "OP_CURO_MEDICAL",
        desc: "Health-focused diagnostic AI assistant with advanced biological prediction parameters.",
        tech: "MACHINE_LEARNING | DJANGO",
        link: "https://github.com/Laksh-Devloper/Curaid",
        status: "ACTIVE"
    },
    {
        code: "OP_HOLO_ROOM_3D",
        desc: "Interactive 3D simulation built using Three.js logic gates and custom 3D model assets.",
        tech: "THREE.JS | VITE",
        link: "https://github.com/Laksh-Devloper/Cute-3d-Room-Portfolio-using-Three.JS",
        status: "COMPLETED"
    },
    {
        code: "OP_INSIGHT_FLOW",
        desc: "Intelligent data analysis matrix that converts raw datasets into actionable command insights.",
        tech: "REACT | FLASK | SCIKIT",
        link: "https://github.com/Laksh-Devloper/InsightFlow---Data-to-Actionable-Insights",
        status: "CLASSIFIED"
    }
];

export default function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="projects" id="projects" ref={ref}>
            <div className="container">
                <div className="campaign-layout">
                    
                    <div className="sect-header">
                        <span className="mono-text header-id">OP_LOGS</span>
                        <h2>CAMPAIGN // MISSIONS</h2>
                    </div>

                    <div className="mission-grid">
                        {operations.map((op, idx) => (
                            <motion.a 
                                key={op.code}
                                href={op.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mission-card tactical-box"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.1) }}
                            >
                                <div className="mc-header mono-text">
                                    <span className="op-title">{op.code}</span>
                                    <span className={`op-status ${op.status.toLowerCase()}`}>{op.status}</span>
                                </div>
                                <div className="mc-body">
                                    <p>{op.desc}</p>
                                </div>
                                <div className="mc-footer mono-text">
                                    <div className="mc-tech">{op.tech}</div>
                                    <div className="deploy-btn">[ DEPLOY ]</div>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
