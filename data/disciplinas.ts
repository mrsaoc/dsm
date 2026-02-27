export interface Disciplina {
    id: string;
    nome: string;
    professor: string;
    sala: string; // Deixei genérico, você pode editar
    dias: number[]; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
    horarios: string;
    cor: string;
    linkDrive: string;
}

export const disciplinas: Disciplina[] = [
    {
        id: "IOT",
        nome: "Internet das Coisas & Aplicações",
        professor: "Paulo Candido",
        sala: "Lab 07", // Preencher
        dias: [1], // Segunda
        horarios: "15:00 - 18:30",
        cor: "#4ADE80", // Verde Menta
        linkDrive: "https://drive.google.com/drive/folders/17thZVXVNjqB0iTXZaPEklHhClzFmnCEa?usp=sharing", // PREENCHER DEPOIS
    },
    {
        id: "CI/CD",
        nome: "Integração & Entrega Contínua",
        professor: "Paulo Candido",
        sala: "Lab 02",
        dias: [2], // Terça
        horarios: "15:00 - 18:30",
        cor: "#D1C4C4", // Cinza/Bege
        linkDrive: "https://drive.google.com/drive/folders/13MVreOO-0jGwx5U2zH4hleO2n4w1xwHV?usp=sharing",
    },
    {
        id: "UX",
        nome: "Experiência do Usuário",
        professor: "André",
        sala: "Lab 02",
        dias: [3], // Quarta
        horarios: "15:00 - 16:40",
        cor: "#C084FC", // Roxo Claro
        linkDrive: "https://drive.google.com/drive/folders/12gYJOWK0EED3TgQ_8_9vgPlm0xBPy53z?usp=drive_link",
    },
    {
        id: "LDW",
        nome: "Laboratório de Desenvolvimento Web",
        professor: "Eulaliane",
        sala: "Lab 02 - Lab 09",
        dias: [3, 4], // Quarta e Quinta
        horarios: "13:10 - 14:40",
        cor: "#E879F9", // Rosa/Fuchsia
        linkDrive: "https://drive.google.com/drive/folders/1lx2a0t-3ngd9COxVkF41NonWTXLlWik9?usp=drive_link",
    },
    {
        id: "PDM1",
        nome: "Prog. de Dispositivos Móveis I",
        professor: "Alessandro",
        sala: "Lab 08",
        dias: [4], // Quinta
        horarios: "15:00 - 18:30",
        cor: "#818CF8", // Índigo/Azul
        linkDrive: "https://drive.google.com/drive/folders/1N1bevvzGIZV7nsGacBpMw1bHafwLwX5T?usp=drive_link",
    },
    {
        id: "EA",
        nome: "Estatística Aplicada",
        professor: "Carlos",
        sala: "S1B2",
        dias: [5], // Sexta
        horarios: "13:10 - 16:40",
        cor: "#FB7185", // Vermelho/Coral
        linkDrive: "https://drive.google.com/drive/folders/1IXz3C85b5wSeUDecKZBFi8s1Roy-KzeC?usp=drive_link",
    },
    {
        id: "I2",
        nome: "Inglês II",
        professor: "Rosemary",
        sala: "S2B2",
        dias: [5], // Sexta
        horarios: "17:00 - 18:30",
        cor: "#60A5FA", // Azul Céu
        linkDrive: "https://drive.google.com/drive/folders/1TDBQWckKLJCVhsY78yTvy12l_ttIhffI?usp=drive_link",
    },
    {
        id: "TEST",
        nome: "Aula de Teste",
        professor: "Dr. Debug",
        horarios: "18:50 - 22:00", // Coloque um horário que englobe o agora
        sala: "Lab Teste",
        dias: [5], // 5 é Sexta-feira, mude para o número do seu dia atual
        linkDrive: "https://google.com",
        cor: "#FF5733"
    },
];