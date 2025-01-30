import streamlit as st
import requests
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="HealthSolver Dashboard", layout="wide")

st.title("🔬 HealthSolver - AI Dashboard per Medici")

st.header("📊 Dati dei Pazienti")
data_url = "http://localhost:8000/dashboard/data"
data = requests.get(data_url).json()
df = pd.DataFrame(data)
fig = px.histogram(df, x="condition_severity", nbins=10, title="Distribuzione della Gravità delle Condizioni")
st.plotly_chart(fig, use_container_width=True)

st.header("📈 Previsioni AI")
predict_url = "http://localhost:8000/dashboard/predict"
predictions = requests.get(predict_url).json()
df_pred = pd.DataFrame(predictions)
fig_pred = px.line(df_pred, x="ds", y="yhat", title="Previsione della Gravità della Condizione nei Prossimi 30 Giorni")
st.plotly_chart(fig_pred, use_container_width=True)
