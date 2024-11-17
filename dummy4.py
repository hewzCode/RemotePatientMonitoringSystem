import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

def generate_patient_data_json():
    data = {
        "Name": "John Doe",
        "Age": 30,
        "Diagnosis": "Depression",
        "Medication": "Sertraline, 50mg daily",
        "Symptoms": ["Sadness", "Fatigue", "Loss of interest"]
    }
    return data

def generate_emotion_json():
    emotion_data = {
        "Happy": 10,
        "Sad": 60,
        "Angry": 20,
        "Afraid": 10
    }
    return emotion_data

def generate_recommendation_llm_prompt():
    patient_data = generate_patient_data_json()
    emotion_data = generate_emotion_json()
    
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

def generate_report_llm_prompt():
    """
    Generates a prompt for the AI assistant to provide a concise diagnosis and analysis of the patient's mental health condition.
    """
    patient_data = generate_patient_data_json()
    emotion_data = generate_emotion_json()
    
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

report_prompt = generate_report_llm_prompt()
recommendation_prompt = generate_recommendation_llm_prompt()

def get_recommendation(model, prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during analysis: {e}"

def init_gemini_instance(temp, tp):
    """
    Initializes and returns a new instance of the Gemini model.
    """
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
    """
    Analyzes the report LLM prompt using the initialized model.
    Returns the response text or an error message.
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred during report analysis: {e}"

def main():
    try:
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