import os
import sys
import argparse
from openai import OpenAI

def review_code(file_content, api_key, model="gpt-3.5-turbo"):
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
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful code review assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to OpenAI API: {str(e)}"

def process_file(file_path, api_key, fix_in_place, model):
    """
    Process a single file: read, review, and optionally fix.
    """
    print(f"\nProcessing file: '{file_path}'...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return

    print(f"Sending code from {os.path.basename(file_path)} to OpenAI for review...")
    review = review_code(content, api_key, model)

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
            print(f"Could not automatically extract fixed code from the review for {file_path}.")
            print("\n" + "="*50)
            print(f"REVIEW RESULTS FOR {os.path.basename(file_path)}")
            print("="*50 + "\n")
            print(review)
            print("\n" + "="*50 + "\n")
    else:
        print("\n" + "="*50)
        print(f"REVIEW RESULTS FOR {os.path.basename(file_path)}")
        print("="*50 + "\n")
        print(review)
        print("\n" + "="*50 + "\n")

def get_files_from_path(target_path):
    """
    Returns a list of Python files from the given path (file or directory).
    """
    files = []
    if os.path.isfile(target_path):
        files.append(target_path)
    elif os.path.isdir(target_path):
        for root, _, filenames in os.walk(target_path):
            for filename in filenames:
                if filename.endswith(".py"): # Defaulting to reviewing python files in directory mode
                    files.append(os.path.join(root, filename))
    return files

def main():
    parser = argparse.ArgumentParser(description="AI Code Reviewer - Review your code using OpenAI.")
    parser.add_argument("paths", nargs='+', help="File(s) or directory paths to review")
    parser.add_argument("--fix", action="store_true", help="Apply the fixed code directly to the file")
    parser.add_argument("--model", type=str, default="gpt-3.5-turbo", help="The OpenAI model to use (default: gpt-3.5-turbo)")

    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("Please set it using: export OPENAI_API_KEY='your-api-key'")
        sys.exit(1)

    all_files = []
    for path in args.paths:
        if not os.path.exists(path):
            print(f"Warning: Path '{path}' does not exist, skipping.")
            continue
        all_files.extend(get_files_from_path(path))

    # Remove duplicates
    all_files = list(set(all_files))

    if not all_files:
        print("No valid files found to review.")
        sys.exit(1)

    print(f"Found {len(all_files)} file(s) to review.")
    for file_path in all_files:
        process_file(file_path, api_key, args.fix, args.model)

if __name__ == "__main__":
    main()
