<template>
  <div class="login-container">
    <div class="estilo">
      <h1 class="brand">DailySinc</h1>
      <p class="slogan">Sincronize sua rotina, simplifique seu dia</p>
    </div>
    <div class="divisor">
      <el-card class="login-card" shadow="hover">
        <h1 class="login-title">Bem-vindo</h1>
        <p class="login-subtitle">Faça login para acessar o painel</p>

        <form :model="form" class="login-form">
          <el-form-item >
            <el-input
                v-model="form.email"
                placeholder="Email"
                size="large"
            />
          </el-form-item>

          <el-form-item>
            <el-input
                v-model="form.password"
                type="password"
                placeholder="Senha"
                show-password
                size="large"
            />
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                size="large"
                class="login-button"
                @click="handleLogin"
                :loading="loading"
            >
              Entrar
            </el-button>
          </el-form-item>

          <el-alert v-if="error" :title="error" type="error" show-icon />
        </form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const form = reactive({
  email: '',
  password: ''
});
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(form.email, form.password);
    router.push('/');
  } catch {
    error.value = 'Email ou senha inválidos';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

.estilo .brand {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #50e3cc, #00adb5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}
.estilo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1c1c1c, #505050);
  color: #fff;
  text-align: center;
}

.divisor{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  min-height: 100vh;
  background: linear-gradient(135deg, #50e3cc, #024f40);
}
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 380px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  background: #fff;
}

.login-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.login-form >>> .el-input__wrapper {
  background-color: white !important;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

.login-form >>> .el-input__wrapper.is-focus {
  border-color: #50e3cc;
  box-shadow: 0 0 0 2px rgba(80, 227, 204, 0.2);
}

.login-button {
  width: 100%;
  border-radius: 12px;
  font-weight: bold;
}

.login-form ::v-deep(.el-input__wrapper) {
  background-color: white !important;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

.login-form ::v-deep(.el-input__wrapper.is-focus) {
  border-color: #50e3cc;
  box-shadow: 0 0 0 2px rgba(80, 227, 204, 0.2);
}

</style>