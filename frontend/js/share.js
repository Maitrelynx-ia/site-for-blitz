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
document.getElementById("share-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      if (!title || !content) return;

      try {
        const res = await fetch("/share/post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        });
        const data = await res.json();
        if (res.ok) {
          document.getElementById("title").value = "";
          document.getElementById("content").value = "";
          loadPosts();
        } else {
          alert(data.message);
        }
      } catch {
        alert("Erreur lors de la publication");
      }
    });

    async function loadPosts() {
      try {
        const res = await fetch("/share/posts");
        const data = await res.json();
        const container = document.getElementById("posts-container");
        container.innerHTML = "";
        data.posts.reverse().forEach(post => {
          container.innerHTML += `
            <div class="post">
              <h4>${post.title}</h4>
              <p>${post.content}</p>
              <small>Par ${post.author || 'Anonyme'} le ${new Date(post.createdAt).toLocaleString()}</small>
            </div>`;
        });
      } catch {
        document.getElementById("posts-container").innerHTML = "<p style='color:red;'>Impossible de charger les publications.</p>";
      }
    }

    loadPosts();