import google.generativeai as genai
import os

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel('models/gemini-flash-latest')

def generate_intervention(student):

    prompt = f"""
    You are an educational intervention assistant.

    Analyze the following student data and provide:

    1. Risk explanation
    2. Likely causes of dropout risk
    3. School-level interventions
    4. Parent-level support suggestions
    5. Immediate actions required

    STUDENT DATA:

    Name: {student['student_name']}
    Gender: {student['gender']}
    Attendance: {student['attendance']}%
    Math Score: {student['math_score']}
    Science Score: {student['science_score']}
    English Score: {student['english_score']}
    Income Level: {student['income_level']}
    Travel Distance: {student['travel_distance']} km
    Internet Access: {student['internet_access']}
    Parent Education: {student['parent_education']}
    Previous Absences: {student['previous_absences']}
    Predicted Risk Probability: {round(student['risk_probability'] * 100, 1)}%

    Make the response empathetic, professional, and practical.
    """

    response = model.generate_content(prompt)

    return response.text