import json

def load_json_line_by_line(file_path):
    """Generator to read a JSON file line by line."""
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

def analyze_sample(data, sample_size=100):
    if isinstance(data, dict):
        print(f"Object with {len(data)} key-value pairs")
        for key, value in data.items():
            print(f"- Key: '{key}'")
            analyze_value(value, 4)
            if sample_size and len(data) >= sample_size:
                break
    elif isinstance(data, list):
        print(f"Array with {len(data)} elements")
        for index, item in enumerate(data[:sample_size]):
            print(f"- Element [{index}]")
            analyze_value(item, 4)
    else:
        analyze_value(data, 0)

def analyze_value(value, indent):
    indent_space = ' ' * indent
    if isinstance(value, dict):
        print(f"{indent_space}Object with {len(value)} key-value pairs")
        for key, val in value.items():
            print(f"{indent_space}- Key: '{key}'")
            analyze_value(val, indent + 4)
    elif isinstance(value, list):
        print(f"{indent_space}Array with {len(value)} elements")
        for index, item in enumerate(value):
            print(f"{indent_space}- Element [{index}]")
            analyze_value(item, indent + 4)
    else:
        print(f"{indent_space}Value: {value} ({type(value).__name__})")

def explain_json_structure(file_path, sample_size=100, chunk_size=1024):
    print(f"Analyzing JSON file: {file_path}\n")
    buffer = ""
    parsed_count = 0
    line_count = 0
    max_lines = 10000  # Maximum number of lines to read to avoid infinite loops

    for line in load_json_line_by_line(file_path):
        line_count += 1
        buffer += line
        try:
            data = json.loads(buffer)
            analyze_sample(data, sample_size)
            parsed_count += 1
            if parsed_count >= sample_size:
                break
            buffer = ""  # Reset buffer if parsing is successful
        except json.JSONDecodeError:
            if line_count > max_lines:
                print("Reached maximum number of lines to read without finding valid JSON structure.")
                break
            continue  # Continue reading more lines if not yet valid JSON

    print("\nAnalysis Complete")

# Specify the path to your JSON file
json_file_path = 'beaches.json'

# Run the explanation
explain_json_structure(json_file_path, sample_size=5)
