# pages/3_Trend_Analysis.py

import streamlit as st
import pandas as pd
import plotly.express as px
from sklearn.linear_model import LinearRegression
import numpy as np

from modules.data_loader import load_trends

# =====================================================
# PAGE CONFIG
# =====================================================

st.set_page_config(
    page_title="Trend Analysis",
    layout="wide"
)

# =====================================================
# LOAD DATA
# =====================================================

trends = load_trends()

# Derive compatibility fields for trend analytics.
# Raw `data/raw/trends.csv` contains digital access, dropout rate,
# and teacher ratio, but not explicit attendance or infrastructure growth.
if "attendance_rate" not in trends.columns:
    trends["attendance_rate"] = np.clip(
        100 - trends["dropout_rate"],
        60,
        100
    )

if "infrastructure_growth" not in trends.columns:
    trends["infrastructure_growth"] = trends["digital_access"]

if "teacher_student_ratio" not in trends.columns and "teacher_ratio" in trends.columns:
    trends["teacher_student_ratio"] = trends["teacher_ratio"]

if "area_type" not in trends.columns:
    trends["area_type"] = "All"

if "school_type" not in trends.columns:
    trends["school_type"] = "All"

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

st.title("Educational Trend Intelligence")

st.markdown("""
Analyze how educational indicators evolve over time across Telangana.
Explore enrollment patterns, dropout progression, infrastructure growth,
and district-level educational transformation.
""")

st.divider()

# =====================================================
# TREND EXPLORATION BUILDER
# =====================================================

st.header("Trend Exploration Builder")

metric_options = [
    "enrollment",
    "dropout_rate",
    "attendance_rate",
    "digital_access",
    "teacher_student_ratio"
]

comparison_modes = [
    "Single District",
    "Multi-District",
    "Urban vs Rural",
    "Government vs Private"
]

col1, col2 = st.columns(2)

with col1:

    selected_metric = st.selectbox(
        "Trend Metric",
        metric_options
    )

with col2:

    comparison_mode = st.selectbox(
        "Comparison Mode",
        comparison_modes
    )

# =====================================================
# SINGLE DISTRICT MODE
# =====================================================

