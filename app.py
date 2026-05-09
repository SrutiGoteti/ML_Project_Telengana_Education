# app.py

import streamlit as st
import pandas as pd

from modules.data_loader import (
    load_schools,
    load_students
)

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="Telangana Educational Intelligence System",
    layout="wide"
)

# =====================================================
# LOAD DATA
# =====================================================

schools = load_schools()
students = load_students()

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
# HERO SECTION
# =====================================================

st.markdown("""
<h1 style='font-size:42px;'>
Telangana Educational Intelligence System
</h1>
""", unsafe_allow_html=True)

st.markdown("""
### AI-powered platform for analyzing school performance,
### student vulnerability, and statewide educational trends.
""")

st.divider()

# =====================================================
# STATE METRICS
# =====================================================

total_schools = len(schools)

total_students = len(students)

avg_dropout = round(
    schools["dropout_rate"].mean(),
    1
)

high_risk_students = len(
    students[students["dropout_label"] == 1]
)

districts = schools["district"].nunique()

col1, col2, col3, col4, col5 = st.columns(5)

col1.metric(
    "Total Schools",
    f"{total_schools}"
)

col2.metric(
    "Students Monitored",
    f"{total_students:,}"
)

col3.metric(
    "Avg Dropout Rate",
    f"{avg_dropout}%"
)

col4.metric(
    "High Risk Students",
    f"{high_risk_students}"
)

col5.metric(
    "Districts Covered",
    f"{districts}"
)

st.divider()

# =====================================================
# FEATURE MODULES
# =====================================================

st.markdown("## Platform Modules")

col1, col2 = st.columns(2)

# =====================================================
# SCHOOL SEARCH CARD
# =====================================================

with col1:

    st.markdown("""
    <div style="
        background-color:white;
        padding:25px;
        border-radius:15px;
        box-shadow:0px 2px 10px rgba(0,0,0,0.08);
        margin-bottom:20px;
    ">
    
    <h3>School Search & Profiles</h3>

    <p>
    Explore Telangana schools using intelligent filters.
    Analyze attendance, infrastructure, enrollment,
    and institutional performance indicators.
    </p>

    <h4>Key Features</h4>

    <ul>
        <li>District-level filtering</li>
        <li>School infrastructure insights</li>
        <li>Attendance & dropout analytics</li>
        <li>School performance benchmarking</li>
    </ul>

    </div>
    """, unsafe_allow_html=True)

# =====================================================
# STATE ANALYTICS CARD
# =====================================================

with col2:

    st.markdown("""
    <div style="
        background-color:white;
        padding:25px;
        border-radius:15px;
        box-shadow:0px 2px 10px rgba(0,0,0,0.08);
        margin-bottom:20px;
    ">
    
    <h3>Statewide Analytics</h3>

    <p>
    Compare educational indicators across Telangana districts.
    Discover infrastructure gaps, attendance patterns,
    and institutional disparities.
    </p>

    <h4>Key Features</h4>

    <ul>
        <li>District comparisons</li>
        <li>Dropout distribution analysis</li>
        <li>Infrastructure analytics</li>
        <li>Custom visualization exploration</li>
    </ul>

    </div>
    """, unsafe_allow_html=True)

# =====================================================
# SECOND ROW
# =====================================================

col3, col4 = st.columns(2)

# =====================================================
# TREND ANALYSIS CARD
# =====================================================

with col3:

    st.markdown("""
    <div style="
        background-color:white;
        padding:25px;
        border-radius:15px;
        box-shadow:0px 2px 10px rgba(0,0,0,0.08);
        margin-bottom:20px;
    ">
    
    <h3>Trend Intelligence</h3>

    <p>
    Analyze educational changes over time.
    Study enrollment shifts, digital access growth,
    and dropout trends across districts.
    </p>

    <h4>Key Features</h4>

    <ul>
        <li>Year-wise trend analysis</li>
        <li>Comparative district trends</li>
        <li>Enrollment growth monitoring</li>
        <li>Digital access tracking</li>
    </ul>

    </div>
    """, unsafe_allow_html=True)

# =====================================================
# RISK ANALYSIS CARD
# =====================================================

with col4:

    st.markdown("""
    <div style="
        background-color:white;
        padding:25px;
        border-radius:15px;
        box-shadow:0px 2px 10px rgba(0,0,0,0.08);
        margin-bottom:20px;
    ">
    
    <h3>Student Risk Analysis</h3>

    <p>
    Identify students vulnerable to dropout risk using
    machine learning models and generate AI-powered
    intervention recommendations.
    </p>

    <h4>Key Features</h4>

    <ul>
        <li>ML-based risk prediction</li>
        <li>School-wise vulnerability detection</li>
        <li>AI intervention recommendations</li>
        <li>Student support planning</li>
    </ul>

    </div>
    """, unsafe_allow_html=True)

st.divider()

# =====================================================
# PLATFORM PURPOSE
# =====================================================

st.markdown("## Why This Platform Matters")

col1, col2, col3 = st.columns(3)

with col1:

    st.info("""
    ### Policymakers

    Identify districts requiring
    infrastructure investments,
    attendance intervention,
    and educational support planning.
    """)

with col2:

    st.info("""
    ### School Administrators

    Monitor institutional performance,
    identify student vulnerabilities,
    and improve school retention outcomes.
    """)

with col3:

    st.info("""
    ### Student Welfare Teams

    Detect at-risk students early
    and provide targeted intervention
    strategies for continued education.
    """)

st.divider()

# =====================================================
# KEY STATE INSIGHTS
# =====================================================

st.markdown("## Key Educational Insights")

st.success("""
• Rural schools demonstrate comparatively higher dropout vulnerability.

• Infrastructure quality strongly correlates with attendance outcomes.

• Internet accessibility is associated with improved student retention.

• Specific districts exhibit concentrated educational risk patterns.

• Attendance decline remains one of the strongest indicators of dropout vulnerability.
""")

st.divider()

# =====================================================
# FOOTER
# =====================================================

st.caption("""
Prototype Educational Intelligence Platform for
School Analytics, Trend Monitoring,
and AI-Assisted Student Intervention.
""")