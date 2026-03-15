import sys
import os
import pytest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
sys.path.append(ROOT)

from main import app


@pytest.fixture
def client():
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("uploads/crops", exist_ok=True)
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client