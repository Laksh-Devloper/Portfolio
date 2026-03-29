import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import './Contact.css';

const commLinks = [
    { name: "GITHUB_NETWORK", url: "https://github.com/Laksh-Devloper" },
    { name: "LINKED_COMMS", url: "https://www.linkedin.com/in/lakshya-bhawsar" },
    { name: "INSTA_RELAY", url: "https://www.instagram.com/lakshh._.22/" }
];

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="contact" id="contact" ref={ref}>
            <div className="container">
                <div className="comms-layout">
                    
                    <div className="sect-header">
                        <span className="mono-text header-id">EXT_LINKS</span>
                        <h2>COMMS // NETWORK</h2>
                    </div>

                    <div className="comms-grid">
                        
                        {/* Radio Transmission Form */}
                        <motion.div 
                            className="tactical-box radio-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <form action="mailto:lakshybhawsar1722@gmail.com" method="post" encType="text/plain">
                                <div className="form-head mono-text">
                                    &gt; SECURE_RADIO_FREQ: 140.85
                                </div>
                                <div className="input-row">
                                    <textarea placeholder="ENTER COORDINATES OR MSG..." required rows="5"></textarea>
                                </div>
                                <button type="submit" className="btn-chamfer w-full mt-4">
                                    SEND TRANSMISSION
                                </button>
                            </form>
                        </motion.div>

                        {/* Comm Relays */}
                        <motion.div 
                            className="relay-links"
                            initial={{ opacity: 0, x: 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <h3 className="mono-text sec-title">ESTABLISH UPLINK</h3>
                            <ul className="social-relays">
                                {commLinks.map((link) => (
                                    <li key={link.name}>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="tactical-box small-box">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a href="https://drive.google.com/file/d/11gXlXevNjW98kkfaxbJ0evX7kJVaBE_r/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="tactical-box small-box download-btn">
                                        [ ACCESS_DOSSIER ]
                                    </a>
                                </li>
                            </ul>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}
