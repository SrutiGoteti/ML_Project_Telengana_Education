# pages/4_Institutional_Risk_Analysis.py

import os
from dotenv import load_dotenv
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import google.generativeai as genai

from modules.data_loader import load_schools

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="Institutional Risk Intelligence",
    layout="wide"
)

# =====================================================
# GEMINI API CONFIG
# =====================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    try:
        API_KEY = st.secrets["gemini"]["api_key"]
    except Exception:
        API_KEY = None

if API_KEY:
    genai.configure(api_key=API_KEY)
    model_ai = genai.GenerativeModel('models/gemini-flash-latest')
else:
    st.warning(
        "Gemini API key is not configured. Add GEMINI_API_KEY to .env or .streamlit/secrets.toml."
    )
    model_ai = None

# =====================================================
# LOAD DATA
# =====================================================

schools = load_schools()

# =====================================================
# LOAD CSS
# =====================================================

def load_css():

    with open("styles/style.css") as f:

        st.markdown(
            f"<style>{f.read()}</style>",
            unsafe_allow_html=True
        )

load_css()

# =====================================================
# TITLE
# =====================================================

st.title("Institutional Risk Intelligence")

st.markdown("""
AI-powered educational vulnerability analysis system
for identifying institutional instability,
infrastructure risks,
and policy intervention priorities.
""")

st.divider()

# =====================================================
# SYNTHETIC RISK LABELS
# =====================================================

def generate_risk_label(row):

    risk_score = 0

    if row["attendance_rate"] < 70:
        risk_score += 3

    elif row["attendance_rate"] < 80:
        risk_score += 2

    if row["dropout_rate"] > 15:
        risk_score += 3

    elif row["dropout_rate"] > 8:
        risk_score += 2

    if row["infrastructure_score"] < 50:
        risk_score += 3

    elif row["infrastructure_score"] < 70:
        risk_score += 2

    if row["teacher_student_ratio"] > 40:
        risk_score += 2

    if row["internet"] == "No":
        risk_score += 2

    if risk_score >= 10:
        return "Critical"

    elif risk_score >= 7:
        return "High"

    elif risk_score >= 4:
        return "Moderate"

    else:
        return "Low"

schools["risk_level"] = schools.apply(
    generate_risk_label,
    axis=1
)

# =====================================================
# PREPROCESSING
# =====================================================

model_data = schools.copy()

internet_encoder = LabelEncoder()

model_data["internet_encoded"] = internet_encoder.fit_transform(
    model_data["internet"]
)

risk_encoder = LabelEncoder()

model_data["risk_encoded"] = risk_encoder.fit_transform(
    model_data["risk_level"]
)

# =====================================================
# FEATURES
# =====================================================

features = [

    "attendance_rate",
    "dropout_rate",
    "infrastructure_score",
    "teacher_student_ratio",
    "enrollment",
    "internet_encoded"
]

X = model_data[features]

y = model_data["risk_encoded"]

# =====================================================
# TRAIN TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================================================
# XGBOOST MODEL
# =====================================================

