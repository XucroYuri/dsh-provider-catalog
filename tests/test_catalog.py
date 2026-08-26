import json
import pathlib
import tempfile
import unittest

from dsh_provider_catalog import load_cache, save_cache

ENTRIES = [
    {"provider": "deepseek", "id": "deepseek-v4-pro", "name": "DeepSeek V4 Pro"},
    {"provider": "zai-coding-plan", "id": "glm-5.3", "name": "GLM-5.3"},
]


class CatalogTests(unittest.TestCase):
    def test_save_and_load_roundtrip(self):
        with tempfile.TemporaryDirectory() as td:
            home = pathlib.Path(td)
            save_cache(home, ENTRIES)
            self.assertEqual(load_cache(home), ENTRIES)

    def test_load_missing_returns_empty(self):
        with tempfile.TemporaryDirectory() as td:
            self.assertEqual(load_cache(pathlib.Path(td)), [])

    def test_load_malformed_returns_empty(self):
        with tempfile.TemporaryDirectory() as td:
            home = pathlib.Path(td)
            p = home / "cache" / "model-catalog.json"
            p.parent.mkdir(parents=True)
            p.write_text("{bad json")
            self.assertEqual(load_cache(home), [])


if __name__ == "__main__":
    unittest.main()
