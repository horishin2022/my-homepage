(function () {
  const containers = document.querySelectorAll('[data-post-list]');
  if (!containers.length) return;

  const escapeHtml = (value) => String(value || '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));

  const normalizeBase = (base) => base.endsWith('/') ? base : `${base}/`;

  const renderPosts = (container, posts) => {
    const limit = Number(container.dataset.postLimit || posts.length);
    const base = normalizeBase(container.dataset.postBase || 'blog/');
    const headingLevel = container.dataset.headingLevel || 'h3';
    const selected = posts.slice(0, limit);

    container.innerHTML = selected.map((post) => {
      const url = `${base}${post.url}`;
      return `
        <article class="latest-card">
          <p class="post-meta">${escapeHtml(post.category)} / ${escapeHtml(post.dateLabel)}</p>
          <${headingLevel}>${escapeHtml(post.title)}</${headingLevel}>
          <p>${escapeHtml(post.description)}</p>
          <a class="text-link" href="${escapeHtml(url)}">記事を読む</a>
        </article>
      `;
    }).join('');
  };

  const showError = (container) => {
    container.innerHTML = '<p class="post-error">ブログ記事を読み込めませんでした。</p>';
  };

  const postsPath = document.currentScript.dataset.posts || 'blog/posts.json';

  fetch(postsPath)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load posts');
      return response.json();
    })
    .then((posts) => {
      const sorted = posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
      containers.forEach((container) => renderPosts(container, sorted));
    })
    .catch(() => {
      containers.forEach(showError);
    });
}());
