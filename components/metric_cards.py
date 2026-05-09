import streamlit as st


def render_metric_card(title, value):
    st.metric(label=title, value=value)
