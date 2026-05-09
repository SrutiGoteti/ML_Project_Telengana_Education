import pandas as pd

def load_schools():
    return pd.read_csv("data/raw/schools.csv")

def load_students():
    return pd.read_csv("data/raw/students.csv")

def load_trends():
    return pd.read_csv("data/raw/trends.csv")