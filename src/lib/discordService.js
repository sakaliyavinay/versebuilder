/**
 * Discord Integration Service
 * - Dispatches rich visitor inquiries to creator's private Discord Webhook
 * - Tests Discord Webhooks
 * - Queries Lanyard API for live Discord status & activity presence
 */

export const sendDiscordInquiryWebhook = async ({
  webhookUrl,
  creatorName,
  inquiry,
  portfolioSlug,
}) => {
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error("Invalid Discord Webhook URL. Please check the URL format.");
  }

  const payload = {
    username: "VerseBuilder Inquiries",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=versebuilder",
    embeds: [
      {
        title: `📬 New Portfolio Inquiry for ${creatorName || "Creator"}!`,
        description: `A visitor sent an inquiry from your public portfolio **(/u/${portfolioSlug})**.`,
        color: 0xf5b84b, // Warm gold
        fields: [
          {
            name: "👤 Visitor Name",
            value: inquiry.name || "Anonymous",
            inline: true,
          },
          {
            name: "📧 Visitor Email",
            value: inquiry.email || "Not provided",
            inline: true,
          },
          {
            name: "📱 Visitor Phone",
            value: inquiry.phone || "Not provided",
            inline: true,
          },
          {
            name: "💼 Project Type / Budget",
            value: inquiry.budget || "Not specified",
            inline: false,
          },
          {
            name: "💬 Message",
            value: inquiry.message || "No message body",
            inline: false,
          },
        ],
        footer: {
          text: `VerseBuilder Portfolio Platform • Received ${new Date().toLocaleDateString()}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Discord Webhook returned status ${response.status}`);
  }

  return true;
};

export const testDiscordWebhook = async (webhookUrl, creatorName = "Creator") => {
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error("Please enter a valid Discord Webhook URL (starts with https://discord.com/api/webhooks/...)");
  }

  const payload = {
    username: "VerseBuilder Bot",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=versebuilder",
    embeds: [
      {
        title: "⚡ Discord Webhook Connected Successfully!",
        description: `Hey **${creatorName}**, your portfolio is now linked to this Discord channel. Any inquiries or messages sent from your public portfolio page will arrive here instantly!`,
        color: 0x10b981, // Emerald Green
        fields: [
          {
            name: "Status",
            value: "🟢 Active & Ready",
            inline: true,
          },
          {
            name: "Time",
            value: new Date().toLocaleTimeString(),
            inline: true,
          },
        ],
        footer: {
          text: "VerseBuilder Platform Integration",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send test message (HTTP ${response.status}). Please check your webhook URL.`);
  }

  return true;
};

/**
 * Live Discord Presence Hook via Lanyard
 * Lanyard API: https://api.lanyard.rest/v1/users/{user_id}
 */
export const fetchDiscordPresence = async (userId) => {
  if (!userId || !/^\d{17,20}$/.test(userId.trim())) {
    return null;
  }

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId.trim()}`);
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.success || !json.data) return null;

    const d = json.data;
    const discordStatus = d.discord_status || "offline"; // "online" | "idle" | "dnd" | "offline"
    const activeActivity = d.activities?.find((a) => a.type === 0 || a.type === 4); // Playing or custom

    return {
      status: discordStatus,
      statusLabel:
        discordStatus === "online"
          ? "Online on Discord"
          : discordStatus === "idle"
          ? "Away / Idle"
          : discordStatus === "dnd"
          ? "Do Not Disturb"
          : "Offline",
      username: `${d.discord_user?.username || ""}${
        d.discord_user?.discriminator && d.discord_user.discriminator !== "0"
          ? `#${d.discord_user.discriminator}`
          : ""
      }`,
      activity: activeActivity?.state || activeActivity?.name || null,
      avatarUrl: d.discord_user?.avatar
        ? `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png`
        : null,
    };
  } catch (err) {
    console.warn("Lanyard Discord presence fetch failed", err);
    return null;
  }
};
