# pages/2_Statewide_Analytics.py

import streamlit as st
import pandas as pd
import plotly.express as px

from modules.data_loader import load_schools

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="Statewide Analytics",
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

st.title("Statewide Educational Analytics")

st.markdown("""
Interactive exploration system for analyzing educational
patterns, infrastructure gaps, and institutional disparities
across Telangana schools.
""")

st.divider()

# =====================================================
# STATE SUMMARY
# =====================================================

col1, col2, col3, col4, col5 = st.columns(5)

col1.metric(
    "Total Schools",
    len(schools)
)

col2.metric(
    "Total Enrollment",
    f"{schools['enrollment'].sum():,}"
)

col3.metric(
    "Avg Attendance",
    f"{schools['attendance_rate'].mean():.1f}%"
)

col4.metric(
    "Avg Dropout",
    f"{schools['dropout_rate'].mean():.1f}%"
)

col5.metric(
    "Districts",
    schools["district"].nunique()
)

st.divider()

# =====================================================
# INTERACTIVE ANALYTICS BUILDER
# =====================================================

st.header("Interactive Analytics Builder")

col1, col2, col3 = st.columns(3)

group_options = [
    "district",
    "school_type",
    "area_type",
    "mandal"
]

metric_options = [
    "attendance_rate",
    "dropout_rate",
    "infrastructure_score",
    "teacher_student_ratio",
    "enrollment",
    "digital_classrooms"
]

chart_options = [
    "Bar Chart",
    "Box Plot",
    "Scatter Plot",
    "Histogram"
]

with col1:

    group_by = st.selectbox(
        "Group By",
        group_options
    )

with col2:

    metric = st.selectbox(
        "Analysis Metric",
        metric_options
    )

with col3:

    chart_type = st.selectbox(
        "Visualization Type",
        chart_options
    )

# =====================================================
# AGGREGATED DATA
# =====================================================

grouped = schools.groupby(group_by)[metric].mean().reset_index()

# =====================================================
# VISUALIZATION LOGIC
# =====================================================

st.subheader("Visualization")

if chart_type == "Bar Chart":

    fig = px.bar(
        grouped,
        x=group_by,
        y=metric,
        color=metric,
        title=f"{metric} by {group_by}"
    )

elif chart_type == "Box Plot":

    fig = px.box(
        schools,
        x=group_by,
        y=metric,
        color=group_by,
        title=f"{metric} Distribution by {group_by}"
    )

elif chart_type == "Scatter Plot":

    fig = px.scatter(
        grouped,
        x=group_by,
        y=metric,
        color=metric,
        size=metric,
        title=f"{metric} Comparison"
    )

elif chart_type == "Histogram":

    fig = px.histogram(
        schools,
        x=metric,
        color=group_by,
        title=f"{metric} Distribution"
    )

st.plotly_chart(
    fig,
    use_container_width=True
)

st.divider()

# =====================================================
# INSIGHT ENGINE
# =====================================================

st.subheader("Generated Insights")

highest = grouped.loc[
    grouped[metric].idxmax()
]

lowest = grouped.loc[
    grouped[metric].idxmin()
]

st.info(f"""
• Highest {metric} observed in:
  {highest[group_by]} ({highest[metric]:.2f})

• Lowest {metric} observed in:
  {lowest[group_by]} ({lowest[metric]:.2f})

• Institutional disparities indicate uneven
  educational resource distribution.

• Comparative analytics reveal significant
  variability across educational regions.
""")

st.divider()

# =====================================================
# COMPARATIVE ANALYSIS
# =====================================================

st.header("Comparative District Analysis")

districts = sorted(
    schools["district"].unique()
)

col1, col2 = st.columns(2)

with col1:

    district_1 = st.selectbox(
        "Select First District",
        districts
    )

with col2:

    district_2 = st.selectbox(
        "Select Second District",
        districts,
        index=1
    )

district1_data = schools[
    schools["district"] == district_1
]

district2_data = schools[
    schools["district"] == district_2
]

comparison_df = pd.DataFrame({

    "Metric": [
        "Attendance",
        "Dropout",
        "Infrastructure",
        "Teacher Ratio"
    ],

    district_1: [

        district1_data["attendance_rate"].mean(),
        district1_data["dropout_rate"].mean(),
        district1_data["infrastructure_score"].mean(),
        district1_data["teacher_student_ratio"].mean()
    ],

    district_2: [

        district2_data["attendance_rate"].mean(),
        district2_data["dropout_rate"].mean(),
        district2_data["infrastructure_score"].mean(),
        district2_data["teacher_student_ratio"].mean()
    ]
})

