'use client';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function PatientTwoDashboard() {
    const [report, setReport] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({ smooth: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Fetch data from API
        fetch('/api/patientTwo/report') // Replace with actual API endpoint
            .then((response) => response.json())
            .then((data) => setReport(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <button onClick={() => router.push('/doctor-dashboard')} className={styles.returnButton}>🔙 Return Back</button>
            </div>
            <h1 className={styles.title}>Patient 2 Report</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Normal Range</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map((item, index) => (
                        <tr key={index}>
                            <td>{item.test}</td>
                            <td>{item.result}</td>
                            <td>{item.normalRange}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
