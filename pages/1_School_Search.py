# pages/1_School_Search.py

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

from modules.data_loader import load_schools

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="School Search",
    layout="wide"
)

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

st.title("School Search & Intelligence Profile")

st.markdown("""
Explore Telangana schools using intelligent filters,
institutional benchmarking, and infrastructure analytics.
""")

st.divider()

# =====================================================
# SIDEBAR FILTERS
# =====================================================

st.sidebar.header("School Filters")

district = st.sidebar.selectbox(
    "District",
    ["All"] + sorted(list(schools["district"].unique()))
)

school_type = st.sidebar.selectbox(
    "School Type",
    ["All"] + sorted(list(schools["school_type"].unique()))
)

area_type = st.sidebar.selectbox(
    "Area Type",
    ["All"] + sorted(list(schools["area_type"].unique()))
)

attendance_range = st.sidebar.slider(
    "Attendance Range",
    50,
    100,
    (60, 100)
)

infra_range = st.sidebar.slider(
    "Infrastructure Score",
    0,
    100,
    (40, 100)
)

# =====================================================
# FILTER LOGIC
# =====================================================

filtered = schools.copy()

if district != "All":
    filtered = filtered[
        filtered["district"] == district
    ]

if school_type != "All":
    filtered = filtered[
        filtered["school_type"] == school_type
    ]

if area_type != "All":
    filtered = filtered[
        filtered["area_type"] == area_type
    ]

filtered = filtered[
    (filtered["attendance_rate"] >= attendance_range[0]) &
    (filtered["attendance_rate"] <= attendance_range[1])
]

filtered = filtered[
    (filtered["infrastructure_score"] >= infra_range[0]) &
    (filtered["infrastructure_score"] <= infra_range[1])
]

# =====================================================
# SEARCH
# =====================================================

search = st.text_input(
    "Search School Name"
)

if search:

    filtered = filtered[
        filtered["school_name"].str.contains(
            search,
            case=False
        )
    ]

# =====================================================
# QUICK METRICS
# =====================================================

col1, col2, col3, col4 = st.columns(4)

col1.metric(
    "Schools Found",
    len(filtered)
)

col2.metric(
    "Avg Attendance",
    f"{filtered['attendance_rate'].mean():.1f}%"
)

col3.metric(
    "Avg Dropout",
    f"{filtered['dropout_rate'].mean():.1f}%"
)

col4.metric(
    "Avg Infrastructure",
    f"{filtered['infrastructure_score'].mean():.1f}"
)

st.divider()

# =====================================================
# SCHOOL RESULTS TABLE
# =====================================================

st.subheader("School Discovery")

display_columns = [
    "school_name",
    "district",
    "school_type",
    "attendance_rate",
    "dropout_rate",
    "infrastructure_score"
]

st.dataframe(
    filtered[display_columns],
    use_container_width=True,
    height=300
)

st.divider()

# =====================================================
# SCHOOL PROFILE SELECTION
# =====================================================

st.subheader("School Intelligence Profile")

selected_school = st.selectbox(
    "Select School",
    filtered["school_name"].unique()
)

school = filtered[
    filtered["school_name"] == selected_school
].iloc[0]

district_df = schools[
    schools["district"] == school["district"]
]

# =====================================================
# SCHOOL HEALTH SCORE
# =====================================================

health_score = (
    school["attendance_rate"] * 0.35
    +
    (100 - school["dropout_rate"]) * 0.30
    +
    school["infrastructure_score"] * 0.25
    +
    (100 - school["teacher_student_ratio"]) * 0.10
)

health_score = round(health_score, 1)

if health_score >= 85:
    health_status = "Excellent"

elif health_score >= 70:
    health_status = "Stable"

elif health_score >= 55:
    health_status = "At Risk"

else:
    health_status = "Critical"

# =====================================================
# PROFILE METRICS
# =====================================================

col1, col2, col3, col4 = st.columns(4)

col1.metric(
    "Health Index",
    f"{health_score}/100"
)

col2.metric(
    "Attendance",
    f"{school['attendance_rate']}%"
)

col3.metric(
    "Dropout Rate",
    f"{school['dropout_rate']}%"
)

col4.metric(
    "Status",
    health_status
)

st.divider()

# =====================================================
# SCHOOL VS DISTRICT VS STATE
# =====================================================