model = XGBClassifier(

    n_estimators=150,
    max_depth=5,
    learning_rate=0.08,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

# =====================================================
# PREDICT FULL DATA
# =====================================================

schools["predicted_risk"] = risk_encoder.inverse_transform(
    model.predict(X)
)

# =====================================================
# SIDEBAR FILTERS
# =====================================================

st.sidebar.header("Analysis Filters")

district = st.sidebar.selectbox(
    "Select District",
    ["All"] + sorted(
        schools["district"].unique()
    )
)

risk_filter = st.sidebar.selectbox(
    "Risk Level",
    ["All", "Low", "Moderate", "High", "Critical"]
)

filtered = schools.copy()

if district != "All":

    filtered = filtered[
        filtered["district"] == district
    ]

if risk_filter != "All":

    filtered = filtered[
        filtered["predicted_risk"] == risk_filter
    ]

# =====================================================
# MODEL METRICS
# =====================================================

st.header("ML Model Performance")

col1, col2, col3 = st.columns(3)

col1.metric(
    "Model",
    "XGBoost"
)

col2.metric(
    "Schools Analyzed",
    len(schools)
)

col3.metric(
    "Model Accuracy",
    f"{accuracy:.2f}"
)

st.divider()

# =====================================================
# RISK DISTRIBUTION
# =====================================================

st.header("Institutional Risk Distribution")

risk_counts = schools[
    "predicted_risk"
].value_counts().reset_index()

risk_counts.columns = [
    "Risk Level",
    "Count"
]

fig_pie = px.pie(

    risk_counts,
    names="Risk Level",
    values="Count",
    title="Predicted Institutional Risk"
)

st.plotly_chart(
    fig_pie,
    use_container_width=True
)

st.divider()

# =====================================================
# VULNERABLE SCHOOLS TABLE
# =====================================================

st.header("Institutional Vulnerability Table")

display_columns = [

    "school_name",
    "district",
    "attendance_rate",
    "dropout_rate",
    "infrastructure_score",
    "predicted_risk"
]

st.dataframe(

    filtered[display_columns].sort_values(
        by="dropout_rate",
        ascending=False
    ),

    use_container_width=True,
    height=400
)

st.divider()

# =====================================================
# SCHOOL PROFILE
# =====================================================

st.header("Institutional Intelligence Profile")

selected_school = st.selectbox(

    "Select School",
    filtered["school_name"].unique()
)

school = filtered[
    filtered["school_name"] == selected_school
].iloc[0]

# =====================================================
# SCHOOL METRICS
# =====================================================

col1, col2, col3, col4 = st.columns(4)

col1.metric(
    "Predicted Risk",
    school["predicted_risk"]
)

col2.metric(
    "Attendance",
    f"{school['attendance_rate']}%"
)

col3.metric(
    "Dropout",
    f"{school['dropout_rate']}%"
)

col4.metric(
    "Infrastructure",
    school["infrastructure_score"]
)

st.divider()

# =====================================================
# RADAR CHART
# =====================================================

st.subheader("Institutional Risk Radar")

categories = [

    "Attendance",
    "Infrastructure",
    "Digital Access",
    "Retention",
    "Teacher Capacity"
]

digital_score = 100 if school["internet"] == "Yes" else 40

retention_score = 100 - school["dropout_rate"]

teacher_capacity = max(
    0,
    100 - school["teacher_student_ratio"]
)

values = [

    school["attendance_rate"],
    school["infrastructure_score"],
    digital_score,
    retention_score,
    teacher_capacity
]

fig_radar = go.Figure()

fig_radar.add_trace(go.Scatterpolar(

    r=values,
    theta=categories,
    fill='toself'
))

fig_radar.update_layout(

    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 100]
        )
    ),

    showlegend=False,
    height=500
)

st.plotly_chart(
    fig_radar,
    use_container_width=True
)

st.divider()

# =====================================================
# FEATURE IMPORTANCE
# =====================================================

st.header("ML Feature Importance")

importance_df = pd.DataFrame({

    "Feature": features,
    "Importance": model.feature_importances_
})

importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

fig_importance = px.bar(

    importance_df,
    x="Feature",
    y="Importance",
    color="Importance",
    title="Feature Importance Analysis"
)

st.plotly_chart(
    fig_importance,
    use_container_width=True
)

st.divider()

# =====================================================
# AI POLICY CHATBOT
# =====================================================

st.header("AI Educational Policy Assistant")

st.markdown("""
Generate AI-powered institutional intervention
recommendations using educational analytics.
""")

if st.button("Generate AI Recommendations"):

    with st.spinner("Analyzing institutional conditions..."):

        prompt = f"""
        You are an educational policy analyst.

        Analyze this school institution and provide:
        1. Main institutional risks
        2. Key educational concerns
        3. Suggested interventions
        4. Long-term improvement strategies

        School Data:

        School Name:
        {school['school_name']}

        District:
        {school['district']}

        Attendance Rate:
        {school['attendance_rate']}

        Dropout Rate:
        {school['dropout_rate']}

        Infrastructure Score:
        {school['infrastructure_score']}

        Teacher Student Ratio:
        {school['teacher_student_ratio']}

        Internet Access:
        {school['internet']}

        Predicted Institutional Risk:
        {school['predicted_risk']}

        Give practical educational policy suggestions.
        """

        if model_ai is None:
            st.error(
                "AI recommendations are unavailable because the Gemini API key is missing."
            )
        else:
            response = model_ai.generate_content(
                prompt
            )
            st.success(response.text)

st.divider()

# =====================================================
# DISTRICT RISK VISUALIZATION
# =====================================================

st.header("District Vulnerability Mapping")

district_risk = schools.groupby(
    "district"
)["dropout_rate"].mean().reset_index()

district_risk = district_risk.sort_values(
    by="dropout_rate",
    ascending=False
)

fig_district = px.bar(

    district_risk,
    x="district",
    y="dropout_rate",
    color="dropout_rate",
    title="District Educational Vulnerability"
)

st.plotly_chart(
    fig_district,
    use_container_width=True
)

st.divider()

# =====================================================
# FINAL INSIGHTS
# =====================================================

st.header("Strategic Insights")

st.info("""
• Attendance instability remains one of the strongest
  indicators of institutional educational risk.

• Infrastructure and digital accessibility significantly
  influence educational resilience.

• AI-assisted institutional analysis enables proactive
  policy planning and targeted educational investment.

• Institutional intelligence systems can support
  evidence-based educational governance.
""")