def compute_summary_metrics(df):
    return {
        "count": len(df),
        "mean_attendance": df["attendance"].mean() if "attendance" in df else None,
    }
