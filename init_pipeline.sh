#!/bin/bash
echo "🚀 Avvio della pipeline..."

python3 backend/pipeline_runner.py
streamlit run dashboard/dashboard.py
