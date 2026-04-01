from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from html import escape


@dataclass
class FileCoverage:
    path: str
    hit: int = 0
    total: int = 0

    @property
    def pct(self) -> float:
        if self.total == 0:
            return 0.0
        return (self.hit * 100.0) / self.total


def parse_lcov(lcov_path: Path) -> list[FileCoverage]:
    files: list[FileCoverage] = []
    current: FileCoverage | None = None

    for raw in lcov_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw.strip()
        if line.startswith("SF:"):
            if current is not None:
                files.append(current)
            current = FileCoverage(path=line[3:])
        elif line.startswith("DA:") and current is not None:
            try:
                _, rest = line.split(":", 1)
                _, hits = rest.split(",", 1)
                current.total += 1
                if int(hits) > 0:
                    current.hit += 1
            except ValueError:
                continue
        elif line == "end_of_record":
            if current is not None:
                files.append(current)
                current = None

    if current is not None:
        files.append(current)

    return files


def color_for(pct: float) -> str:
    if pct >= 85:
        return "#138a36"
    if pct >= 70:
        return "#b07d00"
    return "#b42318"


def write_html(files: list[FileCoverage], output_path: Path) -> None:
    files = [f for f in files if f.total > 0]
    files.sort(key=lambda f: f.pct)

    total_hit = sum(f.hit for f in files)
    total_lines = sum(f.total for f in files)
    overall = (total_hit * 100.0 / total_lines) if total_lines else 0.0

    rows = []
    for f in files:
        pct = f.pct
        rows.append(
            "<tr>"
            f"<td>{escape(f.path)}</td>"
            f"<td>{f.hit}</td>"
            f"<td>{f.total}</td>"
            f"<td style='font-weight:700;color:{color_for(pct)}'>{pct:.2f}%</td>"
            "</tr>"
        )

    html = f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>CareConnect Coverage Report</title>
  <style>
    body {{ font-family: Segoe UI, Arial, sans-serif; margin: 24px; background: #f7f8fa; color: #111827; }}
    .card {{ background: white; border-radius: 12px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,.06); margin-bottom: 16px; }}
    h1 {{ margin: 0 0 8px; font-size: 24px; }}
    .meta {{ color: #4b5563; }}
    .big {{ font-size: 28px; font-weight: 800; color: {color_for(overall)}; }}
    table {{ width: 100%; border-collapse: collapse; background: white; }}
    th, td {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }}
    th {{ background: #f3f4f6; position: sticky; top: 0; }}
    .table-wrap {{ max-height: 70vh; overflow: auto; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.06); }}
  </style>
</head>
<body>
  <div class=\"card\">
    <h1>CareConnect Test Coverage</h1>
    <div class=\"meta\">Generated from coverage/lcov.info</div>
    <p class=\"big\">Overall line coverage: {overall:.2f}%</p>
    <div class=\"meta\">Hit lines: {total_hit} &nbsp;|&nbsp; Total lines: {total_lines} &nbsp;|&nbsp; Files: {len(files)}</div>
  </div>

  <div class=\"table-wrap\">
    <table>
      <thead>
        <tr><th>File</th><th>Hit</th><th>Total</th><th>Coverage</th></tr>
      </thead>
      <tbody>
        {''.join(rows)}
      </tbody>
    </table>
  </div>
</body>
</html>
"""
    output_path.write_text(html, encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    lcov = root / "coverage" / "lcov.info"
    out = root / "coverage" / "html" / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)

    if not lcov.exists():
        raise SystemExit("coverage/lcov.info not found. Run `flutter test --coverage` first.")

    files = parse_lcov(lcov)
    write_html(files, out)
    print(f"Generated: {out}")


if __name__ == "__main__":
    main()
