import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { cn } from "../lib/utils";

export function FileDropzone({ onChange }: { onChange?: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const filtered = incoming.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/"),
    );
    const next = [...files, ...filtered].slice(0, 5);
    setFiles(next);
    onChange?.(next);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const remove = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
          isDragActive && "border-primary bg-primary/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleSelect}
        />
        <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          {isDragActive ? "Drop files here" : "Drag & drop images or videos"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, MP4 up to 25MB · max 5 files</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((f, i) => (
            <div key={i} className="group relative rounded-lg border bg-card p-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs">{f.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
