"use client";

import { Prescription } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";
import { toast } from "sonner";

interface PrescriptionSheetProps {
  prescription: Prescription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrescriptionSheet({
  prescription,
  open,
  onOpenChange,
}: PrescriptionSheetProps) {
  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(
        `/api/prescriptions/${prescription.id}/pdf`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${prescription.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Prescription downloaded");
    } catch (error) {
      toast.error("Failed to download prescription");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Prescription Details</SheetTitle>
          <SheetDescription>
            Issued on{" "}
            {format(new Date(prescription.createdAt), "MMMM dd, yyyy")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {prescription.doctor?.user.name || "Dr. Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {prescription.doctor?.specialization || "General"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(new Date(prescription.createdAt), "MMMM dd, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Medicines Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Prescribed Medicines</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescription.medicines.map((medicine, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {medicine.name}
                      </TableCell>
                      <TableCell>{medicine.dosage}</TableCell>
                      <TableCell>{medicine.frequency}</TableCell>
                      <TableCell>{medicine.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Instructions */}
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Instructions:</h4>
              {prescription.medicines.map(
                (medicine, index) =>
                  medicine.instructions && (
                    <div key={index} className="text-sm text-muted-foreground">
                      <span className="font-medium">{medicine.name}:</span>{" "}
                      {medicine.instructions}
                    </div>
                  ),
              )}
            </div>
          </div>

          {/* Notes */}
          {prescription.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                <p className="text-sm text-muted-foreground">
                  {prescription.notes}
                </p>
              </div>
            </>
          )}

          {/* Download Button */}
          <Button onClick={handleDownloadPDF} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
