export const categoriasGestao = [
  "Ativos Tecnológicos",
  "Report de Incidentes",
  "Documentação Interna",
  "Pen Tests",
  "Outras Evidências",
];

export const categoriasPedidos = [
  "Incidente de Segurança",
  "Phishing",
  "Malware",
  "Ransomware",
  "Vulnerabilidades",
  "Pen Test",
  "Auditoria",
  "NIS2",
  "Gestão Documental",
  "Configuração de Sistemas",
  "Backup e Recuperação",
  "Formação",
  "Suporte Técnico",
  "Pedido Comercial",
  "Contacto Geral",
  "Outro",
];

export const pedidoCamposPorCategoria = {
  "Incidente de Segurança": [
    { name: "data_incidente", label: "Data do incidente", type: "date" },
    { name: "sistema_afetado", label: "Sistema afetado" },
    { name: "impacto", label: "Impacto", options: ["Baixo", "Médio", "Alto", "Crítico"] },
  ],
  Phishing: [
    { name: "email_origem", label: "Email de origem" },
    { name: "assunto_email", label: "Assunto do email" },
    { name: "link_anexo", label: "Link ou anexo suspeito" },
  ],
  Malware: [
    { name: "equipamento_afetado", label: "Equipamento afetado" },
    { name: "tipo_malware", label: "Tipo de malware" },
    { name: "acoes_tomadas", label: "Ações já tomadas", type: "textarea" },
  ],
  Ransomware: [
    { name: "equipamentos_afetados", label: "Equipamentos afetados" },
    { name: "dados_encriptados", label: "Dados encriptados?", options: ["Sim", "Não", "Por confirmar"] },
    { name: "pedido_resgate", label: "Pedido de resgate recebido?", options: ["Sim", "Não"] },
  ],
  Vulnerabilidades: [
    { name: "ativo_afetado", label: "Ativo afetado" },
    { name: "criticidade", label: "Criticidade", options: ["Baixa", "Média", "Alta", "Crítica"] },
    { name: "referencia_cve", label: "Referência CVE/CWE" },
  ],
  "Pen Test": [
    { name: "ambito", label: "Âmbito do teste", type: "textarea" },
    { name: "janela_preferencial", label: "Janela preferencial" },
    { name: "contacto_tecnico", label: "Contacto técnico" },
  ],
  Auditoria: [
    { name: "norma_referencia", label: "Norma/referencial" },
    { name: "periodo_desejado", label: "Período desejado" },
    { name: "areas_incluidas", label: "Áreas incluídas", type: "textarea" },
  ],
  NIS2: [
    { name: "entidade_abrangida", label: "Entidade abrangida" },
    { name: "estado_conformidade", label: "Estado de conformidade", options: ["Por iniciar", "Em curso", "Parcial", "Conforme"] },
    { name: "necessidade", label: "Necessidade principal", type: "textarea" },
  ],
  "Gestão Documental": [
    { name: "tipo_documento", label: "Tipo de documento" },
    { name: "acao_pretendida", label: "Ação pretendida", options: ["Criar", "Rever", "Atualizar", "Aprovar"] },
  ],
  "Configuração de Sistemas": [
    { name: "sistema", label: "Sistema" },
    { name: "ambiente", label: "Ambiente", options: ["Produção", "Teste", "Desenvolvimento"] },
    { name: "alteracao_pretendida", label: "Alteração pretendida", type: "textarea" },
  ],
  "Backup e Recuperação": [
    { name: "sistema_dados", label: "Sistema/dados" },
    { name: "data_referencia", label: "Data de referência", type: "date" },
    { name: "tipo_pedido", label: "Tipo de pedido", options: ["Backup", "Restauro", "Validação"] },
  ],
  Formação: [
    { name: "tema", label: "Tema" },
    { name: "participantes", label: "Número de participantes", type: "number" },
    { name: "formato", label: "Formato", options: ["Remoto", "Presencial", "Híbrido"] },
  ],
  "Suporte Técnico": [
    { name: "sistema", label: "Sistema" },
    { name: "urgencia", label: "Urgência", options: ["Baixa", "Normal", "Alta"] },
    { name: "erro_observado", label: "Erro observado", type: "textarea" },
  ],
  "Pedido Comercial": [
    { name: "servico_interesse", label: "Serviço de interesse" },
    { name: "prazo", label: "Prazo pretendido" },
    { name: "orcamento", label: "Orçamento estimado" },
  ],
  "Contacto Geral": [
    { name: "motivo", label: "Motivo do contacto" },
    { name: "contacto_preferencial", label: "Contacto preferencial" },
  ],
  Outro: [
    { name: "tipo_pedido", label: "Tipo de pedido" },
    { name: "detalhes_adicionais", label: "Detalhes adicionais", type: "textarea" },
  ],
};

export const documentoCamposPorCategoria = {
  "Ativos Tecnológicos": [
    { name: "entidade", label: "Entidade" },
    { name: "data_inventario", label: "Data do inventário", type: "date" },
    { name: "responsavel", label: "Responsável" },
  ],
  "Report de Incidentes": [
    { name: "data_incidente", label: "Data do incidente", type: "date" },
    { name: "tipo_incidente", label: "Tipo de incidente" },
    { name: "impacto", label: "Impacto", options: ["Baixo", "Médio", "Alto", "Crítico"] },
    { name: "descricao_incidente", label: "Descrição do incidente", type: "textarea" },
    { name: "medidas_tomadas", label: "Medidas tomadas", type: "textarea" },
  ],
  "Documentação Interna": [
    { name: "tipo_documento", label: "Tipo de documento" },
    { name: "versao", label: "Versão" },
    { name: "area_responsavel", label: "Área responsável" },
  ],
  "Pen Tests": [
    { name: "ambito", label: "Âmbito" },
    { name: "data_teste", label: "Data do teste", type: "date" },
    { name: "resultado", label: "Resultado" },
  ],
  "Outras Evidências": [
    { name: "tipo_evidencia", label: "Tipo de evidência" },
    { name: "data_evidencia", label: "Data da evidência", type: "date" },
    { name: "observacoes", label: "Observações", type: "textarea" },
  ],
};

export const artigoCamposPorCategoria = {};
