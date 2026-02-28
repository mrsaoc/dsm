import { useEffect, useState, useRef } from "react";
import { Disciplina } from "@/data/disciplinas";
import {
    X, FileText, Image as ImageIcon, FileArchive, Link as LinkIcon,
    Folder, ChevronRight, UploadCloud, FolderOpen, AlertCircle, RefreshCw
} from "lucide-react";
import { getDriveFiles, DriveFile } from "@/app/actions/getDriveFiles";
import { uploadDriveFile } from "@/app/actions/uploadDriveFile";
import { toast } from "sonner";

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
    if (mimeType === 'application/vnd.google-apps.folder') return <Folder className="text-yellow-500/80 w-6 h-6" fill="currentColor" />;
    if (mimeType.includes('pdf')) return <FileText className="text-red-400/80 w-6 h-6" />;
    if (mimeType.includes('image')) return <ImageIcon className="text-blue-400/80 w-6 h-6" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="text-amber-500/80 w-6 h-6" />;
    if (mimeType.includes('document')) return <FileText className="text-blue-500/80 w-6 h-6" />;
    if (mimeType.includes('presentation')) return <FileText className="text-orange-400/80 w-6 h-6" />;
    return <LinkIcon className="text-neutral-500 w-6 h-6" />;
}

export function DriveDrawer({ disciplina, onClose }: Props) {
    // ESTADOS DE ANIMAÇÃO E CICLO DE VIDA
    const [localDisciplina, setLocalDisciplina] = useState<Disciplina | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // ESTADOS DE DADOS
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [folderStack, setFolderStack] = useState<FolderHistory[]>([]);

    // ESTADOS DE UPLOAD
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // LÓGICA DE MONTAGEM E DESMONTAGEM (Delayed Unmount)
    useEffect(() => {
        if (disciplina) {
            setLocalDisciplina(disciplina);
            const rootFolderId = extractFolderId(disciplina.linkDrive);
            if (rootFolderId) setFolderStack([{ id: rootFolderId, name: disciplina.nome }]);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setLocalDisciplina(null);
                setFolderStack([]);
                setFiles([]);
                setErrorMessage(null);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [disciplina]);

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
            }
        } catch (e) {
            setErrorMessage("Erro crítico de ligação.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (folderStack.length === 0) return;
        loadFiles(folderStack[folderStack.length - 1].id);
    }, [folderStack]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || folderStack.length === 0) return;

        const currentFolderId = folderStack[folderStack.length - 1].id;

        setIsUploading(true);
        setUploadProgress(10);

        const formData = new FormData();
        formData.append('file', file);

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
                toast.success("Arquivo enviado!", { description: `${file.name} adicionado.` });
                await loadFiles(currentFolderId);
            }
        } catch (error) {
            toast.error("Erro de ligação", { description: "Não foi possível enviar o ficheiro." });
        } finally {
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!localDisciplina) return null;

    // Curva de transição Apple-like
    const springTransition = { transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' };

    return (
        <>
            {/* OVERLAY */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer transition-opacity duration-500`}
                style={{ ...springTransition, opacity: isVisible ? 1 : 0 }}
                onClick={onClose}
            />

            {/* DRAWER LATERAL/INFERIOR */}
            <div
                className={`
                    fixed z-50 flex flex-col bg-[#050505]/80 backdrop-blur-3xl border border-white/[0.04] shadow-2xl transition-all duration-500
                    inset-x-0 bottom-0 top-20 rounded-t-[2.5rem] 
                    md:inset-y-0 md:right-0 md:left-auto md:w-[450px] md:top-0 md:rounded-none md:rounded-l-[2.5rem]
                    ${isVisible ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
                `}
                style={springTransition}
            >
                {/* BARRA DE PROGRESSO GLOBAL DO UPLOAD */}
                {isUploading && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.02] z-[60]">
                        <div
                            className="h-full bg-blue-500/80 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}

                {/* CABEÇALHO FIXO */}
                <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-10 rounded-full opacity-80" style={{ backgroundColor: localDisciplina.cor }} />
                        <div>
                            <h3 className="text-neutral-200 font-medium text-lg leading-tight tracking-tight truncate max-w-[200px]">
                                {localDisciplina.nome}
                            </h3>
                            <p className="text-neutral-400 text-[13px] font-light tracking-wide mt-0.5">
                                Drive da Turma
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* BOTÃO DE UPLOAD */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading || !!errorMessage}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 outline-none
                                ${isUploading || !!errorMessage
                                ? 'bg-white/[0.02] border-white/[0.02] text-neutral-600 cursor-not-allowed'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] active:bg-white/[0.08] active:scale-[0.96] border-white/[0.05] text-neutral-300 cursor-pointer'
                            }
                            `}
                        >
                            {isUploading ? (
                                <div className="relative flex h-2 w-2 ml-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </div>
                            ) : (
                                <UploadCloud className="w-4 h-4 opacity-80" />
                            )}
                            <span className="text-[13px] font-medium hidden sm:inline ml-1">
                                {/* UX: Perceção de Upload (Ideia 5) */}
                                {isUploading
                                    ? (uploadProgress >= 90 ? 'A processar...' : 'A enviar...')
                                    : 'Novo'
                                }
                            </span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                        {/* BOTÃO DE FECHAR */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full outline-none bg-transparent hover:bg-white/[0.05] active:bg-white/[0.1] active:scale-90 text-neutral-400 hover:text-neutral-300 transition-all duration-300 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 custom-scrollbar relative flex flex-col">

                    {/* BREADCRUMBS (Trilha de Navegação) */}
                    {folderStack.length > 1 && !errorMessage && (
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-2 border-b border-white/[0.04]">
                            {folderStack.map((folder, index) => {
                                const isLast = index === folderStack.length - 1;
                                return (
                                    <div key={folder.id} className="flex items-center gap-1.5 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                if (!isLast) setFolderStack(prev => prev.slice(0, index + 1));
                                            }}
                                            className={`text-[13px] tracking-wide transition-colors outline-none ${
                                                isLast
                                                    ? 'text-neutral-200 font-medium cursor-default'
                                                    : 'text-neutral-400 hover:text-neutral-200 font-light cursor-pointer active:scale-[0.98]'
                                            }`}
                                        >
                                            {index === 0 ? 'Raiz' : folder.name}
                                        </button>
                                        {!isLast && <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {errorMessage ? (
                        /* ESTADO DE ERRO */
                        <div className="flex flex-col flex-1 items-center justify-center min-h-[300px] text-neutral-600 animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-16 h-16 mb-5 rounded-[1.25rem] bg-red-500/[0.03] border border-red-500/[0.1] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                                <AlertCircle className="w-7 h-7 text-red-400/80" strokeWidth={1.5} />
                            </div>
                            <p className="text-[15px] font-medium tracking-wide text-neutral-200">Ligação Indisponível</p>
                            <p className="text-[13px] font-light tracking-wide text-neutral-400 mt-2 mb-6 text-center px-6 leading-relaxed max-w-[280px]">
                                Verifique a sua ligação ou se a pasta tem permissões públicas no Drive.
                            </p>
                            <button
                                onClick={() => loadFiles(folderStack[folderStack.length - 1].id)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] text-neutral-300 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white active:scale-[0.96] transition-all duration-300 outline-none cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="text-[13px] font-medium">Tentar novamente</span>
                            </button>
                        </div>
                    ) : loading ? (
                        /* SKELETONS PIXEL PERFECT */
                        <div className="space-y-2 pt-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-transparent border border-transparent">
                                    <div className="p-2.5 bg-white/[0.02] rounded-[14px]">
                                        <div className="w-6 h-6 bg-white/[0.05] rounded-md animate-pulse" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2.5">
                                        <div className="h-3.5 bg-white/[0.05] rounded-md w-3/4 animate-pulse" />
                                        <div className="h-2.5 bg-white/[0.02] rounded-md w-1/3 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : files.length === 0 ? (
                        /* EMPTY STATE PREMIUM */
                        <div className="flex flex-col flex-1 items-center justify-center min-h-[300px] animate-in fade-in duration-1000">
                            <div className="w-16 h-16 mb-5 rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                                <FolderOpen className="w-6 h-6 opacity-60 text-neutral-400" strokeWidth={1.5} />
                            </div>
                            <p className="text-[14px] font-medium tracking-wide text-neutral-300">Pasta vazia</p>
                            <p className="text-[13px] font-light tracking-wide text-neutral-400 mt-1 mb-6 text-center px-6 leading-relaxed">
                                Ainda não há materiais por aqui.
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-[0.96] transition-all duration-300 outline-none cursor-pointer"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span className="text-[13px] font-medium">Enviar arquivo</span>
                            </button>
                        </div>
                    ) : (
                        /* LISTA DE ARQUIVOS */
                        <div className="space-y-2 pb-4">
                            {files.map(file => (
                                <a
                                    key={file.id}
                                    href={file.mimeType === 'application/vnd.google-apps.folder' ? undefined : file.webViewLink}
                                    target={file.mimeType === 'application/vnd.google-apps.folder' ? undefined : "_blank"}
                                    onClick={file.mimeType === 'application/vnd.google-apps.folder' ? (e) => {
                                        e.preventDefault();
                                        setFolderStack([...folderStack, { id: file.id, name: file.name }]);
                                    } : undefined}
                                    className="flex items-center gap-4 p-3.5 rounded-2xl outline-none bg-transparent hover:bg-white/[0.03] active:bg-white/[0.05] active:scale-[0.98] border border-transparent hover:border-white/[0.04] transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="p-2.5 bg-white/[0.02] group-hover:bg-white/[0.04] group-active:bg-white/[0.06] transition-colors duration-300 rounded-[14px]">
                                        {getFileIcon(file.mimeType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-neutral-200 text-[14px] font-medium tracking-tight truncate group-hover:text-white transition-colors duration-300">
                                            {file.name}
                                        </h4>
                                        <p className="text-[12px] font-light text-neutral-400 mt-0.5 tracking-wide">
                                            {file.mimeType === 'application/vnd.google-apps.folder' ? 'Pasta' : getRelativeTime(file.createdTime)}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}