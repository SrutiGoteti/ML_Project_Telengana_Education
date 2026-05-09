import pandas as pd
import joblib

from models.preprocessing import preprocess_students

model = joblib.load("models/dropout_model.pkl")

def predict_dropout_risk(df):

    processed, _ = preprocess_students(df)

    X = processed[
        [
            "attendance",
            "math_score",
            "science_score",
            "english_score",
            "income_level",
            "travel_distance",
            "internet_access",
            "parent_education",
            "previous_absences",
            "gender"
        ]
    ]

    predictions = model.predict(X)

    probabilities = model.predict_proba(X)[:, 1]

    df["risk_prediction"] = predictions
    df["risk_probability"] = probabilities

    return df