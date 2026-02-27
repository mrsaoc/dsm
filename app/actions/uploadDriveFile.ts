// app/actions/uploadDriveFile.ts
'use server';

import { google } from 'googleapis';
import { Readable } from 'stream';

export async function uploadDriveFile(formData: FormData, folderId: string) {
    const file = formData.get('file') as File;

    if (!file) return { error: "Nenhum arquivo recebido." };
    if (!folderId) return { error: "ID da pasta não encontrado." };

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    // O Next.js as vezes escapa as quebras de linha, esse .replace garante que a chave fique no formato certo
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        return { error: "Credenciais de Service Account ausentes no .env.local" };
    }

    try {
        // Autenticando o nosso "Robô"
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Convertendo o arquivo que veio da web para um formato que o Node.js/Google entende (Stream)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        // Fazendo o upload!
        const response = await drive.files.create({
            requestBody: {
                name: file.name,
                parents: [folderId], // Dizemos em qual pasta ele deve ser salvo
            },
            media: {
                mimeType: file.type,
                body: stream,
            },
            fields: 'id, name, webViewLink',
        });

        return { success: true, file: response.data };

    } catch (error: any) {
        console.error("Erro no upload:", error);
        return { error: `Erro ao enviar para o Drive: ${error.message}` };
    }
}