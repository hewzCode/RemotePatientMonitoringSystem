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

    // Directly navigate to the doctor dashboard on confirm click
    const handleSignIn = () => {
        router.push('/doctor-dashboard');
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <button onClick={() => router.push('/')} className={styles.roundButton}>🏠</button>
                <button onClick={() => router.push('/patient-signin')} className={styles.roundButton}>👨‍💼</button>
                <button onClick={() => router.push('/doctor-signin')} className={styles.roundButton}>👨‍⚕️</button>
            </div>
            <h1 className={styles.title}>Doctor Sign In</h1>
            <label className={styles.label}>Enter your Provider Number:</label>
            <input type="text" placeholder="Enter Physician ID" className={styles.input} />
            <button onClick={handleSignIn} className={styles.confirmButton}>Confirm</button>
        </div>
    );
}
