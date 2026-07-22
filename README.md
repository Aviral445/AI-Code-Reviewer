# AI-Code-Reviewer

A simple command-line script that utilizes the OpenAI API to review your code, provide feedback, and suggest fixes.

## Prerequisites

- Python 3.7 or higher
- An OpenAI API key

## Installation

1. Clone this repository (or download the files).
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Setup

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

*Note: On Windows PowerShell, use `$env:OPENAI_API_KEY="your-api-key-here"`*

## Usage

Run the script by passing the path to the file you want to review:

```bash
python reviewer.py <path_to_your_code_file>
```

### Example

```bash
python reviewer.py my_script.py
```

The script will read the file, send its contents to OpenAI, and print out the code review along with the corrected code directly to your terminal.

### Automatic Fixes

You can also use the `--fix` flag to have the script automatically apply the suggested fixes to your file:

```bash
python reviewer.py my_script.py --fix
```
