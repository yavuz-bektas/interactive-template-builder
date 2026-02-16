<template>
  <div class="app-shell">
    <header class="top-bar">
      <slot name="header" />
    </header>
    <div class="layout">
      <aside class="layout-sidebar-left">
        <slot name="left" />
      </aside>
      <main class="layout-center">
        <slot name="center" />
      </main>
      <aside class="layout-sidebar-right">
        <slot name="right" />
      </aside>
    </div>
    <footer class="bottom-bar">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f3f4f6;
  color: #111827;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.layout {
  display: grid;
  grid-template-columns: 140px 1fr 260px;
  flex: 1;
  min-height: 0;
}

.layout-sidebar-left {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  overflow: auto;
}

.layout-sidebar-right {
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  overflow: auto;
}

.layout-center {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: auto;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .layout-sidebar-left,
  .layout-sidebar-right {
    border: none;
    border-bottom: 1px solid #e5e7eb;
  }
}
</style>
