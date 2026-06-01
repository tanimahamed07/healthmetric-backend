"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface UploadReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface UploadFormData {
  title: string;
  reportType: string;
  file: FileList;
}

const REPORT_TYPES = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "Lab Report",
  "Prescription",
  "Other",
];

export function UploadReportDialog({
  open,
  onOpenChange,
  onSuccess,
}: UploadReportDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>();

  const onSubmit = async (data: UploadFormData) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Step 1: Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", data.file[0]);

      setUploadProgress(30);
      const uploadResponse = await api.post(
        "/api/upload-cloudinary",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const { fileUrl, publicId } = uploadResponse.data;

      setUploadProgress(60);

      // Step 2: Create report record
      await api.post("/api/reports", {
        title: data.title,
        fileUrl,
        publicId,
        reportType: data.reportType,
      });

      setUploadProgress(100);
      reset();
      onSuccess();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload report");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Medical Report</DialogTitle>
          <DialogDescription>
            Upload a new medical report to your records
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              placeholder="e.g., Blood Test Results - Jan 2024"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select
              onValueChange={(value) => setValue("reportType", value)}
              defaultValue=""
            >
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("reportType", {
                required: "Report type is required",
              })}
            />
            {errors.reportType && (
              <p className="text-sm text-destructive">
                {errors.reportType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,image/*"
              {...register("file", {
                required: "File is required",
                validate: {
                  fileSize: (files) => {
                    if (files[0]?.size > 10 * 1024 * 1024) {
                      return "File size must be less than 10MB";
                    }
                    return true;
                  },
                },
              })}
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (Max 10MB)
            </p>
            {errors.file && (
              <p className="text-sm text-destructive">{errors.file.message}</p>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
