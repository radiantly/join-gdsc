const fetch = require("node-fetch").default;

exports.handler = async function (event, context) {
  // Build json response
  const json = (code, obj) => ({
    statusCode: code || 200,
    body: JSON.stringify(obj),
  });

  const jsonError = (code, error) => json(code, { error });

  // Only allow POST requests
  if (event.httpMethod !== "POST")
    return jsonError(405, "Only POST supported on this endpoint");

  // Parse body
  let access_token, nick, id;
  try {
    ({ access_token, nick, id } = JSON.parse(event.body));
  } catch {
    return jsonError(400, "Invalid JSON");
  }

  // Check if required body parameters are present
  if (!access_token || !nick || !id)
    return jsonError(400, "All required parameters are not present");

  // Ensure that nickname does not contain disallowed characters
  if (!/^[a-z .'-]{3,32}$/i.test(nick))
    return jsonError(400, "Nickname contains disallowed characters.");

  try {
    const response = await fetch(
      `https://discord.com/api/v9/guilds/${process.env.GUILD_ID}/members/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token,
          nick,
          roles: ["883727061653528598"],
        }),
      }
    );
    return { statusCode: response.status };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error. Please report this." }),
    };
  }
};
