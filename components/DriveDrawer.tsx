import { useEffect, useState, useRef } from "react";
import { Disciplina } from "@/data/disciplinas";
import { X, FileText, Image as ImageIcon, FileArchive, Link as LinkIcon, Folder, ChevronLeft, UploadCloud, Loader2 } from "lucide-react";
import { getDriveFiles, DriveFile } from "@/app/actions/getDriveFiles";
import { uploadDriveFile } from "@/app/actions/uploadDriveFile";
import { toast } from "sonner"; // Importamos o toast

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

    // Estados para Upload e Progresso
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!disciplina) {
            setFolderStack([]);
            setFiles([]);
            setErrorMessage(null);
            return;
        }
        const rootFolderId = extractFolderId(disciplina.linkDrive);
        if (rootFolderId) setFolderStack([{ id: rootFolderId, name: disciplina.nome }]);
    }, [disciplina]);

    const loadFiles = async (folderId: string) => {
        setLoading(true);
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
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (folderStack.length === 0) return;
        loadFiles(folderStack[folderStack.length - 1].id);
    }, [folderStack]);

    const handleBack = () => {
        if (folderStack.length > 1) setFolderStack(prev => prev.slice(0, -1));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || folderStack.length === 0) return;

        const currentFolderId = folderStack[folderStack.length - 1].id;

        setIsUploading(true);
        setUploadProgress(10); // Início visual

        const formData = new FormData();
        formData.append('file', file);

        // Simulando progresso para dar feedback visual (Ideia 2)
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => (prev < 90 ? prev + 5 : prev));
        }, 400);

        try {
            const result = await uploadDriveFile(formData, currentFolderId);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result.error) {
                toast.error("Erro no upload", { description: result.error });
            } else {
                // Notificação de Sucesso (Ideia 1)
                toast.success("Arquivo enviado!", {
                    description: `${file.name} já está na pasta da turma.`
                });
                await loadFiles(currentFolderId);
            }
        } catch (error) {
            toast.error("Erro crítico", { description: "Não foi possível conectar ao servidor." });
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!disciplina) return null;

    const isSubFolder = folderStack.length > 1;
    const currentFolderName = folderStack[folderStack.length - 1]?.name;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />

            <div className="fixed z-50 flex flex-col bg-neutral-900 border border-white/10 shadow-2xl transition-transform duration-300
                inset-x-0 bottom-0 top-20 rounded-t-3xl md:inset-y-0 md:right-0 md:left-auto md:w-[450px] md:top-0 md:rounded-none md:rounded-l-[2.5rem]
            ">
                {/* BARRA DE PROGRESSO (Ideia 2) */}
                {isUploading && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-[60]">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-10 rounded-full" style={{ backgroundColor: disciplina.cor }} />
                        <div>
                            <h3 className="text-white font-semibold text-lg leading-tight truncate max-w-[200px]">{isSubFolder ? currentFolderName : disciplina.nome}</h3>
                            <p className="text-neutral-400 text-sm">{isSubFolder ? "Navegando" : "Materiais"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50 border border-white/5 cursor-pointer active:scale-95"
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <UploadCloud className="w-4 h-4" />}
                            <span className="text-sm font-medium hidden sm:inline">{isUploading ? 'Enviando...' : 'Novo'}</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white transition cursor-pointer active:scale-90">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar relative">
                    {isSubFolder && !loading && (
                        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition mb-4 px-2 cursor-pointer group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Voltar
                        </button>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-neutral-700 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : (
                        files.map(file => (
                            <a
                                key={file.id}
                                href={file.mimeType === 'application/vnd.google-apps.folder' ? undefined : file.webViewLink}
                                target={file.mimeType === 'application/vnd.google-apps.folder' ? undefined : "_blank"}
                                onClick={file.mimeType === 'application/vnd.google-apps.folder' ? (e) => {
                                    e.preventDefault();
                                    setFolderStack([...folderStack, { id: file.id, name: file.name }]);
                                } : undefined}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition group cursor-pointer active:scale-[0.99]"
                            >
                                <div className="p-3 bg-white/5 rounded-xl">{getFileIcon(file.mimeType)}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition">{file.name}</h4>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {file.mimeType === 'application/vnd.google-apps.folder' ? 'Pasta' : getRelativeTime(file.createdTime)}
                                    </p>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}