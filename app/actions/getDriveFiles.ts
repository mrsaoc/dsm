'use server';

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    createdTime: string;
    webViewLink: string;
}

export async function getDriveFiles(folderId: string): Promise<{ files?: DriveFile[]; error?: string }> {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    if (!folderId || !apiKey) {
        return { error: "Faltou a API Key no .env.local ou o ID da pasta." };
    }

    // AQUI ESTAVA O PROBLEMA! Eu tirei a parte que bloqueava as pastas.
    // Agora ele busca TUDO que estiver lá dentro (arquivos e pastas).
    const query = `'${folderId}' in parents`;

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${apiKey}&fields=files(id,name,mimeType,createdTime,webViewLink)&orderBy=createdTime%20desc`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            return { error: `Erro do Google: ${data.error.message}` };
        }

        return { files: data.files || [] };
    } catch (error: any) {
        return { error: `Erro de conexão: ${error.message}` };
    }
}