# DSM - Painel de Aulas (4º Ciclo)

Aplicação web desenvolvida para centralizar materiais de estudo e horários de aula da turma de Desenvolvimento de Software Multiplataforma. O projeto foca em uma interface minimalista e funcionalidade mobile-first.

## Funcionalidades Principais

- **Filtro por Dia:** Navegação entre os dias da semana através de um grid fixo, permitindo visualizar o cronograma específico de cada dia.
- **Sinalizador de Aula Ativa:** Identificação automática do horário atual para destacar visualmente a disciplina que está ocorrendo no momento.
- **Integração com Google Drive:**
    - Navegação de pastas e subpastas integrada ao painel.
    - Acesso direto a arquivos de aula.
- **Upload Comunitário:** Sistema de envio de arquivos para o Drive da turma utilizando Service Account, permitindo a colaboração entre alunos.
- **PWA (Instalável):** Suporte para instalação na tela inicial de dispositivos móveis, funcionando como um aplicativo nativo.
- **Sistema de Notificações:** Feedback visual via Toasts para confirmação de ações de upload e mensagens de erro.

## Tecnologias Utilizadas

- **Framework:** Next.js 14+ (App Router)
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React
- **Backend:** Google Drive API v3 (Server Actions)
- **Notificações:** Sonner

## Configuração Local

1. Clone o repositório:
   ```bash
   git clone [https://github.com/mrsaoc/dsm.git](https://github.com/mrsaoc/dsm.git)