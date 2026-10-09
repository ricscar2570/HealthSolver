import os

import pandas as pd
import plotly.express as px
import requests
import streamlit as st

API_BASE = os.getenv("HEALTHSOLVER_API_BASE_URL", "http://localhost:8000").rstrip("/")


def fetch_json(path: str):
    try:
        response = requests.get(f"{API_BASE}{path}", timeout=15)
        response.raise_for_status()
        return response.json(), None
    except requests.RequestException as exc:
        return None, str(exc)
    except ValueError as exc:
        return None, f"Invalid JSON response: {exc}"


st.set_page_config(page_title="HealthSolver Dashboard", layout="wide")
st.title("🔬 HealthSolver - AI Dashboard per Medici")
st.caption("Legacy/local dashboard. The browser-based Research Edition does not depend on this service.")

st.header("📊 Dati dei Pazienti")
data, data_error = fetch_json("/dashboard/data")
if data_error:
    st.warning(
        "Dashboard data endpoint unavailable. "
        "Enable the legacy analytics router and configure HEALTHSOLVER_API_BASE_URL if needed. "
        f"Details: {data_error}"
    )
else:
    df = pd.DataFrame(data or [])
    if df.empty:
        st.info("Nessun dato paziente disponibile.")
    else:
        if "condition_severity" in df.columns:
            fig = px.histogram(
                df,
                x="condition_severity",
                nbins=10,
                title="Distribuzione della Gravità delle Condizioni",
            )
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.warning("Campo condition_severity non presente nei dati restituiti.")

        st.subheader("Age Distribution")
        if "age" in df.columns:
            st.bar_chart(df["age"].value_counts().sort_index())
        else:
            st.warning("Campo age non presente nei dati restituiti.")

st.header("📈 Previsioni AI")
predictions, prediction_error = fetch_json("/dashboard/predict")
if prediction_error:
    st.warning(
        "Legacy predictive endpoint unavailable. "
        "Enable the legacy analytics router (and its optional forecasting dependency) to use this panel. "
        f"Details: {prediction_error}"
    )
else:
    df_pred = pd.DataFrame(predictions or [])
    if {"ds", "yhat"}.issubset(df_pred.columns):
        fig_pred = px.line(
            df_pred,
            x="ds",
            y="yhat",
            title="Previsione della Gravità della Condizione nei Prossimi 30 Giorni",
        )
        st.plotly_chart(fig_pred, use_container_width=True)
    else:
        st.info("Nessuna previsione temporale disponibile.")
