"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  user: {
    name: string;
  };
}

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormData {
  patientId: string;
  medicines: Medicine[];
  notes: string;
}

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Before meals",
  "After meals",
  "At bedtime",
];

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PrescriptionFormData>({
    defaultValues: {
      medicines: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/doctor/patients");
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    if (!data.patientId) {
      toast.error("Please select a patient");
      return;
    }

    if (data.medicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    // Validate medicines
    const invalidMedicine = data.medicines.find(
      (m) => !m.name || !m.dosage || !m.frequency || !m.duration,
    );
    if (invalidMedicine) {
      toast.error("Please fill in all required medicine fields");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/prescriptions", {
        patientId: data.patientId,
        medicines: data.medicines,
        notes: data.notes || "",
      });
      toast.success("Prescription created successfully");
      router.push("/dashboard/doctor/prescriptions");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create prescription",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Prescription</h1>
        <p className="text-muted-foreground">
          Create a new prescription for your patient
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Select the patient for this prescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Select onValueChange={(value) => setValue("patientId", value)}>
                  <SelectTrigger id="patientId">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("patientId", {
                    required: "Patient is required",
                  })}
                />
                {errors.patientId && (
                  <p className="text-sm text-destructive">
                    {errors.patientId.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Medicines</CardTitle>
                <CardDescription>
                  Add medicines to the prescription
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                {index > 0 && <Separator />}
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Medicine {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`medicines.${index}.name`}>
                      Medicine Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`medicines.${index}.name`}
                      placeholder="e.g., Amoxicillin"
                      {...register(`medicines.${index}.name` as const, {
                        required: "Medicine name is required",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`medicines.${index}.dosage`}>
                      Dosage <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`medicines.${index}.dosage`}
                      placeholder="e.g., 500mg"
                      {...register(`medicines.${index}.dosage` as const, {
                        required: "Dosage is required",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`medicines.${index}.frequency`}>
                      Frequency <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(`medicines.${index}.frequency`, value)
                      }
                    >
                      <SelectTrigger id={`medicines.${index}.frequency`}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register(`medicines.${index}.frequency` as const, {
                        required: "Frequency is required",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`medicines.${index}.duration`}>
                      Duration <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`medicines.${index}.duration`}
                      placeholder="e.g., 7 days"
                      {...register(`medicines.${index}.duration` as const, {
                        required: "Duration is required",
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`medicines.${index}.instructions`}>
                    Instructions
                  </Label>
                  <Textarea
                    id={`medicines.${index}.instructions`}
                    placeholder="e.g., Take with food"
                    rows={2}
                    {...register(`medicines.${index}.instructions` as const)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Add any additional instructions or notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="General instructions, precautions, follow-up details..."
              rows={4}
              {...register("notes")}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Prescription
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
