#!/usr/bin/env python3
"""Generate 21 product images via z-ai image CLI, 2 in parallel, 3s stagger, retry up to 2x."""
import subprocess, time, sys, os

OUT = "/home/z/my-project/public/generated"
SIZE = "1024x1024"
MAX_RETRIES = 2  # total attempts = 1 + 2 retries = 3

# (filename, prompt) pairs
ITEMS = [
    ("wirebeat-100.png",
     "Professional product photography of basic black wired in-ear earphones with a slim cable and small in-line microphone, two earbuds lying neatly beside each other on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("wirebeat-pro.png",
     "Professional product photography of premium black wired in-ear earphones with a braided cable and metal housing, two earbuds with noise-isolating silicone tips lying neatly on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("flexwire.png",
     "Professional product photography of a black neckband-style wired earphone with a flexible neckband connecting two earbuds, lying neatly coiled on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("studiobass-h1.png",
     "Professional product photography of black wired over-ear headphones with large cushioned earcups and a thick headband, folded slightly and standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("clearsound-h2.png",
     "Professional product photography of silver and grey wired over-ear headphones with soft foam padding and an adjustable headband, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("beatpro-h3.png",
     "Professional product photography of premium matte black wired over-ear DJ-style headphones with large earcups and a sturdy headband, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, high-end e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("airbass-x1.png",
     "Professional product photography of black wireless over-ear Bluetooth headphones with cushioned earcups and a foldable design, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("neosound-h4.png",
     "Professional product photography of dark grey wireless over-ear Bluetooth headphones with memory foam earcups and a sleek minimalist headband, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("maxwave-h5.png",
     "Professional product photography of premium matte black wireless over-ear Bluetooth headphones with a premium matte finish and large earcups, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, flagship e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("boommini-s1.png",
     "Professional product photography of a small compact pocket-sized portable Bluetooth speaker in matte black, cylindrical shape with a speaker grille, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("boombox-s2.png",
     "Professional product photography of a rectangular portable Bluetooth speaker in dark grey with a large speaker grille and a small LED indicator, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("partyblast-s3.png",
     "Professional product photography of a colorful portable party Bluetooth speaker in black with RGB LED light rings around the speakers, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("megaboom-s4.png",
     "Professional product photography of a large rugged outdoor portable Bluetooth speaker in black with a heavy-duty rubber casing and large driver, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("pulsetower-t1.png",
     "Professional product photography of a tall slim tower-style Bluetooth speaker in matte black with vertical driver lines, standing upright on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("echocube-t2.png",
     "Professional product photography of a compact cube-shaped smart Bluetooth speaker in light grey with a fabric mesh finish, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("sonicbar-sb1.png",
     "Professional product photography of a sleek black Bluetooth soundbar for TV with a long horizontal bar shape and a metal grille, lying flat on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("gamepulse-g1.png",
     "Professional product photography of a black wired gaming headset with large earcups, RGB accent lighting on the earcups, and a boom microphone, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("gamex-pro-g2.png",
     "Professional product photography of a premium black wireless gaming headset with large cushioned earcups, a flexible boom microphone, and subtle blue accents, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("audiolink-a1.png",
     "Professional product photography of a small white 3.5mm to USB Type-C audio adapter cable, lying neatly on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("sounddock-d1.png",
     "Professional product photography of a compact desktop Bluetooth speaker dock in matte black with two small speaker drivers on a base, standing on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
    ("basstube-bt1.png",
     "Professional product photography of a portable cylindrical subwoofer Bluetooth speaker in black with a large bass driver on one end and a rugged body, standing upright on a pure white seamless background, centered, soft studio lighting from top-left, subtle soft shadow underneath, ultra sharp focus throughout, f/8 aperture, photorealistic, high resolution, e-commerce catalog photo, shot on Canon EOS R5 with 100mm macro lens, real photograph, NOT an illustration, NOT a 3D render, NOT a painting, no cartoon style, no text, no watermark"),
]

def gen_one(filename, prompt):
    out_path = os.path.join(OUT, filename)
    # Skip if already exists with non-trivial size (resumability)
    if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
        print(f"  [SKIP-EXISTS] {filename} ({os.path.getsize(out_path)} bytes)")
        return True
    for attempt in range(1, MAX_RETRIES + 2):  # 1, 2, 3
        try:
            r = subprocess.run(
                ["z-ai", "image", "-p", prompt, "-o", out_path, "-s", SIZE],
                capture_output=True, text=True, timeout=90,
            )
            if r.returncode == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
                print(f"  [OK] {filename} (attempt {attempt}, {os.path.getsize(out_path)} bytes)")
                return True
            else:
                print(f"  [FAIL] {filename} attempt {attempt}: rc={r.returncode}")
                if r.stderr: print(f"    stderr: {r.stderr[:300]}")
                if r.stdout: print(f"    stdout: {r.stdout[:300]}")
        except subprocess.TimeoutExpired:
            print(f"  [FAIL] {filename} attempt {attempt}: TIMEOUT")
        except Exception as e:
            print(f"  [FAIL] {filename} attempt {attempt}: {e}")
        time.sleep(2)
    return False

def main():
    os.makedirs(OUT, exist_ok=True)
    total = len(ITEMS)
    failed = []
    print(f"Generating {total} images in batches of 2 with 3s stagger...\n")
    for i in range(0, total, 2):
        batch = ITEMS[i:i+2]
        print(f"--- Batch {i//2 + 1} (items {i+1}-{i+len(batch)}) ---")
        # Launch in parallel via threads
        import threading
        results = {}
        def worker(idx, fn, p):
            results[idx] = gen_one(fn, p)
        threads = []
        for j, (fn, p) in enumerate(batch):
            t = threading.Thread(target=worker, args=(j, fn, p))
            t.start()
            threads.append(t)
        for t in threads:
            t.join()
        for j, (fn, p) in enumerate(batch):
            if not results.get(j, False):
                failed.append(fn)
        # 2s stagger between batches (skip after the last)
        if i + 2 < total:
            time.sleep(2)
    print("\n=== SUMMARY ===")
    print(f"Total: {total}")
    print(f"Succeeded: {total - len(failed)}")
    print(f"Failed: {len(failed)}")
    if failed:
        print("Failed files:")
        for f in failed:
            print(f"  - {f}")
    return 0 if not failed else 1

if __name__ == "__main__":
    sys.exit(main())
