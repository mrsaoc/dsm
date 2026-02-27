import { useEffect, useState, useRef } from "react";
import { Disciplina } from "@/data/disciplinas";
import { X, FileText, Image as ImageIcon, FileArchive, Link as LinkIcon, Folder, ChevronLeft, UploadCloud, Loader2 } from "lucide-react";
import { getDriveFiles, DriveFile } from "@/app/actions/getDriveFiles";
import { uploadDriveFile } from "@/app/actions/uploadDriveFile";

interface Props {
    disciplina: Disciplina | null;
    onClose: () => void;
}

interface FolderHistory {
    id: string;
    name: string;
}

function extractFolderId(url: string) {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diffInDays === 0) return 'Adicionado hoje';
    if (diffInDays === 1) return 'Adicionado ontem';
    return `Adicionado há ${diffInDays} dias`;
}

function getFileIcon(mimeType: string) {
    if (mimeType === 'application/vnd.google-apps.folder') return <Folder className="text-yellow-400 w-6 h-6" fill="currentColor" />;
    if (mimeType.includes('pdf')) return <FileText className="text-red-400 w-6 h-6" />;
    if (mimeType.includes('image')) return <ImageIcon className="text-blue-400 w-6 h-6" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="text-amber-600 w-6 h-6" />;
    if (mimeType.includes('document')) return <FileText className="text-blue-500 w-6 h-6" />;
    if (mimeType.includes('presentation')) return <FileText className="text-yellow-500 w-6 h-6" />;
    return <LinkIcon className="text-neutral-400 w-6 h-6" />;
}

export function DriveDrawer({ disciplina, onClose }: Props) {
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [folderStack, setFolderStack] = useState<FolderHistory[]>([]);

    // NOVO: Estados e Ref para o Upload
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!disciplina) {
            setFolderStack([]);
            setFiles([]);
            setErrorMessage(null);
            return;
        }

        const rootFolderId = extractFolderId(disciplina.linkDrive);
        if (rootFolderId) {
            setFolderStack([{ id: rootFolderId, name: disciplina.nome }]);
        } else {
            setErrorMessage("Link do Google Drive inválido.");
        }
    }, [disciplina]);

    // Extraí a busca de arquivos para uma função que podemos chamar de novo após o upload
    const loadFiles = async (folderId: string) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const response = await getDriveFiles(folderId);

            if (response.error) {
                setErrorMessage(response.error);
                setFiles([]);
            } else if (response.files) {
                const sortedFiles = response.files.sort((a, b) => {
                    const isAFolder = a.mimeType === 'application/vnd.google-apps.folder';
                    const isBFolder = b.mimeType === 'application/vnd.google-apps.folder';
                    if (isAFolder && !isBFolder) return -1;
                    if (!isAFolder && isBFolder) return 1;
                    return 0;
                });
                setFiles(sortedFiles);
            } else {
                setFiles([]);
            }
        } catch (error) {
            console.error("Erro no carregamento:", error);
            setErrorMessage("Erro inesperado ao buscar arquivos.");
            setFiles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (folderStack.length === 0) return;
        loadFiles(folderStack[folderStack.length - 1].id);
    }, [folderStack]);

    const handleBack = () => {
        if (folderStack.length > 1) {
            setFolderStack(prev => prev.slice(0, -1));
        }
    };

    // NOVO: Função que lida com o arquivo selecionado pelo usuário
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || folderStack.length === 0) return;

        const currentFolderId = folderStack[folderStack.length - 1].id;

        setIsUploading(true);
        setErrorMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadDriveFile(formData, currentFolderId);

            if (result.error) {
                setErrorMessage(result.error);
            } else {
                // Sucesso! Recarrega a pasta atual para mostrar o arquivo novo
                await loadFiles(currentFolderId);
            }
        } catch (error) {
            setErrorMessage("Erro crítico ao tentar enviar o arquivo.");
        } finally {
            setIsUploading(false);
            // Limpa o input para poder enviar outro arquivo igual se precisar
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!disciplina) return null;

    const isSubFolder = folderStack.length > 1;
    const currentFolderName = folderStack[folderStack.length - 1]?.name;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed z-50 flex flex-col bg-neutral-900 border border-white/10 shadow-2xl transition-transform duration-300
                inset-x-0 bottom-0 top-20 rounded-t-3xl md:inset-y-0 md:right-0 md:left-auto md:w-[450px] md:top-0 md:rounded-none md:rounded-l-[2.5rem]
            ">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-10 rounded-full"
                            style={{ backgroundColor: disciplina.cor }}
                        />
                        <div>
                            <h3 className="text-white font-semibold text-lg leading-tight truncate max-w-[200px]">
                                {isSubFolder ? currentFolderName : disciplina.nome}
                            </h3>
                            <p className="text-neutral-400 text-sm">
                                {isSubFolder ? "Navegando na pasta" : "Material de Aula"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* NOVO: BOTÃO DE UPLOAD */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50 disabled:cursor-not-allowed border border-white/5"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                            <span className="text-sm font-medium hidden sm:inline">{isUploading ? 'Enviando...' : 'Novo'}</span>
                        </button>

                        {/* INPUT INVISÍVEL PARA ARQUIVOS */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar relative">

                    {isSubFolder && !loading && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition mb-4 px-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Voltar para anterior
                        </button>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-neutral-700 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : errorMessage ? (
                        <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <p className="text-red-400 text-sm font-medium">Ops! Algo deu errado:</p>
                            <p className="text-neutral-400 text-xs mt-2">{errorMessage}</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="text-center text-neutral-500 py-10">
                            Nenhum arquivo ou pasta encontrado.
                        </div>
                    ) : (
                        files.map(file => {
                            const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                            return isFolder ? (
                                <button
                                    key={file.id}
                                    onClick={() => setFolderStack([...folderStack, { id: file.id, name: file.name }])}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition group w-full text-left"
                                >
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        {getFileIcon(file.mimeType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition">
                                            {file.name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 mt-1">Pasta</p>
                                    </div>
                                </button>
                            ) : (
                                <a
                                    key={file.id}
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition group"
                                >
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        {getFileIcon(file.mimeType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition">
                                            {file.name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {getRelativeTime(file.createdTime)}
                                        </p>
                                    </div>
                                </a>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}