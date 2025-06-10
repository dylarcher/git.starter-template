import json
import argparse
import subprocess
import os

def apply_replacements(content: str, replacements: list) -> str:
    """
    Applies a list of replacements to the given content.
    Replacements are expected to be in the format provided by SARIF:
    {
        "offset": int,
        "deletedLength": int,
        "insertedContent": str
    }
    It's crucial to apply replacements carefully, typically from the end of the file
    to the beginning, or by reconstructing the string, to ensure offsets remain correct.
    This implementation reconstructs the string.
    """
    new_content_parts = []
    current_pos = 0
    # Sort replacements by offset to process them in order
    replacements.sort(key=lambda r: r['offset'])

    for rep in replacements:
        offset = rep['offset']
        deleted_length = rep['deletedLength']
        inserted_content = rep['insertedContent']

        # Add content before this replacement
        new_content_parts.append(content[current_pos:offset])
        # Add the inserted content
        new_content_parts.append(inserted_content)
        # Move current_pos past the replaced region
        current_pos = offset + deleted_length

    # Add any remaining content after the last replacement
    new_content_parts.append(content[current_pos:])
    return "".join(new_content_parts)

def ensure_git_config():
    """Ensures git user.name and user.email are set."""
    try:
        subprocess.run(["git", "config", "--global", "user.name"], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        print("Git user.name not set. Setting to 'github-actions[bot]'.")
        subprocess.run(["git", "config", "--global", "user.name", "github-actions[bot]"], check=True)

    try:
        subprocess.run(["git", "config", "--global", "user.email"], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        print("Git user.email not set. Setting to 'github-actions[bot]@users.noreply.github.com'.")
        subprocess.run(["git", "config", "--global", "user.email", "github-actions[bot]@users.noreply.github.com"], check=True)

def main():
    parser = argparse.ArgumentParser(description="Apply CodeQL suggested fixes from a SARIF file.")
    parser.add_argument("sarif_file", help="Path to the SARIF file.")
    args = parser.parse_args()

    try:
        with open(args.sarif_file, 'r', encoding='utf-8') as f:
            sarif_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: SARIF file not found at {args.sarif_file}")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {args.sarif_file}")
        return

    fixes_applied_count = 0
    ensure_git_config()

    for run in sarif_data.get("runs", []):
        for result in run.get("results", []):
            rule_id = result.get("ruleId", "UnknownRule")
            if "fixes" in result:
                for fix in result["fixes"]:
                    for change in fix.get("artifactChanges", []):
                        uri = change["artifactLocation"]["uri"]
                        # Make URI path relative to git repo root if it's absolute
                        # This assumes the script is run from the repo root or paths are relative
                        # A more robust solution might involve finding the repo root
                        if uri.startswith("file://"):
                            uri = uri[len("file://"):]

                        # Ensure path is OS-specific and relative
                        # This might need adjustment based on how URIs are stored in your SARIF
                        # and where the script is run from.
                        # For now, assume URIs are relative or absolute paths that can be found.
                        filepath = os.path.normpath(uri)

                        replacements = change.get("replacements", [])
                        if not replacements:
                            continue

                        print(f"Attempting to fix {filepath} for rule {rule_id}...")
                        try:
                            with open(filepath, 'r', encoding='utf-8') as f:
                                original_content = f.read()

                            modified_content = apply_replacements(original_content, replacements)

                            if original_content != modified_content:
                                with open(filepath, 'w', encoding='utf-8') as f:
                                    f.write(modified_content)

                                commit_message = f"Fix: {rule_id} - {uri}"
                                try:
                                    subprocess.run(["git", "add", filepath], check=True)
                                    subprocess.run(["git", "commit", "-m", commit_message], check=True)
                                    print(f"Committed fix for {filepath}")
                                    fixes_applied_count += 1
                                except subprocess.CalledProcessError as e:
                                    print(f"Error committing fix for {filepath}: {e}")
                                    # Optionally, try to reset the file if commit fails
                                    # subprocess.run(["git", "checkout", "--", filepath])
                            else:
                                print(f"No effective change for {filepath}, skipping commit.")

                        except FileNotFoundError:
                            print(f"Error: File not found at {filepath}. Skipping fix.")
                        except Exception as e:
                            print(f"Error processing fix for {filepath}: {e}")

    if fixes_applied_count > 0:
        print(f"\nSuccessfully applied {fixes_applied_count} fix(es).")
    else:
        print("\nNo fixes were applied.")

if __name__ == "__main__":
    main()
