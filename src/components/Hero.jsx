import { motion } from 'framer-motion';
import { useState } from 'react';
import './Hero.css';

export default function Hero() {
    const [hoveredMenu, setHoveredMenu] = useState('CAMPAIGN');

    const menus = [
        { id: 'CAMPAIGN', label: 'CAMPAIGN', dest: '#projects' },
        { id: 'LORE', label: 'OPERATOR LORE', dest: '#about' },
        { id: 'WEAPONRY', label: 'WEAPONRY_SYS', dest: '#skills' }
    ];

    return (
        <section className="hero-tactical" id="home">
            <div className="container">
                <div className="hq-layout">
                    
                    {/* Left: Player ID Card */}
                    <motion.div 
                        className="player-card tactical-box"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="p-header">
                            <span className="mono-text clan-tag">[DEV]</span>
                            <h2>LAKSH</h2>
                        </div>
                        <div className="p-stats mono-text">
                            <p>RANK: ELITE_ARCHITECT</p>
                            <p>LEVEL: MAXIMUM_PRESTIGE</p>
                            <p>K/D_RATIO: BUG_FREE</p>
                        </div>
                        <div className="p-footer">
                            <span className="mono-text status-secure">STATUS: SECURE_LINK</span>
                        </div>
                    </motion.div>

                    {/* Center: Main Options */}
                    <div className="menu-stack">
                        {menus.map((m, idx) => (
                            <motion.a 
                                key={m.id}
                                href={m.dest}
                                className={`tactical-link ${hoveredMenu === m.id ? 'active' : ''}`}
                                onMouseEnter={() => setHoveredMenu(m.id)}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                            >
                                <span className="mono-text m-idx">0{idx+1}</span>
                                <h2>{m.label}</h2>
                            </motion.a>
                        ))}
                    </div>

                </div>
            </div>

            {/* Bottom Right Quick Deploy */}
            <motion.div 
                className="deploy-action"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <a href="#contact" className="btn-chamfer">
                    QUICK DEPLOY
                </a>
            </motion.div>

            {/* Tactical Screen Junk */}
            <div className="screen-markers mono-text hidden-mobile">
                <div className="marker top-left">REC ●</div>
                <div className="marker top-right">LAT: 32.2 N / LON: 14.5 W</div>
                <div className="marker bottom-left">SYS_TEMP: OPTIMAL</div>
            </div>
        </section>
    );
}
