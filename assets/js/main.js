// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Add active class to current navigation item
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Reading time calculation
function calculateReadingTime() {
  const article = document.querySelector('.post-content');
  if (!article) return;
  
  const text = article.textContent;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  
  const readingTimeElement = document.createElement('div');
  readingTimeElement.className = 'reading-time';
  readingTimeElement.innerHTML = `<i class="far fa-clock"></i> 읽는 시간: ${readingTime}분`;
  
  const postMeta = document.querySelector('.post-meta');
  if (postMeta) {
    postMeta.appendChild(readingTimeElement);
  }
}

document.addEventListener('DOMContentLoaded', calculateReadingTime);

// Copy code button for code blocks
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.innerHTML = '<i class="far fa-copy"></i>';
    button.title = '코드 복사';
    
    button.addEventListener('click', function() {
      const text = block.textContent;
      navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.title = '복사됨!';
        
        setTimeout(() => {
          button.innerHTML = '<i class="far fa-copy"></i>';
          button.title = '코드 복사';
        }, 2000);
      });
    });
    
    block.parentNode.style.position = 'relative';
    block.parentNode.appendChild(button);
  });
});

// Search functionality
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
      const title = post.querySelector('.post-title').textContent.toLowerCase();
      const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
      
      if (title.includes(query) || excerpt.includes(query)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initSearch);

// Back to top button
function initBackToTop() {
  const backToTopButton = document.createElement('button');
  backToTopButton.className = 'back-to-top';
  backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopButton.title = '맨 위로';
  
  document.body.appendChild(backToTopButton);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);

// Add CSS for new elements
const additionalStyles = `
  .nav-menu.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem;
  }
  
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  
  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
  
  .nav-link.active {
    color: #007acc;
  }
  
  .reading-time {
    color: #666;
    font-size: 0.9rem;
    margin-left: 1rem;
  }
  
  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .copy-button:hover {
    background: #005a9e;
  }
  
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .back-to-top.show {
    opacity: 1;
    visibility: visible;
  }
  
  .back-to-top:hover {
    background: #005a9e;
    transform: translateY(-2px);
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== Firework/Particle Effect =====
(function() {
  const canvas = document.getElementById('firework-canvas');
  const toggleBtn = document.getElementById('firework-toggle');
  if (!canvas || !toggleBtn) return;
  const ctx = canvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let effectEnabled = true;

  // 스위치 버튼 동작
  function updateToggleUI() {
    if (effectEnabled) {
      toggleBtn.textContent = '🎆 이펙트 ON';
      toggleBtn.setAttribute('aria-pressed', 'true');
      canvas.style.display = '';
    } else {
      toggleBtn.textContent = '🎇 이펙트 OFF';
      toggleBtn.setAttribute('aria-pressed', 'false');
      canvas.style.display = 'none';
    }
  }
  toggleBtn.addEventListener('click', function() {
    effectEnabled = !effectEnabled;
    updateToggleUI();
  });
  updateToggleUI();

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function randomColor() {
    const colors = [
      '#ff5252', '#ffb142', '#fffa65', '#32ff7e', '#18dcff', '#7d5fff', '#cd84f1', '#fff', '#f5cd79'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // sizeType: 'small' | 'large'
  function createFirework(x, y, sizeType = 'small') {
    if (!effectEnabled) return;
    let count, speedBase, sizeBase, gravityBase;
    if (sizeType === 'large') {
      count = 40 + Math.floor(Math.random() * 20);
      speedBase = 3.5;
      sizeBase = 3.5;
      gravityBase = 0.05;
    } else {
      count = 12 + Math.floor(Math.random() * 8);
      speedBase = 1.5;
      sizeBase = 1.5;
      gravityBase = 0.03;
    }
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = speedBase + Math.random() * speedBase;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: randomColor(),
        size: sizeBase + Math.random() * sizeBase,
        gravity: gravityBase + Math.random() * 0.02,
        drag: 0.96 + Math.random() * 0.02
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    if (effectEnabled) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.alpha -= 0.015 + Math.random() * 0.01;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      particles = [];
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(animate);
  }
  animate();

  // 마우스 위치 추적
  let lastMouse = { x: width / 2, y: height / 2 };
  let isMouseMoving = false;

  function updateMouse(e) {
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    lastMouse.x = x;
    lastMouse.y = y;
    isMouseMoving = true;
    createFirework(x, y, 'small');
  }

  window.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.2) updateMouse(e); // 약하게, 빈도 조절
  });
  window.addEventListener('touchmove', function(e) {
    if (Math.random() < 0.2) updateMouse(e);
  });

  // 클릭/터치 시 큰 폭죽
  function triggerBigFirework(e) {
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    lastMouse.x = x;
    lastMouse.y = y;
    createFirework(x, y, 'large');
  }
  window.addEventListener('mousedown', triggerBigFirework);
  window.addEventListener('touchstart', triggerBigFirework);

  // 마우스가 가만히 있을 때도 약하게 터지도록
  setInterval(function() {
    if (!isMouseMoving) {
      createFirework(lastMouse.x, lastMouse.y, 'small');
    }
    isMouseMoving = false;
  }, 100); // 0.1초마다

})();
// ===== Firework/Particle Effect END ===== 