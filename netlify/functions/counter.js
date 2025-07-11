export default async function handler(req, res) {
  const token = "ut_IbbitwZM6qaYE00SoWGKB3n3h6PAJPfbKKxA3xbD";
  const namespace = "split12x";
  const counter = "downloads55678";

  const url = `https://api.counterapi.dev/v1/${namespace}/${counter}/up`;

  try {
    const apiRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "API request failed" });
    }

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error hitting CounterAPI:", err);
    return res.status(500).json({ error: "Failed to increment counter" });
  }
}
