async function gonder() {
  const soru = document.getElementById("soru").value.trim();
  if (!soru) return;
  yaz("sen", soru);
  document.getElementById("soru").value = "";

  try {
    const res = await fetch("/api/cevap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soru })
    });
    const data = await res.json();
    yaz("kurt", data.cevap);
  } catch (e) {
    yaz("kurt", "Hata oluştu: " + e.message);
  }
}

function yaz(kim, mesaj) {
  const chat = document.getElementById("chat");
  const p = document.createElement("p");
  p.className = kim;
  p.textContent = (kim==="sen"?"Sen: ":"Bozkurt: ") + mesaj;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}
