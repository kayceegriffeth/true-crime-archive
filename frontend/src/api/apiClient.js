const API_BASE_URL = "http://localhost:8080/api";

const authHeader = () => {
  // Auto login for demo
  const token = btoa(`admin:admin`); 
  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
};

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: authHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}
