from pipeline.stages import Stage, Status


def test_stage_order():
    assert list(Stage)[0] == Stage.DISCOVERED
    assert list(Stage)[-1] == Stage.PUBLISHABLE


def test_statuses():
    assert Status.PERMANENT_FAILED.value == "permanent_failed"
