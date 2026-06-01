"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { Doctor } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface AppointmentFormData {
  doctorId: string;
  date: Date;
  timeSlot: string;
  notes: string;
}

export function BookAppointmentDialog({
  open,
  onOpenChange,
  onSuccess,
}: BookAppointmentDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [doctors, setDoctors] = useState<
    (Doctor & { user: { name: string; image?: string } })[]
  >([]);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (Doctor & { user: { name: string; image?: string } }) | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue } = useForm<AppointmentFormData>();

  useEffect(() => {
    if (open && step === 1) {
      fetchDoctors();
    }
  }, [open, step]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/doctors");
      setDoctors(response.data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      setLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await api.get("/api/appointments/slots", {
        params: {
          doctorId: selectedDoctor.id,
          date: dateStr,
        },
      });
      setAvailableSlots(response.data);
    } catch (error) {
      toast.error("Failed to fetch available slots");
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (
    doctor: Doctor & { user: { name: string; image?: string } },
  ) => {
    setSelectedDoctor(doctor);
    setValue("doctorId", doctor.id);
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue("date", date);
      setStep(3);
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setValue("timeSlot", slot);
    setStep(4);
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setSubmitting(true);
      await api.post("/api/appointments", {
        doctorId: selectedDoctor?.id,
        date: format(selectedDate!, "yyyy-MM-dd"),
        timeSlot: selectedSlot,
        notes: data.notes || "",
      });
      resetDialog();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetDialog = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(undefined);
    setSelectedSlot("");
    setAvailableSlots([]);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const isDayAvailable = (date: Date) => {
    if (!selectedDoctor?.availability) return false;
    const dayName = format(date, "EEEE");
    const dayAvailability = selectedDoctor.availability[dayName];
    return dayAvailability?.available || false;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment - Step {step} of 4</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select a doctor"}
            {step === 2 && "Choose a date"}
            {step === 3 && "Pick a time slot"}
            {step === 4 && "Confirm your appointment"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {doctor.user.name}
                          </CardTitle>
                          <CardDescription>
                            {doctor.specialization}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    {doctor.experience && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {doctor.experience} years of experience
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <p className="font-medium">{selectedDoctor?.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor?.specialization}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || !isDayAvailable(date)}
                className="rounded-md border"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Only available days are selectable
            </p>
          </div>
        )}

        {/* Step 3: Select Time Slot */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <p className="font-medium">
                  {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor?.user.name}
                </p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No slots available</p>
                <p className="text-sm text-muted-foreground">
                  Please select a different date
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant="outline"
                    onClick={() => handleSlotSelect(slot)}
                    className="h-12"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(3)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="font-medium">Confirm Appointment</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedDoctor?.user.name}
                  </span>
                  <span className="text-muted-foreground">
                    - {selectedDoctor?.specialization}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedSlot}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or symptoms..."
                rows={3}
                {...register("notes")}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
