# Telangana School AI System

A Streamlit-based analytics and risk prediction dashboard for Telangana school data.

## Project structure

- `app.py` - main Streamlit entrypoint
- `data/` - raw and processed datasets
- `models/` - training, prediction, and preprocessing logic
- `modules/` - reusable application modules and utilities
- `components/` - UI components for the Streamlit app
- `pages/` - page definitions for the dashboard
- `styles/` - CSS styling
- `assets/` - images and static media assets
- `notebooks/` - experimentation and analysis notebooks

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the environment:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the app:
   ```bash
   streamlit run app.py
   ```
