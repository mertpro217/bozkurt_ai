const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// TDK sorgulama
async function tdkAra(kelime) {
  try {
    const url = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(kelime)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const anlamlar = data[0]?.anlamlarListe.map(a => a.anlam);
    return anlamlar ? anlamlar.join('; ') : null;
  } catch (e) {
    return null;
  }
}

// Wikipedia sorgulama
async function wikiAra(kelime) {
  try {
    const url = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(kelime)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.extract || null;
  } catch (e) {
    return null;
  }
}

// Basit matematik kontrolü
function matematikKontrol(soru) {
  try {
    if (/^[0-9+\-*/().\s]+$/.test(soru)) {
      return eval(soru); // güvenli girişlerde
    }
  } catch (e) {}
  return null;
}

// Bozkurt AI cevaplama
async function bozkurtCevap(soru) {
  // Matematik
  const matematik = matematikKontrol(soru);
  if (matematik !== null) return `Matematik sonucu: ${matematik}`;

  // TDK
  const tdk = await tdkAra(soru);
  if (tdk) return `TDK: ${tdk}`;

  // Wikipedia
  const wiki = await wikiAra(soru);
  if (wiki) return `Wikipedia: ${wiki}`;

  return "Üzgünüm, bu konuda bilgim yok.";
}

// API endpoint
app.post('/api/cevap', async (req, res) => {
  const { soru } = req.body;
  const cevap = await bozkurtCevap(soru);
  res.json({ cevap });
});

// Sunucu başlat
app.listen(3000, () => console.log("Bozkurt AI çalışıyor: http://localhost:3000"));
