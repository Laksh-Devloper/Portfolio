import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Skills.css';

const loadoutData = [
    {
        tier: "PRIMARY_WEAPONS :: [PROGRAMMING]",
        skills: ["PYTHON", "JAVASCRIPT", "SQL"]
    },
    {
        tier: "LETHAL_EQUIPMENT :: [GENERATIVE_AI]",
        skills: ["AGENTIC AI", "RAG", "LANGCHAIN", "LANGGRAPH", "MCP", "PROMPT ENGINEERING", "FINE-TUNING"]
    },
    {
        tier: "TACTICAL_GEAR :: [MACHINE_LEARNING]",
        skills: ["SUPERVISED LEARNING", "FEATURE ENGINEERING", "MODEL EVAL", "NEURAL ENG"]
    },
    {
        tier: "ATTACHMENTS :: [FRAMEWORKS]",
        skills: ["DJANGO", "FASTAPI", "REACT"]
    },
    {
        tier: "AMMUNITION :: [LIBRARIES]",
        skills: ["PANDAS", "NUMPY", "MATPLOTLIB", "SCIKIT-LEARN", "YOLO"]
    },
    {
        tier: "FIELD_UPGRADES :: [CLOUD_AND_DATA]",
        skills: ["AWS (S3, EC2)", "SNOWFLAKE", "DATABASE DESIGN & QUERYING"]
    },
    {
        tier: "PERKS :: [SUPPORT_TOOLS]",
        skills: ["GIT", "GITHUB", "JUPYTER NOTEBOOK", "POSTMAN"]
    }
];

export default function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="skills" id="skills" ref={ref}>
            <div className="container">
                <div className="loadout-layout">
                    
                    <div className="sect-header">
                        <span className="mono-text header-id">OP_GEAR</span>
                        <h2>LOADOUT // WEAPONRY_SYS</h2>
                    </div>

                    <div className="loadout-grid">
                        {loadoutData.map((group, idx) => (
                            <motion.div 
                                key={group.tier}
                                className="tactical-box loadout-slot"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.4, delay: 0.1 * idx }}
                            >
                                <div className="slot-title mono-text">
                                    {group.tier}
                                </div>
                                <ul className="attachment-list">
                                    {group.skills.map((skill, slotIdx) => (
                                        <li key={skill}>
                                            <span className="mono-text bullet">0{slotIdx+1}</span>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
