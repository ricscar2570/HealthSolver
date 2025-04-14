from backend.pipeline_runner import run_pipeline

def test_pipeline_runs():
    try:
        run_pipeline()
    except Exception as e:
        assert False, f"Pipeline failed: {e}"
