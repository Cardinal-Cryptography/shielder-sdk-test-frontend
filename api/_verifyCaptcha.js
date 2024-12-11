const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyCaptcha(cfToken) {
  const res = await fetch(verifyEndpoint, {
    method: "POST",
    body: JSON.stringify({
      secret: process.env.CF_SECRET,
      response: cfToken,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error(res);
    return false;
  }

  const verified = await res.json();
  if (!verified.success) {
    console.error(verified);
    return false;
  }
  return true;
}
