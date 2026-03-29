import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Education.css';

const academies = [
    {
        tier: "ADVANCED_SIMULATION",
        institute: "Acropolis Institute of Tech & Research (RGPV)",
        location: "Indore, India",
        degree: "B.Tech // Computer Science",
        duration: "2023 - 2026",
        special: "VIDEO_EDITING_CERTIFIED",
        commands: [
            { title: "Technical Head", squad: "Spectra", time: "SEP 2023 - PRESENT", status: "ACTIVE" },
            { title: "Member", squad: "Computer Society of India AITR", time: "JAN 2024 - PRESENT", status: "ACTIVE" },
            { title: "Member", squad: "Innovation Council", time: "MAR 2024 - JUN 2025", status: "PENDING" },
            { title: "Member", squad: "Entrepreneurship Dev Cell", time: "FEB 2024 - DEC 2024", status: "COMPLETED" }
        ]
    },
    {
        tier: "BOOTCAMP_PROTOCOLS",
        institute: "Shri Vaishnav Polytechnic College",
        location: "Indore, India",
        degree: "Diploma // Computer Science & Eng.",
        duration: "2020 - 2023",
        special: null,
        commands: []
    }
];

export default function Education() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="education" id="education" ref={ref}>
            <div className="container">
                <div className="academy-layout">
                    
                    <div className="sect-header">
                        <span className="mono-text header-id">ACADEMY</span>
                        <h2>TRAINING // HQ</h2>
                    </div>

                    <div className="academy-grid">
                        {academies.map((base, idx) => (
                            <motion.div 
                                key={base.institute}
                                className="tactical-box base-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 * idx }}
                            >
                                <div className="base-header border-b border-outline pb-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="mono-text text-accent">{base.tier}</span>
                                        <span className="mono-text px-2 bg-white/5">[{base.duration}]</span>
                                    </div>
                                    <h3 className="text-3xl font-display uppercase tracking-wider text-primary mb-1">{base.degree}</h3>
                                    <p className="text-secondary mono-text">FACILITY: {base.institute} // {base.location}</p>
                                    
                                    {base.special && (
                                        <div className="mt-3 inline-block px-3 py-1 border border-accent text-accent mono-text text-xs tracking-widest">
                                            + QUALIFICATION: {base.special}
                                        </div>
                                    )}
                                </div>

                                {base.commands.length > 0 && (
                                    <div className="squad-assignments">
                                        <div className="mono-text text-secondary mb-3 mt-4 text-sm tracking-widest border-b border-outline/50 pb-2">
                                            &gt; TACTICAL_ASSIGNMENTS
                                        </div>
                                        <div className="squad-grid">
                                            {base.commands.map((cmd, cIdx) => (
                                                <div key={cIdx} className="squad-item bg-black/40 p-3 border-l-2 border-accent transition-all hover:bg-black/80 hover:pl-4">
                                                    <div className="flex justify-between align-top">
                                                        <h4 className="font-display text-xl text-primary">{cmd.title}</h4>
                                                        <span className={`text-[10px] mono-text px-1 ${
                                                            cmd.status === 'ACTIVE' ? 'bg-accent/20 text-accent' : 
                                                            cmd.status === 'COMPLETED' ? 'bg-green-900/40 text-green-400' : 'bg-white/10 text-secondary'
                                                        }`}>
                                                            {cmd.status}
                                                        </span>
                                                    </div>
                                                    <div className="mono-text text-xs text-secondary mt-1 tracking-wider uppercase">
                                                        SQUAD: {cmd.squad}
                                                    </div>
                                                    <div className="mono-text text-[10px] text-white/30 mt-2 tracking-widest">
                                                        T: {cmd.time}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
