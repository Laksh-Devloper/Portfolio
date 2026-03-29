import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './About.css';

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="about" id="about" ref={ref}>
            <div className="container">
                <div className="dossier-layout">
                    
                    {/* Header Header */}
                    <div className="sect-header">
                        <span className="mono-text header-id">OP_LORE</span>
                        <h2>BARRACKS // DOSSIER</h2>
                    </div>

                    {/* Content Tactical Grid */}
                    <div className="dossier-grid">
                        <motion.div 
                            className="tactical-box text-log"
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="mono-text alert">[CLASSIFIED_RECORD]</span>
                            <p className="lead-intel mt-4">
                                OPERATIVE IS A HIGHLY TRAINED AI SPECIALIST AND FULL-STACK ARCHITECT DEPLOYED IN ENGINEERING COMPLEX SYSTEMS.
                            </p>
                            <p className="mt-4">
                                Known for executing robust machine learning operations and building scalable rapid-response front-end frameworks. The operative has completed intensive training in the B.Tech core logic sectors and continues to deploy mission-critical software solutions globally.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="tactical-box intel-stats"
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="stat-row">
                                <span className="mono-text label">CALLSIGN:</span>
                                <span className="stat-value">LAKSHYA_B</span>
                            </div>
                            <div className="stat-row">
                                <span className="mono-text label">SPECIALTY:</span>
                                <span className="stat-value highlight">AI & NEURAL NETS</span>
                            </div>
                            <div className="stat-row">
                                <span className="mono-text label">BASE_REQ:</span>
                                <span className="stat-value">EARTH_HQ_INDIA</span>
                            </div>
                            <div className="stat-row">
                                <span className="mono-text label">CLEARANCE:</span>
                                <span className="stat-value danger">LEVEL_5_ADMIN</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
