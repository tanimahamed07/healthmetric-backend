"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Calendar, Users, Pill, Clock, ArrowRight, Bell } from "lucide-react";

export default function DoctorDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointments, notifications] = await Promise.all([
        api.get("/appointments"),
        api.get("/notifications"),
      ]);

      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = appointments.data.filter(
        (apt: any) => apt.date === today,
      ).length;

      const pendingAppointments = appointments.data.filter(
        (apt: any) => apt.status === "PENDING",
      ).length;

      // Get unique patients
      const uniquePatients = new Set(
        appointments.data.map((apt: any) => apt.patient_id),
      );

      const unreadNotifications = notifications.data.filter(
        (notif: any) => !notif.read,
      ).length;

      setStats({
        todayAppointments,
        pendingAppointments,
        totalPatients: uniquePatients.size,
        unreadNotifications,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "View Appointments",
      description: "Manage your scheduled appointments",
      icon: Calendar,
      href: "/dashboard/doctor/appointments",
      color: "text-blue-600",
    },
    {
      title: "Create Prescription",
      description: "Write a new prescription for patient",
      icon: Pill,
      href: "/dashboard/doctor/prescriptions/new",
      color: "text-green-600",
    },
    {
      title: "My Patients",
      description: "View and manage patient records",
      icon: Users,
      href: "/dashboard/doctor/patients",
      color: "text-purple-600",
    },
    {
      title: "Update Schedule",
      description: "Manage your availability",
      icon: Clock,
      href: "/dashboard/doctor/schedule",
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your practice overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Under your care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.unreadNotifications}
            </div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(action.href)}
            >
              <CardContent className="p-6">
                <action.icon className={`h-8 w-8 mb-3 ${action.color}`} />
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {action.description}
                </p>
                <Button variant="ghost" size="sm" className="p-0">
                  Go <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
