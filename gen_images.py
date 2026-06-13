#!/usr/bin/env python3
"""Generate original food/ambiance imagery via OpenAI gpt-image-1. Saves JPEGs to assets/img/.
Uses curl (system cert store) for the HTTPS call. Idempotent: skips existing files."""
import base64, json, os, subprocess, time

KEY = open(os.path.expanduser("~/.openai_api_key")).read().strip()
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "img")
LOG = os.path.join(ROOT, "gen_images.log")
os.makedirs(OUT, exist_ok=True)

STYLE = ("Photorealistic, premium editorial food photography, warm natural golden light, "
         "shallow depth of field, rich appetizing colors, rustic-elegant Italian trattoria mood, "
         "deep bordeaux-wine and warm gold accents in the styling. "
         "No text, no logos, no brand names, no signage, no watermarks, no readable lettering, no people's faces in focus.")

JOBS = [
    ("hero", "1536x1024",
     "Overhead hero shot of a beautifully set rustic Italian dinner table on dark wood: a wood-fired "
     "margherita pizza, a bowl of fresh tagliatelle with ragu, a glass and bottle of deep red wine, "
     "olive oil, fresh basil, parmesan, warm candlelight. Inviting, abundant, romantic Italian ristorante feast."),
    ("pizza", "1024x1024",
     "Close-up of an authentic wood-fired Neapolitan margherita pizza fresh from the oven on a rustic "
     "wooden board, bubbling mozzarella, fresh basil leaves, slightly charred crust, drizzle of olive oil, "
     "warm light, steam rising. Mouth-watering and crisp."),
    ("pasta", "1024x1024",
     "Elegant plate of fresh handmade tagliatelle pasta with rich tomato and basil sauce, grated parmesan, "
     "a fork twirling strands, a glass of red wine softly blurred behind, white plate on a dark wooden table, "
     "warm restaurant ambiance."),
    ("antipasti", "1024x1024",
     "Rustic Italian antipasti sharing board: prosciutto, salami, marinated olives, sun-dried tomatoes, "
     "fresh mozzarella, grilled vegetables, ciabatta, drizzled olive oil, on a slate and wood board, "
     "warm cozy light."),
    ("dessert", "1024x1024",
     "Classic homemade tiramisu in a glass dusted with cocoa, an espresso cup and a small glass of amaretto "
     "beside it, on a dark elegant table, soft warm light, dusting of cocoa, fine-dining dessert presentation."),
    ("wine", "1024x1024",
     "Two glasses of deep bordeaux-red Italian wine being toasted across a candlelit dinner table, "
     "warm bokeh background of a cozy restaurant, an open bottle, romantic intimate evening atmosphere, "
     "rich red and gold tones."),
    ("ambiance", "1536x1024",
     "Warm inviting interior of an elegant Italian restaurant in the evening: tables set with white "
     "linen and a single rose, soft pendant and candle lighting, deep bordeaux and warm wood tones, "
     "wine glasses catching the light, cozy welcoming dining room. No people in focus."),
    ("terrace", "1536x1024",
     "Cozy outdoor restaurant terrace on a warm summer evening, wooden tables under string lights and "
     "leafy greenery, set for dinner with wine glasses, surrounded by a relaxed garden setting near a "
     "sports club, golden hour glow. Inviting al fresco Italian dining."),
    ("chef", "1024x1536",
     "An Italian chef's hands plating a beautiful pasta dish in a professional kitchen, sprinkling fresh "
     "herbs, steam rising, focused craftsmanship, warm kitchen light, shallow depth of field. "
     "Authentic handmade Italian cooking."),
]


def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f:
        f.write(line + "\n")


def already(name):
    return os.path.exists(os.path.join(OUT, name + ".jpg"))


def generate(name, size, prompt):
    if already(name):
        log(f"skip {name} (exists)")
        return
    full = prompt + " " + STYLE
    payload = json.dumps({
        "model": "gpt-image-1",
        "prompt": full,
        "size": size,
        "quality": "high",
        "n": 1,
    })
    log(f"generating {name} ({size}) ...")
    try:
        res = subprocess.run(
            ["curl", "-s", "-X", "POST", "https://api.openai.com/v1/images/generations",
             "-H", f"Authorization: Bearer {KEY}",
             "-H", "Content-Type: application/json",
             "-d", payload],
            capture_output=True, text=True, timeout=600)
        data = json.loads(res.stdout)
        if "data" not in data:
            log(f"ERROR {name}: {res.stdout[:300]}")
            return
        b64 = data["data"][0]["b64_json"]
        raw = base64.b64decode(b64)
        # gpt-image-1 returns PNG; convert to JPEG to keep the repo light
        tmp = os.path.join(OUT, name + ".png")
        with open(tmp, "wb") as f:
            f.write(raw)
        try:
            from PIL import Image
            im = Image.open(tmp).convert("RGB")
            im.save(os.path.join(OUT, name + ".jpg"), "JPEG", quality=86, optimize=True)
            os.remove(tmp)
        except Exception as e:
            os.rename(tmp, os.path.join(OUT, name + ".jpg"))
        log(f"saved {name}.jpg")
    except Exception as e:
        log(f"EXC {name}: {e}")


if __name__ == "__main__":
    log("=== image generation start ===")
    for job in JOBS:
        generate(*job)
    log("=== image generation done ===")
