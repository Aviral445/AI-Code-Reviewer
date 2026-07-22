import unittest
from unittest.mock import patch, MagicMock
import os
import sys

# Import the review_code function from reviewer.py
from reviewer import review_code

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
    def test_review_code_exception(self, mock_openai_class):
        # Setup the mock to raise an exception
        mock_client = MagicMock()
        mock_openai_class.return_value = mock_client

        mock_client.chat.completions.create.side_effect = Exception("API Error")

        # Call the function
        result = review_code("def foo():\n  return 1", "dummy_api_key")

        # Assertions
        self.assertIn("Error connecting to OpenAI API", result)

if __name__ == "__main__":
    unittest.main()
