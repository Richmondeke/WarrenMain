"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function UploadDropzone() {
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setError(null);

        if (!file.name.match(/\.(csv|xlsx|xls)$/)) {
            setError("Please upload a CSV or Excel spreadsheet.");
            return;
        }

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/ingest-investors", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process the spreadsheet");
            }

            const json = await response.json();

            // Store the result in local storage or handle it via a new state
            sessionStorage.setItem("warrenintel_investors", JSON.stringify(json.data));

            // Redirect to results or dashboard
            router.push(`/dashboard`);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during processing.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div
                className={`relative border-2 border-dashed rounded-[2rem] p-8 md:p-12 text-center transition-all duration-200 ${isDragging
                    ? "border-primary bg-primary/10"
                    : "border-glass-border bg-card/30 hover:bg-card/50 hover:border-primary/30"
                    } ${isAnalyzing ? "pointer-events-none opacity-80" : "cursor-pointer"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isAnalyzing}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Ingesting Investors...</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                    Processing your spreadsheet and structuring the database. This may take a few moments.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-secondary/50 rounded-full border border-glass-border">
                                <UploadCloud className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Upload Investor Spreadsheet</h3>
                                <p className="text-muted-foreground text-sm">
                                    Drag and drop your CSV or Excel file here, or click to browse
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-glass-border">
                                <FileText className="w-3 h-3" />
                                CSV, XLSX ONLY
                            </div>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