st.subheader("Benchmark Comparison")

comparison_df = pd.DataFrame({

    "Metric": [
        "Attendance",
        "Dropout",
        "Infrastructure"
    ],

    "School": [
        school["attendance_rate"],
        school["dropout_rate"],
        school["infrastructure_score"]
    ],

    "District Average": [
        district_df["attendance_rate"].mean(),
        district_df["dropout_rate"].mean(),
        district_df["infrastructure_score"].mean()
    ],

    "State Average": [
        schools["attendance_rate"].mean(),
        schools["dropout_rate"].mean(),
        schools["infrastructure_score"].mean()
    ]
})

st.dataframe(
    comparison_df,
    use_container_width=True
)

st.divider()

# =====================================================
# RADAR CHART
# =====================================================

st.subheader("Institutional Performance Radar")

categories = [
    "Attendance",
    "Infrastructure",
    "Digital Access",
    "Enrollment",
    "Retention"
]

digital_score = 100 if school["internet"] == "Yes" else 40

retention_score = 100 - school["dropout_rate"]

enrollment_score = min(
    100,
    school["enrollment"] / 15
)

values = [
    school["attendance_rate"],
    school["infrastructure_score"],
    digital_score,
    enrollment_score,
    retention_score
]

fig = go.Figure()

fig.add_trace(go.Scatterpolar(
    r=values,
    theta=categories,
    fill='toself',
    name=school["school_name"]
))

fig.update_layout(
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
    fig,
    use_container_width=True
)

st.divider()

# =====================================================
# INFRASTRUCTURE STATUS
# =====================================================

st.subheader("Infrastructure Status")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.success(
        f"Electricity: {school['electricity']}"
    )

with col2:
    st.success(
        f"Internet: {school['internet']}"
    )

with col3:
    st.success(
        f"Library: {school['library']}"
    )

with col4:
    st.success(
        f"Playground: {school['playground']}"
    )

st.divider()

# =====================================================
# POSITIONING ANALYSIS
# =====================================================

st.subheader("Statewide Positioning")

attendance_percentile = round(
    (
        schools["attendance_rate"]
        <
        school["attendance_rate"]
    ).mean() * 100,
    1
)

infra_percentile = round(
    (
        schools["infrastructure_score"]
        <
        school["infrastructure_score"]
    ).mean() * 100,
    1
)

st.info(f"""
• This school performs better than {attendance_percentile}% of Telangana schools in attendance outcomes.

• Infrastructure quality exceeds {infra_percentile}% of schools statewide.

• The school belongs to the '{health_status}' institutional performance category.
""")

st.divider()

# =====================================================
# STRENGTHS & RISKS
# =====================================================

st.subheader("Institutional Strengths & Risks")

strengths = []
risks = []

if school["attendance_rate"] > 85:
    strengths.append("Strong attendance performance")

else:
    risks.append("Attendance below optimal threshold")

if school["infrastructure_score"] > 80:
    strengths.append("Good infrastructure availability")

else:
    risks.append("Infrastructure limitations detected")

if school["internet"] == "Yes":
    strengths.append("Digital access available")

else:
    risks.append("Limited digital accessibility")

if school["dropout_rate"] > 10:
    risks.append("Elevated dropout vulnerability")

col1, col2 = st.columns(2)

with col1:

    st.success("### Institutional Strengths")

    for item in strengths:
        st.write(f"• {item}")

with col2:

    st.error("### Institutional Risks")

    for item in risks:
        st.write(f"• {item}")

st.divider()

# =====================================================
# RECOMMENDED ACTIONS
# =====================================================

st.subheader("Suggested Institutional Actions")

recommendations = []

if school["attendance_rate"] < 75:
    recommendations.append(
        "Strengthen attendance monitoring systems."
    )

if school["internet"] == "No":
    recommendations.append(
        "Improve digital infrastructure accessibility."
    )

if school["dropout_rate"] > 10:
    recommendations.append(
        "Implement targeted dropout prevention programs."
    )

if school["teacher_student_ratio"] > 35:
    recommendations.append(
        "Increase teacher allocation capacity."
    )

if len(recommendations) == 0:
    recommendations.append(
        "Institution demonstrates relatively stable educational performance."
    )

for rec in recommendations:
    st.warning(f"• {rec}")