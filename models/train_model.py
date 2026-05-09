import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

from preprocessing import preprocess_students

# =====================================================
# LOAD DATA
# =====================================================

df = pd.read_csv("data/raw/students.csv")

# =====================================================
# PREPROCESS
# =====================================================

df, encoders = preprocess_students(df)

# =====================================================
# FEATURES
# =====================================================

X = df[
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

y = df["dropout_label"]

# =====================================================
# SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================================================
# MODEL
# =====================================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# =====================================================
# EVALUATE
# =====================================================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"Model Accuracy: {accuracy:.2f}")

# =====================================================
# SAVE MODEL
# =====================================================

joblib.dump(model, "models/dropout_model.pkl")

print("Model saved successfully!")