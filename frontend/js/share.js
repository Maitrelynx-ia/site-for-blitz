document.addEventListener("DOMContentLoaded", () => {
  const replayForm = document.getElementById("uploadReplayForm");
  const tipForm = document.getElementById("addTipForm");

  replayForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(replayForm);
    fetch("/share/uploadReplay", {
      method: "POST",
      body: data,
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        replayForm.reset();
      })
      .catch(console.error);
  });

  tipForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(tipForm);
    fetch("/share/addTip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        content: data.get("content"),
      }),
    })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        tipForm.reset();
      })
      .catch(console.error);
  });
});
