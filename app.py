import sys
import importlib.util
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")

sys.path.insert(0, str(BACKEND_DIR))

backend_spec = importlib.util.spec_from_file_location(
    "legallens_backend",
    BACKEND_DIR / "app" / "__init__.py",
    submodule_search_locations=[str(BACKEND_DIR / "app")],
)
backend_module = importlib.util.module_from_spec(backend_spec)
sys.modules["legallens_backend"] = backend_module
backend_spec.loader.exec_module(backend_module)


app = backend_module.create_app()


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
