import streamlit as st


def render_table(df):
    st.dataframe(df)
