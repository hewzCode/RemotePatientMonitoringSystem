'use client';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function PatientOneDashboard() {
    const [report, setReport] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const lenis = new Lenis({ smooth: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Fetch data from API (using JSON data as a demo here)
        fetch('/api/patientOne/report') // Replace with actual API endpoint
            .then((response) => response.json())
            .then((data) => setReport(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Recommendation content as a demo
    const recommendation = `
        Hello Patient, I hope you're having a good day and feeling a little better.
        To help manage your depression, I recommend you prioritize engaging in activities that bring you joy, 
        even if it's just for a short time each day. This could involve listening to your favorite music, 
        spending time in nature, or pursuing a hobby you used to enjoy.
        
        Secondly, Patient, it would be beneficial to maintain regular contact with your support network, 
        including friends and family, or consider joining a support group for individuals experiencing depression.
        Talking to others who understand can provide valuable emotional support and reduce feelings of isolation.
    `;

    // JSON data demo
    const patientData = {
        patient: { name: "Binoy", age: 26 },
        diagnosis: "Depression",
        medication: "Sertraline, 50mg daily",
        emotionData: { neutral: 72, fear: 13, happy: 9, sad: 4 },
        analysis: "Binoy exhibits a predominantly neutral emotional state one week post-discharge, suggesting potential medication effectiveness; however, elevated fear alongside minimal sadness warrants continued monitoring for anxiety and potential adjustment of treatment.",
        conciseDiagnosis: "Stable, but requires monitoring for anxiety."
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <button onClick={() => router.push('/')} className={styles.returnButton}>
                    🔙 Return Back
                </button>
            </div>

            <h1 className={styles.title}>Patient 1 Report</h1>

            {/* Recommendation Bubble */}
            <div className={styles.recommendationBubble}>
                <p>{recommendation}</p>
            </div>

            {/* Patient Data Table */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Patient Name</td>
                        <td>{patientData.patient.name}</td>
                    </tr>
                    <tr>
                        <td>Age</td>
                        <td>{patientData.patient.age}</td>
                    </tr>
                    <tr>
                        <td>Diagnosis</td>
                        <td>{patientData.diagnosis}</td>
                    </tr>
                    <tr>
                        <td>Medication</td>
                        <td>{patientData.medication}</td>
                    </tr>
                    <tr>
                        <td>Emotion Data</td>
                        <td>
                            Neutral: {patientData.emotionData.neutral}%, Fear: {patientData.emotionData.fear}%,
                            Happy: {patientData.emotionData.happy}%, Sad: {patientData.emotionData.sad}%
                        </td>
                    </tr>
                    <tr>
                        <td>Analysis</td>
                        <td>{patientData.analysis}</td>
                    </tr>
                    <tr>
                        <td>Concise Diagnosis</td>
                        <td>{patientData.conciseDiagnosis}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
