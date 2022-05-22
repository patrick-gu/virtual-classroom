export async function apiRequest({
  method,
  path,
  token,
  setToken,
  body,
  navigate,
}) {
  const headers = {};
  if (token) {
    headers.Authorization = token;
  }
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(`/api/v1${path}`, config);
  const responseBody = await response.json();
  if (responseBody.success) {
    return responseBody;
  } else if (response.status === 401) {
    setToken(null);
    navigate("/login");
    return {};
  } else {
    // alert(responseBody.error);
    return {};
  }
}
