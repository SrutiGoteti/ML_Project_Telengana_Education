import streamlit as st

# -------------------------
# Page Config
# -------------------------
st.set_page_config(
    page_title="AI School Analytics Portal",
    layout="wide"
)

# ------------------------- 
# Custom Styling
# -------------------------
st.markdown("""
<style>

/* Light Orange Background */
.stApp {
    background-color: #ffe0b2;
}

/* Header Container */
.custom-header {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.1),
        0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Title Styling */
.portal-title {
    font-size: 28px;
    font-weight: bold;
    color: #b71c1c;
    text-align: center;
}

/* Emblem Image */
.emblem {
    height: 90px;
}

</style>
""", unsafe_allow_html=True)

# -------------------------
# Header with Emblem + Title
# -------------------------
st.markdown("""
<div class="custom-header">
    <img class="emblem" src="https://static.vecteezy.com/system/resources/previews/046/483/775/non_2x/coat-of-arms-indian-national-emblem-art-with-fine-details-lions-ashoka-chakra-republic-of-india-bharat-constitution-crest-animal-for-government-hindi-pillar-army-navy-military-delhi-eps-vector.jpg">
    <div class="portal-title">
        AI-Powered School Analytics & Risk Monitoring Portal
    </div>
</div>
""", unsafe_allow_html=True)

