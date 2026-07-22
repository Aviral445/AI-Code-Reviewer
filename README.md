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

Run the script by passing one or more files or directory paths you want to review:

```bash
python reviewer.py <path_1> <path_2> ...
```

When you provide a directory, the script will automatically find and review all `.py` files within it.

### Examples

**Review a single file:**
```bash
python reviewer.py my_script.py
```

**Review multiple files and directories:**
```bash
python reviewer.py script1.py script2.py src/
```

### Automatic Fixes

You can use the `--fix` flag to have the script automatically apply the suggested fixes directly to your files:

```bash
python reviewer.py my_script.py --fix
```

### Choosing the Model

By default, the script uses `gpt-3.5-turbo`. You can specify a different OpenAI model (like `gpt-4`) using the `--model` flag:

```bash
python reviewer.py my_script.py --model gpt-4
```
