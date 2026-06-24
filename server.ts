import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_FILE = path.join(process.cwd(), "db.json");

  // JSON body parser with increased limit to handle screenshot base64 payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API to fetch server-side saved configuration
  app.get("/api/config", async (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = await fs.promises.readFile(DB_FILE, "utf-8");
        return res.json({ success: true, config: JSON.parse(content) });
      }
      return res.json({ success: true, config: null });
    } catch (err: any) {
      console.error("[Config Get] Error reading config file:", err);
      return res.status(500).json({ success: false, error: err.message || "Error reading config database" });
    }
  });

  // API to save configuration server-side
  app.post("/api/config", async (req, res) => {
    try {
      const { config } = req.body;
      if (!config) {
        return res.status(400).json({ success: false, error: "Missing config payload" });
      }
      await fs.promises.writeFile(DB_FILE, JSON.stringify(config, null, 2), "utf-8");
      console.log("[Config Save] Config file saved successfully to db.json");
      return res.json({ success: true });
    } catch (err: any) {
      console.error("[Config Save] Error writing config file:", err);
      return res.status(500).json({ success: false, error: err.message || "Error writing config database" });
    }
  });

  // API proxy route for Free Fire UID Player Verification to bypass CORS restrictions
  app.get("/api/player-info", async (req, res) => {
    try {
      const { uid } = req.query;
      if (!uid) {
        return res.status(400).json({ ok: false, description: "Missing uid parameter" });
      }

      console.log(`[Player Verification Proxy] Fetching player-info for UID: ${uid}`);
      const targetUrl = `https://info.killersharmabot.online/player-info?uid=${encodeURIComponent(uid as string)}`;
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        console.warn(`[Player Verification Proxy] Remote API returned status: ${response.status}`);
        return res.status(response.status).json({
          ok: false,
          description: `Remote system returned error code: ${response.status}`
        });
      }

      const data = await response.json();
      console.log(`[Player Verification Proxy] Remote API response status ok`);

      // Extract nickname safely from data.basicInfo.nickname or direct data.nickname
      let nickname = "";
      if (data) {
        if (data.basicInfo && data.basicInfo.nickname) {
          nickname = data.basicInfo.nickname;
        } else if (data.nickname) {
          nickname = data.nickname;
        }
      }

      if (!nickname) {
        return res.status(404).json({
          ok: false,
          description: "Player nickname could not be located in response. Check if Player ID is invalid."
        });
      }

      return res.json({
        ok: true,
        nickname: nickname,
        uid: uid
      });
    } catch (err: any) {
      console.error("[Player Verification Proxy] Exception error:", err);
      return res.status(500).json({
        ok: false,
        description: `Backend proxy error: ${err.message || 'Unknown network error'}`
      });
    }
  });

  // API proxy route for Telegram messages to bypass CORS and client fetch blocks
  app.post("/api/telegram/send", async (req, res) => {
    try {
      const { botToken, chatId, text, photoBase64 } = req.body;

      if (!botToken || !chatId) {
        return res.status(400).json({
          ok: false,
          description: "Missing botToken or chatId in request parameters."
        });
      }

      let telegramResponse;
      let telegramData;

      // If a screenshot in base64 is provided, dispatch via sendPhoto to Telegram
      if (photoBase64 && photoBase64.trim() !== '') {
        try {
          // Decode base64 to buffer
          const base64Data = photoBase64.includes(",") 
            ? photoBase64.split(",")[1] 
            : photoBase64;
          const buffer = Buffer.from(base64Data, "base64");
          const blob = new Blob([buffer], { type: "image/png" });

          const formData = new FormData();
          formData.append("chat_id", chatId);
          formData.append("photo", blob, "screenshot.png");
          if (text) {
            formData.append("caption", text);
          }

          console.log(`[Telegram Server Proxy] Sending sendPhoto request to bot ${botToken.substring(0, 8)}...`);
          telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: formData
          });

          telegramData = await telegramResponse.json();
          console.log(`[Telegram Server Proxy] sendPhoto status:`, telegramResponse.status, telegramData);

          if (telegramResponse.ok && telegramData.ok) {
            return res.json({ ok: true, data: telegramData, method: "sendPhoto" });
          } else {
            console.warn(`[Telegram Server Proxy] sendPhoto failed: ${telegramData.description || 'Unknown error'}. Falling back to sendMessage...`);
          }
        } catch (photoErr: any) {
          console.error(`[Telegram Server Proxy] Error during sendPhoto creation:`, photoErr);
        }
      }

      // Fallback or default dispatcher: sendMessage
      console.log(`[Telegram Server Proxy] Dispatching sendMessage to bot ${botToken.substring(0, 8)}...`);
      telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      });

      telegramData = await telegramResponse.json();
      console.log(`[Telegram Server Proxy] sendMessage status:`, telegramResponse.status, telegramData);

      if (telegramResponse.ok && telegramData.ok) {
        return res.json({ ok: true, data: telegramData, method: "sendMessage" });
      } else {
        return res.status(telegramResponse.status || 400).json({
          ok: false,
          description: telegramData.description || "Telegram API refused the message."
        });
      }
    } catch (err: any) {
      console.error("[Telegram Server Proxy] Route exception error:", err);
      return res.status(500).json({
        ok: false,
        description: `Server-side proxy exception: ${err.message || 'Unknown network error'}`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
