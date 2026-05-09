import pandas as pd
from sklearn.preprocessing import LabelEncoder

def preprocess_students(df):

    df = df.copy()

    categorical_cols = [
        "gender",
        "income_level",
        "internet_access",
        "parent_education"
    ]

    encoders = {}

    for col in categorical_cols:

        le = LabelEncoder()

        df[col] = le.fit_transform(df[col])

        encoders[col] = le

    return df, encoders