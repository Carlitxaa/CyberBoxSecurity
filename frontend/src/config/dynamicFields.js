export const categoriasGestao = [
  "Relatórios",
  "Documentação",
  "Pen Tests",
  "Incidentes",
  "Políticas",
  "Auditorias",
  "NIS2",
  "Outros",
];

export const artigoCamposPorCategoria = {
  Relatórios: [
    { name: "data_relatorio", label: "Data do relatório", type: "date" },
    { name: "tipo_relatorio", label: "Tipo de relatório" },
    { name: "cliente_associado", label: "Cliente associado (opcional)" },
  ],
  "Pen Tests": [
    { name: "ferramenta_utilizada", label: "Ferramenta utilizada" },
    { name: "data_teste", label: "Data do teste", type: "date" },
    { name: "nivel_criticidade", label: "Nível de criticidade", options: ["Baixa", "Média", "Alta", "Crítica"] },
  ],
  Incidentes: [
    { name: "severidade", label: "Severidade", options: ["Baixa", "Média", "Alta", "Crítica"] },
    { name: "data_incidente", label: "Data do incidente", type: "date" },
    { name: "estado_resolucao", label: "Estado da resolução", options: ["Aberto", "Em análise", "Resolvido"] },
  ],
  Políticas: [
    { name: "versao", label: "Versão" },
    { name: "data_entrada_vigor", label: "Data de entrada em vigor", type: "date" },
  ],
  Auditorias: [
    { name: "tipo_auditoria", label: "Tipo de auditoria" },
    { name: "data", label: "Data", type: "date" },
    { name: "resultado", label: "Resultado" },
  ],
  NIS2: [
    { name: "controlo_associado", label: "Controlo associado" },
    { name: "estado_conformidade", label: "Estado de conformidade", options: ["Conforme", "Parcial", "Não conforme"] },
  ],
};

export const documentoCamposPorCategoria = {
  Relatórios: [
    { name: "tipo_relatorio", label: "Tipo de relatório" },
    { name: "data", label: "Data", type: "date" },
    { name: "cliente", label: "Cliente" },
  ],
  Documentação: [
    { name: "tipo_documento", label: "Tipo de documento" },
    { name: "versao", label: "Versão" },
  ],
  "Pen Tests": [
    { name: "ferramenta", label: "Ferramenta" },
    { name: "data", label: "Data", type: "date" },
    { name: "resultado", label: "Resultado" },
  ],
  Incidentes: [
    { name: "data", label: "Data", type: "date" },
    { name: "gravidade", label: "Gravidade", options: ["Baixa", "Média", "Alta", "Crítica"] },
    { name: "estado", label: "Estado", options: ["Aberto", "Em análise", "Resolvido"] },
  ],
  Políticas: [
    { name: "versao", label: "Versão" },
    { name: "data_aprovacao", label: "Data de aprovação", type: "date" },
  ],
  Auditorias: [
    { name: "tipo", label: "Tipo" },
    { name: "data", label: "Data", type: "date" },
    { name: "resultado", label: "Resultado" },
  ],
  NIS2: [
    { name: "controlo", label: "Controlo" },
    { name: "estado", label: "Estado", options: ["Conforme", "Parcial", "Não conforme"] },
  ],
};
