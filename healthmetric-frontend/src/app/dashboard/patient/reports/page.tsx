"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Report } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadReportDialog } from "@/components/reports/UploadReportDialog";
import { Download, Trash2, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    // Filter reports by title
    if (searchQuery.trim() === "") {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter((report) =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/reports");
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await api.delete(`/api/reports/${reportId}`);
      toast.success("Report deleted successfully");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const handleUploadSuccess = () => {
    setDialogOpen(false);
    fetchReports();
    toast.success("Report uploaded successfully");
  };

  const getReportTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Blood Test": "bg-red-100 text-red-800",
      "X-Ray": "bg-blue-100 text-blue-800",
      MRI: "bg-purple-100 text-purple-800",
      "Lab Report": "bg-green-100 text-green-800",
      Prescription: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors["Other"];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-muted-foreground">
            View and manage your medical reports
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Upload your first medical report to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(report.createdAt), "MMM dd, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge className={getReportTypeBadgeColor(report.reportType)}>
                    {report.reportType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(report.fileUrl, "_blank")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UploadReportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
