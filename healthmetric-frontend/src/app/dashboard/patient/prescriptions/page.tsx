"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Prescription } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PrescriptionSheet } from "@/components/prescriptions/PrescriptionSheet";
import { FileText, User, Calendar, Pill } from "lucide-react";
import { format, subDays } from "date-fns";
import { toast } from "sonner";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/prescriptions");
      setPrescriptions(response.data);
    } catch (error) {
      toast.error("Failed to fetch prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setSheetOpen(true);
  };

  const thirtyDaysAgo = subDays(new Date(), 30);
  const currentPrescriptions = prescriptions.filter(
    (p) => new Date(p.createdAt) >= thirtyDaysAgo,
  );
  const pastPrescriptions = prescriptions.filter(
    (p) => new Date(p.createdAt) < thirtyDaysAgo,
  );

  const PrescriptionCard = ({
    prescription,
  }: {
    prescription: Prescription;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">
              {prescription.doctor?.user.name || "Dr. Unknown"}
            </CardTitle>
            <CardDescription className="text-xs">
              {format(new Date(prescription.createdAt), "MMM dd, yyyy")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Pill className="h-4 w-4 text-muted-foreground" />
          <span>
            {prescription.medicines.length} medicine
            {prescription.medicines.length !== 1 ? "s" : ""}
          </span>
        </div>
        {prescription.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {prescription.notes}
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => handleViewDetails(prescription)}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Prescriptions</h1>
        <p className="text-muted-foreground">View your medical prescriptions</p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">
            Current (Last 30 days) ({currentPrescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastPrescriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : currentPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No current prescriptions</p>
                <p className="text-sm text-muted-foreground">
                  Your recent prescriptions will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No past prescriptions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastPrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedPrescription && (
        <PrescriptionSheet
          prescription={selectedPrescription}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </div>
  );
}
