def analyze_trends(df):
    return df.groupby("year").mean()
