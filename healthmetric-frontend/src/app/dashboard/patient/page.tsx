"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Calendar,
  FileText,
  Pill,
  Activity,
  ArrowRight,
  Bell,
} from "lucide-react";

export default function PatientDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalReports: 0,
    activePrescriptions: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointments, reports, prescriptions, notifications] =
        await Promise.all([
          api.get("/appointments"),
          api.get("/reports"),
          api.get("/prescriptions"),
          api.get("/notifications"),
        ]);

      const upcomingAppointments = appointments.data.filter(
        (apt: any) => apt.status === "PENDING" || apt.status === "APPROVED",
      ).length;

      const activePrescriptions = prescriptions.data.filter((presc: any) => {
        const createdDate = new Date(presc.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo;
      }).length;

      const unreadNotifications = notifications.data.filter(
        (notif: any) => !notif.read,
      ).length;

      setStats({
        upcomingAppointments,
        totalReports: reports.data.length,
        activePrescriptions,
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
      title: "Book Appointment",
      description: "Schedule a visit with a doctor",
      icon: Calendar,
      href: "/dashboard/patient/appointments",
      color: "text-blue-600",
    },
    {
      title: "Upload Report",
      description: "Add medical reports and documents",
      icon: FileText,
      href: "/dashboard/patient/reports",
      color: "text-green-600",
    },
    {
      title: "View Prescriptions",
      description: "Check your current medications",
      icon: Pill,
      href: "/dashboard/patient/prescriptions",
      color: "text-purple-600",
    },
    {
      title: "Track Vitals",
      description: "Monitor your health metrics",
      icon: Activity,
      href: "/dashboard/patient/analytics",
      color: "text-red-600",
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
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your health overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.upcomingAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending or approved visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Medical Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              Total uploaded documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Prescriptions
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activePrescriptions}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
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
