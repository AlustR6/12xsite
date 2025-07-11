export async function handler(event, context) {
  const token = "ut_IbbitwZM6qaYE00SoWGKB3n3h6PAJPfbKKxA3xbD";
  const namespace = "split12x";
  const name = "downloads55678";

  try {
    const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${name}/up`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        count: data.count || 0
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error hitting CounterAPI",
        details: error.message
      })
    };
  }
}
