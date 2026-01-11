export const loginUser = async (username, password) => {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const text = await res.text();

  const result = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      result?.detail?.[0]?.msg || result?.message || "Login gagal"
    );
  }

  return result;
};

export const registerUser = async (payload) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.detail?.[0]?.msg || "Register gagal");
  }

  return result;
};
