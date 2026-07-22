import os
import sys
import argparse
from openai import OpenAI

def review_code(file_content, api_key):
    """
    Sends the code to OpenAI for review and returns the review along with fixed code.
    """
    client = OpenAI(api_key=api_key)

    prompt = f"""
    You are an expert software engineer and code reviewer.
    Review the following code, provide comments on how to improve it,
    point out any bugs, and provide the fixed code.

    Code to review:
    ```
    {file_content}
    ```
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful code review assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to OpenAI API: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description="AI Code Reviewer - Review your code using OpenAI.")
    parser.add_argument("file", help="Path to the file you want to review")
    parser.add_argument("--fix", action="store_true", help="Apply the fixed code directly to the file")

    args = parser.parse_args()
    file_path = args.file
    fix_in_place = args.fix

    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        sys.exit(1)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("Please set it using: export OPENAI_API_KEY='your-api-key'")
        sys.exit(1)

    print(f"Reading file '{file_path}'...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        sys.exit(1)

    print("Sending code to OpenAI for review...")
    review = review_code(content, api_key)

    if fix_in_place:
        # Extract the fixed code block if possible
        import re
        # Look for a code block containing the fixed code
        # We assume the reviewer will output fixed code inside ```lang ... ``` or just ``` ... ``` blocks
        matches = re.findall(r"```(?:[a-zA-Z0-9+#]+)?\n(.*?)\n```", review, re.DOTALL)

        if matches:
            # We take the longest code block assuming it's the full fixed code
            fixed_code = max(matches, key=len)
            try:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(fixed_code)
                print(f"✅ Successfully applied fixed code to '{file_path}'")
                print("Note: Please review the changes as AI suggestions may not be perfect.")
            except Exception as e:
                print(f"Error writing fixed code to file: {str(e)}")
        else:
            print("Could not automatically extract fixed code from the review.")
            print("\n" + "="*50)
            print("REVIEW RESULTS")
            print("="*50 + "\n")
            print(review)
            print("\n" + "="*50 + "\n")
    else:
        print("\n" + "="*50)
        print("REVIEW RESULTS")
        print("="*50 + "\n")
        print(review)
        print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    main()
