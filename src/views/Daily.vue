<template>
  <el-container class="h-screen">
    <!-- Sidebar -->
    <el-aside width="220px" class="p-2 bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      <el-menu
          :default-active="String(teamSelected)"
          class="border-0 bg-transparent"
          @select="selectMenu"
      >
        <el-menu-item v-if="teamsItens.length === 0" disabled>
          Nenhum time cadastrado
        </el-menu-item>
        <el-menu-item
            v-for="team in teamsItens"
            :key="team.id"
            :index="String(team.id)"
        >
          {{ team.teamName }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Conteúdo principal -->
    <el-container class="p-4">
      <el-header class="mb-4 flex items-center justify-between">
        <!-- Filtros -->
        <el-form :inline="true" label-position="top">
          <el-form-item label="Filtrar por Data">
            <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="Selecione a data"
                format="DD/MM/YYYY"
                @change="buscarDados"
            />
          </el-form-item>

          <el-form-item label="Filtrar por Dev">
            <el-select
                v-model="devsSelected"
                placeholder="Devs"
                collapse-tags
                clearable
                multiple
                style="min-width: 220px"
                @change="handleSelectChange"
            >
              <el-option label="Todos" value="all" />
              <el-option
                  v-for="dev in devsFiltered"
                  :key="dev.id"
                  :label="dev.name"
                  :value="dev.id"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-button type="primary" @click="abrirResumo">
          Gerar resumo
        </el-button>
      </el-header>

      <!-- Cards -->
      <el-main>
        <el-empty v-if="dailiesFiltered.length === 0" description="Nenhuma daily encontrada" />
        <el-row v-else :gutter="16">
          <el-col
              v-for="(daily, index) in dailiesFiltered"
              :key="daily.id"
              :span="8"
          >
            <el-card shadow="hover" class="cursor-pointer" @click="openDaily(index)">
              <template #header>
                <div class="font-semibold">Autor ID: {{ daily.authorId }}</div>
              </template>
              <p><b>Ontem:</b> {{ daily.lastDayLog }}</p>
              <p><b>Hoje:</b> {{ daily.nextDayPlan }}</p>
              <div class="text-xs text-gray-500 mt-2 text-right">{{ daily.date }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- Modal Daily -->
    <el-dialog v-model="showModal" width="600px" :show-close="false">
      <template #header>
        <div class="flex items-center justify-between">
          <el-button
              :icon="ArrowLeft"
              circle
              @click="prevDaily"
              :disabled="isFirstDaily"
          />
          <span class="font-semibold">
            Autor {{ dailiesFiltered[currentIndex]?.authorId }} -
            {{ dailiesFiltered[currentIndex]?.date }}
          </span>
          <el-button
              :icon="ArrowRight"
              circle
              @click="nextDaily"
              :disabled="isLastDaily"
          />
        </div>
      </template>

      <p><b>Ontem:</b> {{ dailiesFiltered[currentIndex]?.lastDayLog }}</p>
      <p><b>Hoje:</b> {{ dailiesFiltered[currentIndex]?.nextDayPlan }}</p>
      <el-input
          v-model="dailyResponse"
          type="textarea"
          placeholder="Escreva sua resposta..."
          rows="3"
          class="mt-3"
      />

      <template #footer>
        <el-button type="danger" @click="showModal = false">Fechar</el-button>
        <el-button type="primary" @click="enviarResposta">Enviar resposta</el-button>
      </template>
    </el-dialog>

    <!-- Modal Resumo -->
    <el-dialog v-model="showResumo" width="700px">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <span class="font-semibold">Resumo das Dailies</span>
          <el-button size="small" type="success" @click="copiarResumo">📋 Copiar</el-button>
        </div>
      </template>

      <el-scrollbar height="50vh">
        <pre>{{ resumoTexto }}</pre>
      </el-scrollbar>

      <template #footer>
        <el-button type="primary" @click="showResumo = false">Fechar</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import api from "../services/api";
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { useAuthStore } from "../store/auth";

export default {
  components: { ArrowRight, ArrowLeft },
  data() {
    return {
      selectedDate: null,
      devsSelected: [],
      dailys: [],
      devs: [],
      devsFiltered: [],
      dailiesFiltered: [],
      showModal: false,
      currentIndex: 0,
      teamsItens: [],
      showResumo: false,
      resumoTexto: "",
      dailyResponse: "",
      teamSelected: "",
    };
  },
  methods: {
    async enviarResposta() {
      const currentDaily = this.dailys[this.currentIndex];
      if (!currentDaily) return;

      try {
        await api.post(`/dailies/${currentDaily.id}/response`, {
          message: this.dailyResponse,
        });
        this.$message.success("Resposta enviada com sucesso!");
        this.dailyResponse = "";
        this.showModal = false;
      } catch (error) {
        this.$message.error("Erro ao enviar resposta");
      }
    },
    buscarDados() {
      if (!this.selectedDate) {
        this.$message.warning("Selecione uma data primeiro!");
        return;
      }
      this.getDailys(this.selectedDate);
    },
    handleSelectChange(val) {
      if (val.includes("all")) {
        this.devsSelected = this.devsFiltered.map((d) => d.id);
      }
      this.dailyFilter(this.devsSelected);
    },
    openDaily(index) {
      this.currentIndex = index;
      this.showModal = true;
    },
    nextDaily() {
      if (this.currentIndex < this.dailys.length - 1) {
        this.currentIndex++;
      }
    },
    prevDaily() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    selectMenu(value) {
      this.teamSelected = value;
      this.devsFilter(Number(value));
      this.devsSelected = this.devsFiltered.map((d) => d.id);
      this.dailyFilter(this.devsSelected);
    },
    async getDailys(date) {
      try {
        const formattedDate = this.formatDateToDDMMYYYY(new Date(date));
        const resp = await api.get(`/dailies/byDate?date=${formattedDate}`);
        this.dailys = resp.data || [];
        this.dailyFilter(this.devsSelected);
      } catch {
        this.$message.error("Erro ao buscar dailys");
      }
    },
    formatDateToDDMMYYYY(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    async initPage() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) {
        this.$router.push({ path: "/login" });
        return;
      }

      try {
        const teamsResp = await api.get("/teams");
        this.teamsItens = teamsResp.data || [];

        if (this.teamsItens.length > 0) {
          this.teamSelected = this.teamsItens[0].id;
          const devsResp = await api.get("/developers");
          this.devs = devsResp.data || [];
          this.devsFilter(this.teamSelected);
          this.devsSelected = this.devsFiltered.map((d) => d.id);

          const today = new Date();
          const formattedDate = this.formatDateToDDMMYYYY(today);
          const dailiesResp = await api.get(`/dailies/byDate?date=${formattedDate}`);
          this.dailys = dailiesResp.data || [];
          this.dailyFilter(this.devsSelected);
        }
      } catch {
        this.$message.error("Erro ao carregar dados iniciais");
      }
    },
    devsFilter(teamId) {
      this.devsFiltered = this.devs.filter((dev) => dev.teamId === teamId);
    },
    dailyFilter(ids) {
      this.dailiesFiltered = this.dailys.filter((daily) => ids.includes(daily.authorId));
    },
    abrirResumo() {
      if (!this.dailiesFiltered.length) {
        this.$message.warning("Nenhuma daily encontrada para gerar resumo!");
        return;
      }
      this.resumoTexto = this.dailiesFiltered
          .map((d) => {
            const dev = this.devs.find((x) => x.id === d.authorId);
            return `👤 ${dev ? dev.name : "Desconhecido"} (${d.date})\n- Ontem: ${
                d.lastDayLog
            }\n- Hoje: ${d.nextDayPlan}\n`;
          })
          .join("\n");
      this.showResumo = true;
    },
    async copiarResumo() {
      try {
        await navigator.clipboard.writeText(this.resumoTexto);
        this.$message.success("Resumo copiado!");
      } catch {
        this.$message.error("Erro ao copiar resumo!");
      }
    },
  },
  mounted() {
    this.initPage();
  },
  computed: {
    isLastDaily() {
      return this.currentIndex === this.dailiesFiltered.length - 1;
    },
    isFirstDaily() {
      return this.currentIndex === 0;
    },
  },
};
</script>
