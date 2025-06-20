---
layout: default
title: "소개"
permalink: /about/
---

<div class="about-page">
  <div class="container">
    <header class="about-header">
      <h1>안녕하세요! 👋</h1>
      <p class="about-subtitle">개발자이자 블로거입니다</p>
    </header>

    <section class="about-content">
      <div class="about-section">
        <h2>저에 대해</h2>
        <p>
          안녕하세요! 저는 {{ site.author.name }}입니다. 
          {{ site.author.bio }}로 활동하고 있으며, 
          {{ site.author.location }}에서 살고 있습니다.
        </p>
        
        <p>
          개발에 대한 열정과 새로운 기술을 배우는 것을 좋아하며, 
          이 블로그를 통해 제가 배운 것들과 경험을 나누고 싶습니다.
        </p>
      </div>

      <div class="about-section">
        <h2>기술 스택</h2>
        <div class="skills">
          <div class="skill-category">
            <h3>프론트엔드</h3>
            <div class="skill-tags">
              <span class="skill-tag">HTML5</span>
              <span class="skill-tag">CSS3</span>
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Vue.js</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3>백엔드</h3>
            <div class="skill-tags">
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">Python</span>
              <span class="skill-tag">Java</span>
              <span class="skill-tag">Spring</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3>데이터베이스</h3>
            <div class="skill-tags">
              <span class="skill-tag">MySQL</span>
              <span class="skill-tag">MongoDB</span>
              <span class="skill-tag">PostgreSQL</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h3>기타</h3>
            <div class="skill-tags">
              <span class="skill-tag">Git</span>
              <span class="skill-tag">Docker</span>
              <span class="skill-tag">AWS</span>
              <span class="skill-tag">Linux</span>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>경력</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-date">2023 - 현재</div>
            <div class="timeline-content">
              <h3>시니어 개발자</h3>
              <p>웹 애플리케이션 개발 및 팀 리딩</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">2020 - 2023</div>
            <div class="timeline-content">
              <h3>개발자</h3>
              <p>풀스택 웹 개발 및 모바일 앱 개발</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-date">2018 - 2020</div>
            <div class="timeline-content">
              <h3>주니어 개발자</h3>
              <p>웹 개발 및 프론트엔드 개발</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>교육</h2>
        <div class="education">
          <div class="education-item">
            <h3>컴퓨터공학 학사</h3>
            <p>한국대학교 (2014-2018)</p>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>취미 & 관심사</h2>
        <div class="interests">
          <div class="interest-item">
            <i class="fas fa-book"></i>
            <span>독서</span>
          </div>
          <div class="interest-item">
            <i class="fas fa-hiking"></i>
            <span>등산</span>
          </div>
          <div class="interest-item">
            <i class="fas fa-camera"></i>
            <span>사진 촬영</span>
          </div>
          <div class="interest-item">
            <i class="fas fa-gamepad"></i>
            <span>게임</span>
          </div>
          <div class="interest-item">
            <i class="fas fa-music"></i>
            <span>음악 감상</span>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2>연락처</h2>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <a href="mailto:{{ site.author.links[1].url | replace: 'mailto:', '' }}">이메일 보내기</a>
          </div>
          <div class="contact-item">
            <i class="fab fa-github"></i>
            <a href="{{ site.author.links[0].url }}" target="_blank">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
.about-page {
  padding: 2rem 0;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.about-subtitle {
  font-size: 1.25rem;
  color: #666;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  border-bottom: 2px solid #007acc;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-category h3 {
  margin-bottom: 1rem;
  color: #007acc;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #f8f9fa;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #dee2e6;
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #007acc;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  background-color: #007acc;
  border-radius: 50%;
}

.timeline-date {
  font-weight: 600;
  color: #007acc;
  margin-bottom: 0.5rem;
}

.timeline-content h3 {
  margin-bottom: 0.5rem;
}

.education-item h3 {
  color: #007acc;
  margin-bottom: 0.5rem;
}

.interests {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.interest-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.interest-item i {
  color: #007acc;
  font-size: 1.2rem;
}

.contact-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-item i {
  color: #007acc;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .about-header h1 {
    font-size: 2rem;
  }
  
  .skills {
    grid-template-columns: 1fr;
  }
  
  .interests {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-info {
    flex-direction: column;
  }
}
</style> 