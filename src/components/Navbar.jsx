import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

const tabs = [
    { id: 'hq', label: 'HQ', dest: '#home' },
    { id: 'lore', label: 'BARRACKS', dest: '#about' },
    { id: 'record', label: 'SERVICE_REC', dest: '#experience' },
    { id: 'training', label: 'TRAINING', dest: '#education' },
    { id: 'loadout', label: 'WEAPONRY', dest: '#skills' },
    { id: 'missions', label: 'CAMPAIGN', dest: '#projects' },
    { id: 'comms', label: 'COMMS', dest: '#contact' },
];

export default function Navbar() {
    const [activeTab, setActiveTab] = useState('hq');
    const [currentTime, setCurrentTime] = useState('00:00:00');

    // Fake tactical clock
    useEffect(() => {
        const interval = setInterval(() => {
            const d = new Date();
            setCurrentTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="tactical-nav">
            
            <div className="nav-left mono-text">
                <span className="party-status">[ PARTY: SOLO ]</span>
                <span className="net-ping">LATENCY: 12ms</span>
            </div>

            <ul className="nav-tabs">
                {tabs.map((tab) => (
                    <li key={tab.id} className={activeTab === tab.id ? 'active' : ''}>
                        <a href={tab.dest} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="nav-right mono-text">
                <span className="clock">ZULU: {currentTime}</span>
                <span className="version">v. 2.4.1</span>
            </div>

        </nav>
    );
}
