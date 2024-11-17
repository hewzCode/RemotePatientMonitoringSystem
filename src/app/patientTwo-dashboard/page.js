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

        // Fetch data from API (using JSON data as a demo here)
        fetch('/api/patientTwo/report') // Replace with actual API endpoint
            .then((response) => response.json())
            .then((data) => setReport(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Recommendation content as a demo
    const recommendation = `
        Hello Jessi, I'm glad to hear you're home and recovering.
        
        To help manage your depression, I recommend you prioritize engaging in activities that bring you joy. Even small activities, such as listening to music or spending time with loved ones, can help lift your spirits and counter negative emotions.
        
        Additionally, I suggest you explore incorporating mindfulness techniques into your daily routine, like meditation or deep breathing exercises. These practices can help you become more aware of your emotions and develop coping strategies for managing difficult feelings.
    `;

    // JSON data demo
    const patientData = {
        patient: { name: "Jessi", age: 26 },
        diagnosis: "Depression",
        medication: "Sertraline, 50mg daily",
        emotion_data: { neutral: 33, sad: 7, angry: 14, surprise: 4, happy: 41, fear: 1 },
        analysis: "Jessi's emotion data shows a notable presence of happiness, suggesting potential positive response to treatment. However, persistent anger and a lack of complete emotional neutrality warrant continued monitoring and potential adjustment of treatment plan.",
        concise_diagnosis: "Post-discharge, Jessi exhibits signs of improving mood, though residual anger and emotional instability necessitate ongoing care and potential medication review."
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <button onClick={() => router.push('/doctor-dashboard')} className={styles.returnButton}>🔙 Return Back</button>
            </div>

            <h1 className={styles.title}>Patient 2 Report</h1>

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
                            Neutral: {patientData.emotion_data.neutral}%, Sad: {patientData.emotion_data.sad}%,
                            Angry: {patientData.emotion_data.angry}%, Surprise: {patientData.emotion_data.surprise}%,
                            Happy: {patientData.emotion_data.happy}%, Fear: {patientData.emotion_data.fear}%
                        </td>
                    </tr>
                    <tr>
                        <td>Analysis</td>
                        <td>{patientData.analysis}</td>
                    </tr>
                    <tr>
                        <td>Concise Diagnosis</td>
                        <td>{patientData.concise_diagnosis}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
