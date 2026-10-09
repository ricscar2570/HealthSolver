import backend.pipeline_runner as pipeline_runner


class _DummyQuery:
    def count(self):
        return 3

    def scalar(self):
        return 52.4


class _DummySession:
    def query(self, *_args, **_kwargs):
        return _DummyQuery()

    def close(self):
        self.closed = True


def test_pipeline_runs_with_isolated_dependencies(monkeypatch):
    """The legacy pipeline orchestration must not require local DB/Redis services in unit tests."""
    calls = {"trained": False, "cached": None}

    def fake_train_model():
        calls["trained"] = True

    def fake_cache_json(key, obj):
        calls["cached"] = (key, obj)

    monkeypatch.setattr(pipeline_runner, "train_model", fake_train_model)
    monkeypatch.setattr(pipeline_runner, "SessionLocal", _DummySession)
    monkeypatch.setattr(pipeline_runner, "cache_json", fake_cache_json)

    pipeline_runner.run_pipeline()

    assert calls["trained"] is True
    assert calls["cached"] == (
        "stats",
        {
            "total_patients": 3,
            "average_age": 52.4,
            "notes": "legacy pipeline run completed successfully",
        },
    )
