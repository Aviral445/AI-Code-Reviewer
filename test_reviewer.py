import unittest
from unittest.mock import patch, MagicMock
import os
import sys

# Import functions from reviewer.py
from reviewer import review_code, get_files_from_path

class TestReviewer(unittest.TestCase):

    @patch("reviewer.OpenAI")
    def test_review_code(self, mock_openai_class):
        # Setup the mock to return a specific response
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Mocked review response"
        mock_client.chat.completions.create.return_value = mock_response

        # Call the function
        result = review_code("def foo():\n  return 1", "dummy_api_key")

        # Assertions
        self.assertEqual(result, "Mocked review response")
        mock_client.chat.completions.create.assert_called_once()

        # Check that the model parameter is as expected
        kwargs = mock_client.chat.completions.create.call_args.kwargs
        self.assertEqual(kwargs['model'], "gpt-3.5-turbo")
        self.assertIn("def foo():", kwargs['messages'][1]['content'])

    @patch("reviewer.OpenAI")
    def test_review_code_custom_model(self, mock_openai_class):
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Mocked custom model response"
        mock_client.chat.completions.create.return_value = mock_response

        # Call the function with a custom model
        result = review_code("def bar():\n  pass", "dummy_api_key", model="gpt-4")

        self.assertEqual(result, "Mocked custom model response")

        kwargs = mock_client.chat.completions.create.call_args.kwargs
        self.assertEqual(kwargs['model'], "gpt-4")

    @patch("reviewer.OpenAI")
    def test_review_code_exception(self, mock_openai_class):
        # Setup the mock to raise an exception
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_client.chat.completions.create.side_effect = Exception("API Error")

        # Call the function
        result = review_code("def foo():\n  return 1", "dummy_api_key")

        # Assertions
        self.assertIn("Error connecting to OpenAI API", result)

    @patch("os.path.isfile")
    @patch("os.path.isdir")
    @patch("os.walk")
    def test_get_files_from_path(self, mock_walk, mock_isdir, mock_isfile):
        # Test with a single file
        mock_isfile.return_value = True
        mock_isdir.return_value = False
        self.assertEqual(get_files_from_path("script.py"), ["script.py"])

        # Test with a directory
        mock_isfile.return_value = False
        mock_isdir.return_value = True
        mock_walk.return_value = [
            ("src", ("subdir",), ("main.py", "utils.py", "readme.txt")),
            ("src/subdir", (), ("helper.py",)),
        ]

        files = get_files_from_path("src")
        self.assertIn(os.path.join("src", "main.py"), files)
        self.assertIn(os.path.join("src", "utils.py"), files)
        self.assertIn(os.path.join("src", "subdir", "helper.py"), files)
        self.assertNotIn(os.path.join("src", "readme.txt"), files) # Should only include .py files

if __name__ == "__main__":
    unittest.main()