st.dataframe(
    comparison_df,
    use_container_width=True
)

fig_compare = px.bar(
    comparison_df,
    x="Metric",
    y=[district_1, district_2],
    barmode="group",
    title=f"{district_1} vs {district_2}"
)

st.plotly_chart(
    fig_compare,
    use_container_width=True
)

st.divider()

# =====================================================
# CORRELATION EXPLORER
# =====================================================

st.header("Correlation Explorer")

numeric_columns = [
    "attendance_rate",
    "dropout_rate",
    "infrastructure_score",
    "teacher_student_ratio",
    "enrollment",
    "digital_classrooms"
]

col1, col2 = st.columns(2)

with col1:

    x_axis = st.selectbox(
        "X-Axis Metric",
        numeric_columns,
        index=2
    )

with col2:

    y_axis = st.selectbox(
        "Y-Axis Metric",
        numeric_columns,
        index=0
    )

fig_corr = px.scatter(
    schools,
    x=x_axis,
    y=y_axis,
    color="district",
    hover_name="school_name",
    title=f"{x_axis} vs {y_axis}",
    trendline="ols"
)

st.plotly_chart(
    fig_corr,
    use_container_width=True
)

correlation = schools[x_axis].corr(
    schools[y_axis]
)

st.success(f"""
Correlation Score: {correlation:.2f}

A stronger positive value indicates
direct proportional relationship,
while negative values indicate inverse relationships.
""")

st.divider()

# =====================================================
# DISTRICT RANKINGS
# =====================================================

st.header("District Rankings")

ranking_metric = st.selectbox(
    "Select Ranking Metric",
    metric_options
)

ranking_df = schools.groupby(
    "district"
)[ranking_metric].mean().reset_index()

ranking_df = ranking_df.sort_values(
    by=ranking_metric,
    ascending=False
)

st.dataframe(
    ranking_df,
    use_container_width=True
)

fig_rank = px.bar(
    ranking_df,
    x="district",
    y=ranking_metric,
    color=ranking_metric,
    title=f"District Rankings by {ranking_metric}"
)

st.plotly_chart(
    fig_rank,
    use_container_width=True
)

st.divider()

# =====================================================
# POLICY SIMULATION
# =====================================================

st.header("Policy Impact Simulation")

st.markdown("""
Simulate how educational improvements
may influence statewide dropout vulnerability.
""")

policy_choice = st.selectbox(
    "Select Policy Variable",
    [
        "Infrastructure Improvement",
        "Attendance Improvement",
        "Digital Access Expansion",
        "Teacher Capacity Expansion"
    ]
)

improvement = st.slider(
    "Improvement Percentage",
    0,
    50,
    10
)

current_dropout = schools[
    "dropout_rate"
].mean()

# =====================================================
# SIMPLE HEURISTIC MODEL
# =====================================================

if policy_choice == "Infrastructure Improvement":

    estimated_reduction = improvement * 0.35

elif policy_choice == "Attendance Improvement":

    estimated_reduction = improvement * 0.45

elif policy_choice == "Digital Access Expansion":

    estimated_reduction = improvement * 0.28

else:

    estimated_reduction = improvement * 0.22

projected_dropout = max(
    0,
    current_dropout - estimated_reduction
)

col1, col2 = st.columns(2)

col1.metric(
    "Current Avg Dropout",
    f"{current_dropout:.2f}%"
)

col2.metric(
    "Projected Dropout",
    f"{projected_dropout:.2f}%"
)

st.success(f"""
Projected Insight:

A {improvement}% improvement in
{policy_choice.lower()} may reduce
average statewide dropout vulnerability
by approximately {estimated_reduction:.2f}%.
""")

# =====================================================
# POLICY VISUALIZATION
# =====================================================

policy_df = pd.DataFrame({

    "Scenario": [
        "Current",
        "Projected"
    ],

    "Dropout Rate": [
        current_dropout,
        projected_dropout
    ]
})

fig_policy = px.bar(
    policy_df,
    x="Scenario",
    y="Dropout Rate",
    title="Policy Simulation Impact"
)

st.plotly_chart(
    fig_policy,
    use_container_width=True
)

st.divider()

# =====================================================
# FINAL INSIGHTS
# =====================================================

st.header("Strategic Educational Insights")

st.warning("""
• Infrastructure disparities remain strongly associated with attendance instability.

• Schools with limited digital accessibility demonstrate elevated dropout vulnerability.

• District-level inequalities suggest targeted intervention requirements.

• Attendance improvement policies may yield the strongest retention outcomes.

• Institutional analytics can support evidence-based educational planning.
""")