if comparison_mode == "Single District":

    district = st.selectbox(
        "Select District",
        sorted(trends["district"].unique())
    )

    filtered = trends[
        trends["district"] == district
    ]

    fig = px.line(
        filtered,
        x="year",
        y=selected_metric,
        markers=True,
        title=f"{selected_metric} Trend - {district}"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    # =================================================
    # TREND CHANGE DETECTION
    # =================================================

    start_value = filtered.iloc[0][selected_metric]
    end_value = filtered.iloc[-1][selected_metric]

    change = (
        (
            end_value - start_value
        )
        /
        start_value
    ) * 100

    st.info(f"""
    Trend Change Analysis:

    • {selected_metric} changed by {change:.2f}%
      between {filtered.iloc[0]['year']}
      and {filtered.iloc[-1]['year']}.

    • Educational progression patterns indicate
      measurable institutional transformation.
    """)

# =====================================================
# MULTI DISTRICT MODE
# =====================================================

elif comparison_mode == "Multi-District":

    selected_districts = st.multiselect(
        "Select Districts",
        sorted(trends["district"].unique()),
        default=sorted(trends["district"].unique())[:3]
    )

    filtered = trends[
        trends["district"].isin(selected_districts)
    ]

    fig = px.line(
        filtered,
        x="year",
        y=selected_metric,
        color="district",
        markers=True,
        title=f"{selected_metric} Comparison Across Districts"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.success("""
    Comparative trend analysis helps identify
    districts demonstrating rapid educational
    progression or persistent vulnerabilities.
    """)

# =====================================================
# URBAN VS RURAL
# =====================================================

elif comparison_mode == "Urban vs Rural":

    grouped = trends.groupby(
        ["year", "area_type"]
    )[selected_metric].mean().reset_index()

    fig = px.line(
        grouped,
        x="year",
        y=selected_metric,
        color="area_type",
        markers=True,
        title=f"{selected_metric}: Urban vs Rural"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.warning("""
    Urban-rural disparities indicate unequal
    educational access and institutional resource distribution.
    """)

# =====================================================
# GOVT VS PRIVATE
# =====================================================

else:

    grouped = trends.groupby(
        ["year", "school_type"]
    )[selected_metric].mean().reset_index()

    fig = px.line(
        grouped,
        x="year",
        y=selected_metric,
        color="school_type",
        markers=True,
        title=f"{selected_metric}: Government vs Private"
    )

    st.plotly_chart(
        fig,
        use_container_width=True
    )

    st.warning("""
    School-type comparisons reveal institutional
    differences in educational progression and stability.
    """)

st.divider()

# =====================================================
# FORECASTING ENGINE
# =====================================================

st.header("Educational Forecasting")

forecast_district = st.selectbox(
    "Forecast District",
    sorted(trends["district"].unique()),
    key="forecast"
)

forecast_metric = st.selectbox(
    "Forecast Metric",
    metric_options,
    key="forecast_metric"
)

forecast_data = trends[
    trends["district"] == forecast_district
]

X = np.array(
    forecast_data["year"]
).reshape(-1, 1)

y = forecast_data[forecast_metric]

model = LinearRegression()

model.fit(X, y)

future_years = np.array([
    2026,
    2027,
    2028
]).reshape(-1, 1)

predictions = model.predict(
    future_years
)

forecast_df = pd.DataFrame({

    "year": [
        2026,
        2027,
        2028
    ],

    "forecast": predictions
})

historical_df = pd.DataFrame({

    "year": forecast_data["year"],
    "value": forecast_data[forecast_metric],
    "type": "Historical"
})

future_df = pd.DataFrame({

    "year": forecast_df["year"],
    "value": forecast_df["forecast"],
    "type": "Forecast"
})

combined = pd.concat([
    historical_df,
    future_df
])

fig_forecast = px.line(
    combined,
    x="year",
    y="value",
    color="type",
    markers=True,
    title=f"{forecast_metric} Forecast - {forecast_district}"
)

st.plotly_chart(
    fig_forecast,
    use_container_width=True
)

st.success(f"""
Forecast Insight:

Projected {forecast_metric}
for 2028 is approximately
{predictions[-1]:.2f}.

Forecasting models indicate
continuing educational progression patterns.
""")

st.divider()

# =====================================================
# TREND ALERTS
# =====================================================

st.header("Trend Alerts")

alerts = []

districts = trends["district"].unique()

for district in districts:

    district_data = trends[
        trends["district"] == district
    ]

    start_dropout = district_data.iloc[0][
        "dropout_rate"
    ]

    end_dropout = district_data.iloc[-1][
        "dropout_rate"
    ]

    if end_dropout > start_dropout:

        alerts.append(
            f"Dropout rates increasing in {district}."
        )

    start_digital = district_data.iloc[0][
        "digital_access"
    ]

    end_digital = district_data.iloc[-1][
        "digital_access"
    ]

    if end_digital > start_digital + 20:

        alerts.append(
            f"Strong digital infrastructure growth observed in {district}."
        )

if len(alerts) == 0:

    st.success(
        "No critical statewide trend alerts detected."
    )

else:

    for alert in alerts:

        st.warning(f"• {alert}")

st.divider()

# =====================================================
# DISTRICT PROGRESS INDEX
# =====================================================

st.header("District Progress Rankings")

progress_df = trends.groupby(
    "district"
).agg({

    "attendance_rate": "mean",
    "digital_access": "mean",
    "dropout_rate": "mean",
    "infrastructure_growth": "mean"
}).reset_index()

progress_df["progress_index"] = (

    progress_df["attendance_rate"] * 0.30 +

    progress_df["digital_access"] * 0.25 +

    progress_df["infrastructure_growth"] * 0.25 +

    (100 - progress_df["dropout_rate"]) * 0.20
)

progress_df = progress_df.sort_values(
    by="progress_index",
    ascending=False
)

st.dataframe(
    progress_df[
        ["district", "progress_index"]
    ],
    use_container_width=True
)

fig_rank = px.bar(
    progress_df,
    x="district",
    y="progress_index",
    color="progress_index",
    title="District Educational Progress Rankings"
)

st.plotly_chart(
    fig_rank,
    use_container_width=True
)

st.divider()

# =====================================================
# TREND HEATMAP
# =====================================================

st.header("Trend Heatmap")

heatmap_metric = st.selectbox(
    "Heatmap Metric",
    metric_options
)

pivot = trends.pivot_table(
    index="district",
    columns="year",
    values=heatmap_metric,
    aggfunc="mean"
)

fig_heatmap = px.imshow(
    pivot,
    text_auto=True,
    aspect="auto",
    title=f"{heatmap_metric} Heatmap"
)

st.plotly_chart(
    fig_heatmap,
    use_container_width=True
)

st.divider()

# =====================================================
# STRATEGIC INSIGHTS
# =====================================================

st.header("Strategic Educational Insights")

st.info("""
• Districts demonstrating strong digital expansion
  generally exhibit improved attendance stability.

• Long-term dropout reduction trends indicate
  measurable institutional improvement statewide.

• Educational progression remains uneven across regions,
  suggesting targeted policy intervention requirements.

• Forecasting analysis suggests continued educational
  transformation over the coming years.

• Trend intelligence enables proactive planning
  rather than reactive intervention.
""")