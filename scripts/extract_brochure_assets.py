from __future__ import annotations

import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
PDF_URL = "https://www.metro.ed.jp/meguro-h/assets/%E5%AD%A6%E6%A0%A1%E6%A1%88%E5%86%85%E3%83%91%E3%83%B3%E3%83%95%E3%83%AC%E3%83%83%E3%83%88%202027.pdf"
PAGE_SIZE = (1191, 1684)

# Coordinates were selected against the 16-page School Guide 2027 supplied for this project.
# They intentionally omit surrounding brochure copy and QR codes and retain the photographic scene.
CROPS = {
    "hero-walk.webp": {
        "page": 16,
        "box": (0, 355, 620, 1000),
        "size": (520, 541),
    },
    "explore-walk.webp": {
        "page": 10,
        "box": (355, 460, 730, 720),
        "size": (375, 260),
    },
    "students-bench.webp": {
        "page": 10,
        "box": (672, 8, 1190, 360),
        "size": (518, 352),
    },
    "learning-inquiry.webp": {
        "page": 11,
        "box": (90, 670, 575, 825),
        "size": (485, 155),
    },
    "energy-sports.webp": {
        "page": 12,
        "box": (595, 65, 1180, 515),
        "size": (585, 450),
    },
}


def render_page(pdf: Path, page: int, work: Path) -> Path:
    prefix = work / f"page-{page:02d}"
    subprocess.run(
        [
            "pdftoppm",
            "-f",
            str(page),
            "-l",
            str(page),
            "-singlefile",
            "-png",
            "-scale-to-x",
            str(PAGE_SIZE[0]),
            "-scale-to-y",
            str(PAGE_SIZE[1]),
            str(pdf),
            str(prefix),
        ],
        check=True,
    )
    return prefix.with_suffix(".png")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        work = Path(td)
        pdf = work / "school-guide-2027.pdf"
        urllib.request.urlretrieve(PDF_URL, pdf)

        rendered: dict[int, Path] = {}
        for spec in CROPS.values():
            page = int(spec["page"])
            if page not in rendered:
                rendered[page] = render_page(pdf, page, work)

        for name, spec in CROPS.items():
            with Image.open(rendered[int(spec["page"])]) as page_img:
                crop = page_img.convert("RGB").crop(spec["box"])
                target_size = tuple(spec["size"])
                if crop.size != target_size:
                    crop = crop.resize(target_size, Image.Resampling.LANCZOS)
                crop.save(OUT / name, "WEBP", quality=82, method=6)
                print(f"wrote {name}: {target_size[0]}x{target_size[1]}")


if __name__ == "__main__":
    if shutil.which("pdftoppm") is None:
        raise SystemExit("pdftoppm is required (install poppler-utils)")
    main()
