import re

# Strip ASCII control characters
CONTROL_CHARS = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")

# Common jailbreak / role-override markers.
OVERRIDE_PATTERNS = [
    re.compile(r"ignore (all|any|previous|prior|the above)[^.\n]*instructions", re.IGNORECASE),
    re.compile(r"disregard (all|any|previous|prior|the above)[^.\n]*", re.IGNORECASE),
    re.compile(r"you are now\b", re.IGNORECASE),
    re.compile(r"system prompt", re.IGNORECASE),
    re.compile(r"\bBEGIN\s+SYSTEM\b", re.IGNORECASE),
    re.compile(r"<\s*\/?\s*(system|assistant|user)\s*>", re.IGNORECASE),
]


def sanitize_prompt(input_text: str, max_length: int = 500) -> str:
    """
    Sanitize free-text for safe inclusion in a prompt.
    Strips control characters, overrides, and collapses whitespace.
    """
    if not isinstance(input_text, str):
        return ""

    text = input_text
    text = CONTROL_CHARS.sub(" ", text)

    for pattern in OVERRIDE_PATTERNS:
        text = pattern.sub("[filtered]", text)

    # Collapse runs of whitespace
    text = re.sub(r"\s+", " ", text).strip()

    if len(text) > max_length:
        text = text[:max_length]

    return text
