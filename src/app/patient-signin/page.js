// enabling the client-side environment for the component
'use client';

// import necessary libraries and styles
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

// defining the patient sign-in component
export default function PatientSignIn() {
    const router = useRouter(); // accessing navigation functions

    // initializing smooth scroll effect using Lenis
    useEffect(() => {
        const lenis = new Lenis({ smooth: true }); // enabling smooth scrolling
        function raf(time) {
            lenis.raf(time); // calls Lenis render function with current time
            requestAnimationFrame(raf); // loops the animation frame for smoothness
        }
        requestAnimationFrame(raf); // starts the animation frame loop
    }, []);

    // function to navigate to patientOne-dashboard on confirm click
    const handlePatientSignIn = () => {
        router.push('/patientOne-dashboard'); // navigate to patientOne-dashboard page
    };

    // function to navigate to doctor sign-in page
    const handleDoctorSignIn = () => {
        router.push('/doctor-signin'); // navigate to doctor sign-in page
    };

    // function to navigate back to home page
    const handleHome = () => {
        router.push('/'); // navigate to the homepage
    };

    // rendering the sign-in page
    return (
        <div className={styles.container}>
            {/* navigation buttons */}
            <div className={styles.buttonContainer}>
                <button onClick={handleHome} className={styles.roundButton}>🏠</button>
                <button onClick={handlePatientSignIn} className={styles.roundButton}>👨‍💼</button>
                <button onClick={handleDoctorSignIn} className={styles.roundButton}>👨‍⚕️</button>
            </div>
            
            {/* page title */}
            <h1 className={styles.title}>Patient Sign In</h1>
            
            {/* form label */}
            <label className={styles.label}>Enter your HealthCare Number:</label>
            
            {/* text input field */}
            <input
                type="text"
                placeholder="Enter Patient ID" // placeholder text
                className={styles.input} // style applied from page.module.scss
            />
            
            {/* confirmation button */}
            <button onClick={handlePatientSignIn} className={styles.confirmButton}>Confirm</button>
        </div>
    );
}
