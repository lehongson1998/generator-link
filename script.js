const guestInput = document.getElementById("guestName");
const linkInput = document.getElementById("inviteLink");

const qrBox = document.getElementById("qrBox");
const qrImage = document.getElementById("qrImage");
const downloadQR = document.getElementById("downloadQR");

const BASE_URL = "https://lehongson1998.github.io/VS-WEDDING/";

/* ===== TẠO LINK + QR ===== */
document.getElementById("generateLink").addEventListener("click", async () => {
  const name = guestInput.value.trim();
  if (!name) {
    alert("Nhập tên người được mời");
    return;
  }

  const encodedName = encodeURIComponent(name);
  const link = `${BASE_URL}?to=${encodedName}`;
  linkInput.value = link;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    link
  )}`;

  // hiển thị QR
  qrImage.src = qrUrl;
  qrBox.style.opacity = "1";
  qrBox.style.visibility = "visible";
  qrBox.style.width = "auto";
  qrBox.style.height = "auto";

  // ===== FIX DOWNLOAD =====
  try {
    const res = await fetch(qrUrl);
    const blob = await res.blob();

    const blobUrl = URL.createObjectURL(blob);

    downloadQR.href = blobUrl;
    downloadQR.download = `thiep-cuoi-${name}.png`;
  } catch (err) {
    console.error(err);
    alert("Không tạo được QR để tải");
  }
});

/* ===== COPY ===== */
document.getElementById("copyLink").addEventListener("click", async () => {
  if (!linkInput.value) return alert("Chưa có link");

  await navigator.clipboard.writeText(linkInput.value);
  alert("📋 Đã copy link");
});

/* ===== SHARE ===== */
function getLink() {
  if (!linkInput.value) {
    alert("Hãy tạo link trước");
    return null;
  }
  return linkInput.value;
}

document.getElementById("share-messenger").onclick = () => {
  const link = getLink();
  if (!link) return;

  const encoded = encodeURIComponent(link);

  const messengerApp = `fb-messenger://share?link=${encoded}`;
  const messengerWeb = `https://www.facebook.com/dialog/send?link=${encoded}&redirect_uri=${encoded}`;

  openApp(messengerApp, messengerWeb);
};

document.getElementById("share-zalo").onclick = () => {
  const link = getLink();
  if (!link) return;

  const encoded = encodeURIComponent(link);

  const zaloApp = `zalo://share?url=${encoded}`;
  const zaloWeb = `https://zalo.me/share?url=${encoded}`;

  openApp(zaloApp, zaloWeb);
};

document.getElementById("share-teams").onclick = () => {
  const link = getLink();
  if (!link) return;

  const encoded = encodeURIComponent(link);

  const teamsApp = `msteams://share?href=${encoded}`;
  const teamsWeb = `https://teams.microsoft.com/share?href=${encoded}`;

  openApp(teamsApp, teamsWeb);
};

function openApp(appUrl, webUrl) {
  const now = Date.now();

  // thử mở app
  window.location.href = appUrl;

  // nếu sau 1.5s chưa nhảy app → mở web
  setTimeout(() => {
    if (Date.now() - now < 1600) {
      window.open(webUrl, "_blank");
    }
  }, 1500);
}
