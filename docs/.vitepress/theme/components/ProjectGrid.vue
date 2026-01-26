<script setup>
defineProps({
  projects: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    default: 'open-source'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="projects-page">
    <div class="projects-header" v-if="title">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="project-grid">
      <a
        v-for="project in projects"
        :key="project.name"
        :href="project.link"
        :target="project.external ? '_blank' : '_self'"
        :rel="project.external ? 'noopener noreferrer' : ''"
        class="project-card"
      >
        <div class="project-header">
          <h3 class="project-name">
            {{ project.name }}
            <span v-if="project.external" class="external-icon">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                />
              </svg>
            </span>
          </h3>
          <div
            v-if="project.github && type === 'open-source'"
            class="project-github"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </div>
        </div>
        <p class="project-description">{{ project.description }}</p>
      </a>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.projects-header {
  margin-bottom: 2rem;
}

.projects-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.projects-header p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.project-card:hover {
  border-color: #02b7ed;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(2, 183, 237, 0.1);
}

.dark .project-card:hover {
  box-shadow: 0 4px 12px rgba(2, 183, 237, 0.2);
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.project-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.4;
}

.external-icon {
  opacity: 0.5;
  flex-shrink: 0;
}

.project-description {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0;
  flex: 1;
}

.project-github {
  color: var(--vp-c-text-3);
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.project-card:hover .project-github {
  color: var(--vp-c-text-1);
}

@media (max-width: 1024px) {
  .project-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .projects-page {
    padding: 1.5rem 1rem 3rem;
  }
}

@media (max-width: 480px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
