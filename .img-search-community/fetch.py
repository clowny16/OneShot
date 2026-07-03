#!/usr/bin/env python3
"""Fetch community/blog images via z-ai image-search CLI.

Runs searches in parallel pairs (max 2) with a 3s stagger between batches.
Each query has a primary + simpler fallback variant. Picks the first-result
`original_url` from each search's JSON response.
"""
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# (key, primary_query, fallback_query)
QUERIES = [
    ("gallery_1_earbuds_outdoors",
     "young person wearing white wireless earbuds smiling outdoors city street lifestyle photograph",
     "person wearing wireless earbuds outdoors smiling photograph"),
    ("gallery_2_headphones_cafe",
     "woman wearing over-ear headphones working from home cafe lifestyle photograph",
     "woman wearing headphones in cafe working photograph"),
    ("gallery_3_running_park",
     "man running with wireless earbuds in park morning exercise lifestyle photograph",
     "runner wearing earbuds in park morning photograph"),
    ("gallery_4_speaker_beach",
     "group of friends listening to portable speaker at beach party lifestyle photograph",
     "friends with portable speaker at beach photograph"),
    ("gallery_5_meditation",
     "person meditating with earbuds in quiet room peaceful lifestyle photograph",
     "person meditating with earbuds peaceful photograph"),
    ("gallery_6_student_library",
     "student studying with headphones in library focused lifestyle photograph",
     "student with headphones studying in library photograph"),
    ("gallery_7_gamer_desk",
     "gamer wearing gaming headset at desk setup RGB lighting lifestyle photograph",
     "gamer wearing gaming headset at desk photograph"),
    ("gallery_8_couple_earbuds",
     "couple sharing earbuds listening to music together cozy lifestyle photograph",
     "couple sharing earbuds listening to music photograph"),
    ("blog_1_flat_lay",
     "flat lay of wireless earbuds and accessories on desk minimal aesthetic photograph",
     "wireless earbuds flat lay on desk photograph"),
    ("blog_2_sound_waves",
     "sound waves audio frequency visualization abstract clean photograph",
     "audio sound waves abstract visualization photograph"),
    ("blog_3_cleaning_earbuds",
     "person cleaning earbuds with cloth care guide photograph",
     "cleaning earbuds with cloth photograph"),
]

def run_search(query: str) -> dict | None:
    """Run a single image-search and return parsed JSON dict, or None on failure."""
    try:
        proc = subprocess.run(
            ["z-ai", "image-search", "-q", query, "--count", "3", "--gl", "us", "--no-rank"],
            capture_output=True, text=True, timeout=120,
        )
    except subprocess.TimeoutExpired:
        print(f"  [timeout] {query[:60]}...", file=sys.stderr)
        return None
    out = proc.stdout
    # CLI prints status lines (🚀, 🔎, ✅) before the JSON. Find the JSON object.
    m = re.search(r"\{[\s\S]*\}\s*$", out)
    if not m:
        print(f"  [no-json] {query[:60]}... stdout tail: {out[-200:]}", file=sys.stderr)
        return None
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError as e:
        print(f"  [json-error] {query[:60]}... {e}", file=sys.stderr)
        return None

def first_url(data: dict) -> str | None:
    if not data or not data.get("success"):
        return None
    results = data.get("results") or []
    if not results:
        return None
    return results[0].get("original_url")

def fetch_one(key: str, primary: str, fallback: str) -> tuple[str, str | None, dict | None]:
    """Try primary, then fallback. Returns (key, url, raw_json)."""
    print(f"[start] {key}: {primary[:70]}...", file=sys.stderr)
    data = run_search(primary)
    url = first_url(data) if data else None
    if url:
        print(f"[ok]    {key} -> {url}", file=sys.stderr)
        return key, url, data
    # Retry primary once after a short wait
    time.sleep(2)
    data = run_search(primary)
    url = first_url(data) if data else None
    if url:
        print(f"[ok-r1] {key} -> {url}", file=sys.stderr)
        return key, url, data
    # Fallback to simpler query
    print(f"[fallback] {key}: {fallback[:70]}...", file=sys.stderr)
    time.sleep(2)
    data = run_search(fallback)
    url = first_url(data) if data else None
    if url:
        print(f"[ok-fb] {key} -> {url}", file=sys.stderr)
        return key, url, data
    # One more retry on fallback
    time.sleep(3)
    data = run_search(fallback)
    url = first_url(data) if data else None
    if url:
        print(f"[ok-fb2] {key} -> {url}", file=sys.stderr)
        return key, url, data
    print(f"[FAIL]  {key} — no URL after all retries", file=sys.stderr)
    return key, None, data

def main():
    results: dict[str, str | None] = {}
    raw: dict[str, dict | None] = {}
    # Process in batches of 2 in parallel, 3s stagger between batches.
    BATCH = 2
    STAGGER = 3
    for i in range(0, len(QUERIES), BATCH):
        batch = QUERIES[i:i + BATCH]
        with ThreadPoolExecutor(max_workers=BATCH) as ex:
            futures = {ex.submit(fetch_one, k, p, f): k for (k, p, f) in batch}
            for fut in as_completed(futures):
                key, url, data = fut.result()
                results[key] = url
                raw[key] = data
        if i + BATCH < len(QUERIES):
            print(f"\n--- batch boundary, sleeping {STAGGER}s ---\n", file=sys.stderr)
            time.sleep(STAGGER)
    # Persist raw JSON for debugging
    with open("/home/z/my-project/.img-search-community/raw.json", "w") as f:
        json.dump(raw, f, indent=2)
    # Persist extracted URLs
    with open("/home/z/my-project/.img-search-community/urls.json", "w") as f:
        json.dump(results, f, indent=2)
    # Summary
    ok = sum(1 for v in results.values() if v)
    print(f"\n=== SUMMARY: {ok}/{len(results)} URLs collected ===", file=sys.stderr)
    for k in results:
        print(f"  {k}: {results[k]}", file=sys.stderr)
    return 0 if ok == len(results) else 1

if __name__ == "__main__":
    sys.exit(main())
