"use client";

import { useState, useRef } from "react";
import { uploadPhoto } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Camera,
} from "lucide-react";
import {
  compressImage,
  formatFileSize,
  validateImageFile,
} from "@/lib/image-utils";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface UploadPhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadPhotoDialog({ isOpen, onClose }: UploadPhotoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [takenDate, setTakenDate] = useState<Date | null>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - 40 + i,
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setError(null);
    setOriginalSize(file.size);
    setIsCompressing(true);

    try {
      // Compress image
      const compressedFile = await compressImage(file);
      setCompressedSize(compressedFile.size);
      setSelectedFile(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      setError("Failed to process image. Please try again.");
      console.error("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedFile) {
      setError("Please select a photo");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Append the compressed file
      formData.set("file", selectedFile);

      // Add taken date if selected
      if (takenDate) {
        const year = takenDate.getFullYear();
        const month = String(takenDate.getMonth() + 1).padStart(2, "0");
        const day = String(takenDate.getDate()).padStart(2, "0");
        formData.set("takenDate", `${year}-${month}-${day}`);
      }

      const result = await uploadPhoto(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success - close dialog and refresh
        onClose();
        router.refresh();
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setOriginalSize(0);
        setCompressedSize(0);
        setTakenDate(new Date());
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setOriginalSize(0);
      setCompressedSize(0);
      setTakenDate(new Date());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 rounded-[32px] border-gray-100 dark:border-zinc-800 flex flex-col">
        <DialogHeader className="p-6 sm:p-8 pb-4 border-b border-gray-50 dark:border-zinc-800 space-y-0 shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 italic font-dancing">
            Upload Memory
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 pt-0!">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}

            {/* File Upload Area */}
            <div className="space-y-3">
              <Label>Photo</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                relative rounded-[24px] border-2 border-dashed transition-all cursor-pointer overflow-hidden
                ${
                  previewUrl
                    ? "border-pink-300 bg-pink-50/30"
                    : "border-rose-100 bg-rose-50/40 hover:border-pink-300 hover:bg-rose-50"
                }
                ${isCompressing ? "opacity-50 cursor-wait" : ""}
              `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading || isCompressing}
                />

                {previewUrl ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute bottom-4 right-4 bg-pink-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg">
                      {formatFileSize(originalSize)} →{" "}
                      {formatFileSize(compressedSize)}
                    </div>
                  </div>
                ) : (
                  <div className="py-14 flex flex-col items-center justify-center">
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-12 h-12 text-pink-500 mb-4 animate-spin" />
                        <p className="text-sm font-bold text-pink-600">
                          Compressing image...
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-pink-100/50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                          <Upload className="w-9 h-9 text-pink-500" />
                        </div>
                        <p className="text-base font-bold text-rose-900 mb-1">
                          Click to upload photo
                        </p>
                        <p className="text-sm text-rose-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-400" />
                Caption (Optional)
              </Label>
              <Textarea
                name="caption"
                rows={3}
                placeholder="Add a caption to this memory..."
              />
            </div>

            {/* Date Taken */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                Date Taken (Optional)
              </Label>
              <div className="custom-datepicker-wrapper">
                <DatePicker
                  selected={takenDate}
                  onChange={(date: Date | null) => setTakenDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-950/30 bg-rose-50/60 dark:bg-rose-950/20 focus:bg-white dark:focus:bg-rose-950 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all text-rose-900 dark:text-rose-100"
                  calendarClassName="custom-calendar"
                  showPopperArrow={false}
                  popperPlacement="bottom-start"
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between px-2 py-2 gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          decreaseMonth();
                        }}
                        disabled={prevMonthButtonDisabled}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-1">
                        <Select
                          value={date.getMonth().toString()}
                          onValueChange={(val) => changeMonth(parseInt(val))}
                        >
                          <SelectTrigger className="h-8 w-[110px] px-2.5 py-0 text-xs font-bold rounded-lg border-rose-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {months.map((month, index) => (
                              <SelectItem
                                key={month}
                                value={index.toString()}
                                className="text-xs"
                              >
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={date.getFullYear().toString()}
                          onValueChange={(val) => changeYear(parseInt(val))}
                        >
                          <SelectTrigger className="h-8 w-[80px] px-2.5 py-0 text-xs font-bold rounded-lg border-rose-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {years.map((year) => (
                              <SelectItem
                                key={year}
                                value={year.toString()}
                                className="text-xs"
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          increaseMonth();
                        }}
                        disabled={nextMonthButtonDisabled}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Fixed Footer with Actions */}
          <div className="p-6 sm:p-8 pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-2xl text-gray-600 dark:text-gray-400 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="xl"
              disabled={isLoading || !selectedFile || isCompressing}
              className="rounded-2xl shadow-lg shadow-pink-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Upload Photo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
