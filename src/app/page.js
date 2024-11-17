'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useMousePosition from './utils/useMousePosition';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';


export default function Home() {
    const [isHovered, setIsHovered] = useState(false);
    const [disableAnimation, setDisableAnimation] = useState(false);
    const { x, y } = useMousePosition();
    const size = isHovered ? 300 : 75;
    const router = useRouter();
    const containerRef = useRef();
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    });

    const handlePatientSignIn = () => {
        router.push('/patient-signin');
    };

    const handleDoctorSignIn = () => {
        router.push('/doctor-signin');
    };

    useEffect(() => {
        const lenis = new Lenis({ smooth: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    return (
        <main className={styles.main}>
            {/* Existing Section */}
            <section className={styles.body}>
                <motion.div 
                    className={styles.mask}
                    animate={{
                        WebkitMaskPosition: disableAnimation ? 'center center' : `${x - (size / 2)}px ${y - (size / 2)}px`,
                        WebkitMaskSize: `${size}px`,
                    }}
                    transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
                >
                    <p onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        Remote Patient Monitoring 
                    </p>
                </motion.div>
                <p style={{}}><span >LightHouse AI</span></p>
            </section>

            {/* Scrolling Text Section */}
            <section ref={containerRef} className={styles.scrollSection}>
                <div className='h-[100vh]' />
                <div>
                    <Slide direction={'left'} left={"-40%"} progress={scrollYProgress} />
                    <Slide direction={'right'} left={"-25%"} progress={scrollYProgress} />
                    <Slide direction={'left'} left={"-75%"} progress={scrollYProgress} />
                </div>
                <div className='h-[100vh]' />
            </section>

            {/* Button Section */}
            <section className={styles.buttonPage}>
                <button className={styles.button} onClick={handlePatientSignIn}>Patient Sign In</button>
                <button className={styles.button} onClick={handleDoctorSignIn}>Doctor Sign In</button>
            </section>

            
        </main>
    );
}

const Slide = ({ direction, left, progress }) => {
    const translateX = useTransform(progress, [0, 1], [150 * (direction === 'left' ? -1 : 1), -200  * (direction === 'left' ? -1 : 1)]);
    return (
        <motion.div style={{ x: translateX, left }} className=" relative flex whitespace-nowrap">
            <Phrase />
            <Phrase />
            <Phrase />
        </motion.div>
    );
};

const Phrase = () => (
    <div className="">
        <p style={{ color: '#000000', opacity: '50%', fontStyle: 'italic', fontWeight: 'bold' }} className="text-[7.5vw] text-white">
            &quot;Ripples of Compassion, Waves of Healing&quot;
        </p>
    </div>
);
