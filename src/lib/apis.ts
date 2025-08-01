export async function createForm(data: unknown) {
  const res = await fetch("/api/forms", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteForm(id: string) {
  const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });

  return res.json();
}

export async function getAllForms() {
  const res = await fetch("/api/forms");

  return res.json();
}

export async function getFormById(id: string) {
  const res = await fetch(`/api/forms/${id}`);

  return res.json();
}

export async function updateForm(id: string, data: unknown) {
  const res = await fetch(`/api/forms/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return res.json();
}
