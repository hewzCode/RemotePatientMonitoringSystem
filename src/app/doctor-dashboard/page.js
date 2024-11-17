'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function DoctorDashboard() {
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({ smooth: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    const navigatePatientOne = () => {
        router.push('/patientOne-dashboard');
    };

    const navigatePatientTwo = () => {
        router.push('/patientTwo-dashboard');
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <button onClick={() => router.push('/')} className={styles.roundButton}>🏠</button>
            </div>
            <h1 className={styles.title}>Welcome, Doctor</h1>
            <p className={styles.subtitle}>Select a patient below:</p>
            <div className={styles.buttonContainer}>
                <button onClick={navigatePatientOne} className={styles.patientButton}>Patient 1</button>
                <button onClick={navigatePatientTwo} className={styles.patientButton}>Patient 2</button>
            </div>
        </div>
    );
}
