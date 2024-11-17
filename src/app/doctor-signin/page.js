'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function DoctorSignIn() {
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({ smooth: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    const handlePatientSignIn = () => {
        router.push('/patient-signin');
    };

    const handleDoctorSignIn = () => {
        router.push('/doctor-signin');
    };

    const handleHome = () => {
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <button onClick={handleHome} className={styles.roundButton}>🏠</button>
                <button onClick={handlePatientSignIn} className={styles.roundButton}>👨‍💼</button>
                <button onClick={handleDoctorSignIn} className={styles.roundButton}>👨‍⚕️</button>
            </div>
            <h1 className={styles.title}>Doctor Sign In</h1>
            <label className={styles.label}>Enter your Provider Number:</label>
            <input
                type="text"
                placeholder="Enter Physician ID"
                className={styles.input}
            />
            <button className={styles.confirmButton}>Confirm</button>
        </div>
    );
}