import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const dataPath = path.join(publicDir, "data", "portfolio.json");
const videosDir = path.join(publicDir, "videos");
const thumbsDir = path.join(publicDir, "portfolio");
const port = Number(process.env.PORT || 5050);

const send = (res, status, body, type = "text/html; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
};

const safeSlug = (value) =>
  String(value || "work")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "work";

const safeExt = (filename, fallback) => {
  const ext = path.extname(filename || "").toLowerCase();
  if (!ext || ext.length > 8) return fallback;
  return ext;
};

const getPortfolio = async () => {
  const json = await readFile(dataPath, "utf8");
  return JSON.parse(json);
};

const savePortfolio = async (data) => {
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const parseMultipart = (buffer, contentType) => {
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] ||
    contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];

  if (!boundary) throw new Error("Missing upload boundary.");

  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts = {};
  let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length + 2;

  while (start > boundaryBuffer.length) {
    const next = buffer.indexOf(boundaryBuffer, start);
    if (next === -1) break;

    const part = buffer.subarray(start, next - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd !== -1) {
      const headers = part.subarray(0, headerEnd).toString("utf8");
      const body = part.subarray(headerEnd + 4);
      const name = headers.match(/name="([^"]+)"/)?.[1];
      const filename = headers.match(/filename="([^"]*)"/)?.[1];

      if (name) {
        parts[name] = filename
          ? { filename, data: body }
          : body.toString("utf8").trim();
      }
    }

    start = next + boundaryBuffer.length + 2;
  }

  return parts;
};

const adminHtml = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vinay Portfolio CMS</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #080808;
        --panel: rgba(18, 18, 18, 0.9);
        --line: rgba(255, 255, 255, 0.12);
        --text: #fffdf7;
        --muted: #b9b3a7;
        --soft: #f2e7d2;
        --gold: #f5b84b;
        --red: #f04438;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 20% 10%, rgba(245, 184, 75, 0.18), transparent 24rem),
          radial-gradient(circle at 88% 20%, rgba(240, 68, 56, 0.12), transparent 24rem),
          #080808;
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(980px, calc(100% - 32px));
        margin: 0 auto;
        padding: 54px 0;
      }
      .top {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
      }
      .eyebrow {
        color: var(--gold);
        font-size: 0.78rem;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 760px;
        margin: 0;
        font-size: clamp(2.2rem, 5vw, 4rem);
        line-height: 1;
      }
      p {
        max-width: 680px;
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }
      form, .guide {
        border: 1px solid var(--line);
        border-radius: 28px;
        background: var(--panel);
        padding: 24px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
      }
      form {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      label {
        display: grid;
        gap: 8px;
        font-weight: 850;
      }
      input {
        width: 100%;
        min-height: 48px;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.07);
        color: var(--text);
        padding: 0 14px;
      }
      input[type="file"] {
        padding: 12px;
      }
      .wide {
        grid-column: 1 / -1;
      }
      button {
        min-height: 50px;
        border: 0;
        border-radius: 999px;
        background: var(--soft);
        color: #17120a;
        font-weight: 950;
        cursor: pointer;
      }
      .status {
        min-height: 24px;
        color: var(--gold);
        font-weight: 850;
      }
      .guide {
        margin-top: 18px;
      }
      code {
        color: var(--soft);
      }
      @media (max-width: 680px) {
        form { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="top">
        <span class="eyebrow">Local portfolio CMS</span>
        <h1>Upload latest work without editing React code.</h1>
        <p>Add a video and thumbnail here. The CMS saves the files and updates <code>public/data/portfolio.json</code> automatically.</p>
      </div>

      <form id="uploadForm">
        <label>
          Title
          <input name="title" required placeholder="Example: New gaming montage" />
        </label>
        <label>
          Category
          <input name="category" required placeholder="Example: Gaming edit" />
        </label>
        <label>
          Video file
          <input name="video" required type="file" accept="video/mp4,video/webm,video/ogg" />
        </label>
        <label>
          Thumbnail / poster
          <input name="thumb" required type="file" accept="image/png,image/jpeg,image/webp" />
        </label>
        <button class="wide" type="submit">Upload Work</button>
        <div class="status wide" id="status"></div>
      </form>

      <div class="guide">
        <p>After uploading, run <code>npm run dev</code> to preview or <code>npm run build</code> before deploy. Uploaded videos go to <code>public/videos</code>; thumbnails go to <code>public/portfolio</code>.</p>
      </div>
    </main>

    <script>
      const form = document.querySelector("#uploadForm");
      const status = document.querySelector("#status");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "Uploading...";

        try {
          const response = await fetch("/api/videos", {
            method: "POST",
            body: new FormData(form),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Upload failed.");
          status.textContent = "Uploaded successfully. Your portfolio JSON is updated.";
          form.reset();
        } catch (error) {
          status.textContent = error.message;
        }
      });
    </script>
  </body>
</html>`;

const handleUpload = async (req, res) => {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    send(res, 400, JSON.stringify({ error: "Expected form upload." }), "application/json");
    return;
  }

  const parts = parseMultipart(await readBody(req), contentType);
  const title = parts.title;
  const category = parts.category;
  const video = parts.video;
  const thumb = parts.thumb;

  if (!title || !category || !video?.data?.length || !thumb?.data?.length) {
    send(res, 400, JSON.stringify({ error: "Title, category, video, and thumbnail are required." }), "application/json");
    return;
  }

  await mkdir(videosDir, { recursive: true });
  await mkdir(thumbsDir, { recursive: true });

  const id = `video-${Date.now()}`;
  const slug = safeSlug(title);
  const videoName = `${slug}-${Date.now()}${safeExt(video.filename, ".mp4")}`;
  const thumbName = `${slug}-thumb-${Date.now()}${safeExt(thumb.filename, ".png")}`;
  const videoPublicPath = `videos/${videoName}`;
  const thumbPublicPath = `portfolio/${thumbName}`;

  await writeFile(path.join(videosDir, videoName), video.data);
  await writeFile(path.join(thumbsDir, thumbName), thumb.data);

  const portfolio = await getPortfolio();
  portfolio.videos = Array.isArray(portfolio.videos) ? portfolio.videos : [];
  portfolio.videos.unshift({
    id,
    title,
    category,
    video: videoPublicPath,
    thumb: thumbPublicPath,
  });

  await savePortfolio(portfolio);

  send(res, 200, JSON.stringify({ ok: true, id }), "application/json");
};

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      send(res, 200, adminHtml());
      return;
    }

    if (req.method === "GET" && req.url === "/api/portfolio") {
      send(res, 200, JSON.stringify(await getPortfolio()), "application/json");
      return;
    }

    if (req.method === "POST" && req.url === "/api/videos") {
      await handleUpload(req, res);
      return;
    }

    send(res, 404, "Not found", "text/plain; charset=utf-8");
  } catch (error) {
    send(res, 500, JSON.stringify({ error: error.message }), "application/json");
  }
});

server.listen(port, () => {
  console.log(`Portfolio CMS running at http://localhost:${port}`);
});
