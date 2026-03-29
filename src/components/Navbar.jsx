import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import battleMusic from '../assets/music.mp3';
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

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Fake tactical clock
    useEffect(() => {
        const interval = setInterval(() => {
            const d = new Date();
            setCurrentTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.volume = 0.3; // Gentle volume
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <nav className="tactical-nav">
            <audio ref={audioRef} loop preload="auto">
                <source src={battleMusic} type="audio/mpeg" />
            </audio>

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

            <div className="nav-right mono-text items-center flex gap-4">
                <button
                    onClick={toggleMusic}
                    className={`music-btn ${isPlaying ? 'active' : ''}`}
                >
                    {isPlaying ? '[-MUTE_COMM-]' : '[+INTEL_AUDIO+]'}
                </button>
                <span className="clock">ZULU: {currentTime}</span>
                <span className="version">v. 2.4.1</span>
            </div>

        </nav>
    );
}
