(function () {
  const containers = document.querySelectorAll('[data-post-list]');
  if (!containers.length) return;

  const escapeHtml = (value) => String(value || '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));

  const normalizeBase = (base) => {
    if (base === '') return '';
    return base.endsWith('/') ? base : `${base}/`;
  };

  const renderPosts = (posts) => {
    const sorted = posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));

    containers.forEach((container) => {
      const limit = Number(container.dataset.postLimit || sorted.length);
      const baseAttr = container.getAttribute('data-post-base');
      const base = normalizeBase(baseAttr === null ? 'blog/' : baseAttr);
      const headingLevel = container.dataset.headingLevel || 'h3';
      const selected = sorted.slice(0, limit);

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
    });
  };

  const showError = () => {
    containers.forEach((container) => {
      container.innerHTML = '<p class="post-error">ブログ記事を読み込めませんでした。</p>';
    });
  };

  if (Array.isArray(window.SHINSAN_BLOG_POSTS)) {
    renderPosts(window.SHINSAN_BLOG_POSTS);
    return;
  }

  const postsPath = document.currentScript.dataset.posts || 'blog/posts.json';

  fetch(postsPath)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load posts');
      return response.json();
    })
    .then(renderPosts)
    .catch(showError);
}());

