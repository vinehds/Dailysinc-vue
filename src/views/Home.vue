<template>
  <div class="home-wrapper">
    <!-- Navbar no topo -->


    <div class="home-container">
      <!-- Sidebar -->
<Sidebar />

      <!-- Conteúdo principal -->
      <main class="home-content">
        <h1>Bem-vindo à Home!</h1>
        <p>Seu painel começa aqui.</p>
      </main>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

body{
  background-color:  #1c1c1c
}
.home-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color:  #1c1c1c
}

.home-container {
  display: flex;
  flex: 1;
  background-color:  #1c1c1c
}

/* Conteúdo principal ao lado da sidebar */
.home-content {
  background-color:  #1c1c1c;
  flex: 1;
  padding: 20px;
}
</style>
