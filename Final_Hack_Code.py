import json
import os
import google.generativeai as genai
from dotenv import load_dotenv
import cv2
from deepface import DeepFace
from collections import Counter
import pickle
import numpy as np
import requests
import json

# Load environment variables from .env file
load_dotenv()

# Retrieve Piñata API keys
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET")
PINATA_ACCESS_TOKEN = os.getenv("PINATA_ACCESS_TOKEN")


def recognize_person(video_source=0, embeddings_file="face_data.pkl", threshold=0.9, frames_to_display=80):
    with open(embeddings_file, "rb") as f:
        face_data = pickle.load(f)

    known_face_encodings = face_data["encodings"]
    known_face_names = face_data["names"]

    #print(f"Loaded embeddings for {len(known_face_names)} people.")

    video_capture = cv2.VideoCapture(video_source)

    frame_count = 0
    identified_name = None
    frames_since_identification = 0

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        if identified_name is None:
            try:
                face_embedding = DeepFace.represent(rgb_frame, model_name="Facenet", enforce_detection=False)[0]["embedding"]

                similarities = [np.dot(face_embedding, known_embedding) /
                                (np.linalg.norm(face_embedding) * np.linalg.norm(known_embedding))
                                for known_embedding in known_face_encodings]

                best_match_index = np.argmax(similarities)
                name = "Unknown"

                # Set threshold for recognition
                if similarities[best_match_index] > threshold:  
                    name = known_face_names[best_match_index]
                    identified_name = name  
            except Exception as e:
                print(f"Error detecting face: {e}")
        
        # Continue displaying the identified name in the video feed
        if identified_name is not None:
            cv2.putText(frame, f"Identified: {identified_name}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            frames_since_identification += 1

        # After identification, show the video for only 10 more frames
        if frames_since_identification >= frames_to_display:
            break

        cv2.imshow("Video", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

    return identified_name



def generate_patient_data_json(identified_name):
    # The CID of the pinned JSON data you want to retrieve
    cid = "QmRL9LPnyBp2VVqUZsyHQyUnUmfrvjGZyfi3qPoFY1s4zF"  # Replace this with the actual CID

    # Pinata Gateway URL
    url = f"https://gray-mad-chinchilla-861.mypinata.cloud/ipfs/{cid}"

    # Make a GET request to fetch the data
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON data
        person_data = response.json()

        # Determine the correct key based on the name
        if identified_name == "Binoy":
            key = "10011"
        elif identified_name == "Jessi":
            key = "10010"
        else:
            print("Name not found")
            return

        # Retrieve and print the data for the specified key if valid
        data = person_data.get(key)
        if data:
            #print(f"Data for {identified_name}:")
            #print(json.dumps(data, indent=4)) 
            return json.dumps(data, indent=4)
            
        else:
            print(f"No data found for key: {key}")
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")
        print(response.text)


def detect_emotion(face_cascade):
    cap = cv2.VideoCapture(0)

    detected_emotions = []  # List to store all detected emotions
    frame_count = 0  

    while True:
        ret, frame = cap.read()

        if not ret:
            break  # Exit if frame not captured successfully

        frame_count += 1

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            face_roi = rgb_frame[y:y + h, x:x + w]

            result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)

            emotion = result[0]['dominant_emotion']
            detected_emotions.append(emotion)

            cv2.putText(frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        cv2.imshow('Real-time Emotion Detection', frame)

        if frame_count >= 100:
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    return detected_emotions


def generate_emotion_json(emotions):
    if not emotions:
        return {}

    total_emotions = len(emotions)
    emotion_counts = Counter(emotions)  # Count occurrences of each emotion
    emotion_percentages = {
        emotion: int((count / total_emotions) * 100) for emotion, count in emotion_counts.items()
    }
    return emotion_percentages



def generate_recommendation_llm_prompt(patient_data, emotion_data):
    # Convert dictionaries to JSON strings with indentation for readability
    patient_data_json = json.dumps(patient_data, indent=4)
    emotion_data_json = json.dumps(emotion_data, indent=4)
    
    prompt = (
        "You are an AI assistant specialized in mental health analysis. You are provided with patient information and emotion data. "
        "The emotion data represents the percentage of emotions detected for the patient over a day, one week after being discharged from the hospital. However, don't use the numbers or percentage in your response."
        "Based on this information, provide specific recommendations for the patient to improve their mental health. Ensure each recommendation is clear, actionable, and between 1-3 sentences. "
        "Personalize the recommendations using the patient's name and limit the recommendations to the top 2. Start the response with a greeting and a nice message in one sentence.Don't use any text markup formatting\n\n"
        "Patient Information:\n\n" + patient_data_json + "\n\n"
        "Emotion Data:\n\n" + emotion_data_json
    )
    
    return prompt

def generate_report_llm_prompt(patient_data, emotion_data):
    # Convert dictionaries to JSON strings with indentation for readability
    patient_data_json = json.dumps(patient_data, indent=4)
    emotion_data_json = json.dumps(emotion_data, indent=4)
    
    # Combine into a single prompt
    prompt = (
        "You are an AI assistant specialized in mental health analysis. "
        "You are provided with patient information and emotion data. "
        "The emotion data represents the percentage of emotions detected for the patient over a day, "
        "one week after being discharged from the hospital. Based on this information, provide a concise diagnosis "
        "and analysis of the patient's mental health condition in JSON format. Keep analysis limited to 2 sentences\n\n"
        "Patient Information:\n\n" + patient_data_json + "\n\n"
        "Emotion Data:\n\n" + emotion_data_json
    )
    
    return prompt

def get_recommendation(model, prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during analysis: {e}"

def init_gemini_instance(temp, tp):
    try:
        load_dotenv()
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("Missing GOOGLE_API_KEY in environment variables.")
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-1.5-flash-latest',
                                    generation_config=genai.GenerationConfig(
                                    temperature=temp,
                                    top_p=tp,)
                                    )
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Gemini model: {e}")

def get_report(model, prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during report analysis: {e}"

def main():
    try:
        identified_person = recognize_person(video_source=0, embeddings_file="face_data.pkl", threshold=0.85, frames_to_display=80)

        # Load face cascade classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

        patient_data = generate_patient_data_json(identified_person)

        emotions = detect_emotion(face_cascade)  
        emotion_data = generate_emotion_json(emotions)

        report_prompt = generate_report_llm_prompt(patient_data, emotion_data)
        recommendation_prompt = generate_recommendation_llm_prompt(patient_data, emotion_data)

        recommendation_model = init_gemini_instance(1,0.95)
        report_model = init_gemini_instance(0.3,0.7)

        # Analyze Recommendations
        print("\nRecommendations:")
        recommendation_result = get_recommendation(recommendation_model, recommendation_prompt)
        print(recommendation_result)

        # Analyze Report
        print("\nReport Analysis:")
        report_result = get_report(report_model, report_prompt)
        print(report_result)
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()