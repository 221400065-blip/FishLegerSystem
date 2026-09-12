"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { t, notifications, markNotificationAsRead, deleteNotification, clearAllNotifications } = useLanguage();

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("notifications")}</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage your alerts</p>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllNotifications}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto self-start sm:self-auto"
          >
            <Trash2 size={16} className="mr-2" /> Clear All
          </Button>
        )}
      </div>

      <Card className="rounded-xl shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell size={20} className="text-[var(--color-aqua)]" />
            All Notifications
            <Badge variant="secondary" className="ml-2 bg-[var(--color-aqua)]/10 text-[var(--color-aqua)]">
              {notifications.length} Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <Bell size={40} className="text-slate-300" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 md:p-6 transition-colors ${!notification.isRead ? 'bg-[var(--color-aqua)]/5' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${!notification.isRead ? 'bg-[var(--color-aqua)]' : 'bg-slate-300'}`}></div>
                    <div className="space-y-1 min-w-0 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm md:text-base font-semibold truncate ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">{notification.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 break-words line-clamp-2 md:line-clamp-none">
                        {notification.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs bg-white text-slate-500 border-slate-200">
                        {notification.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end justify-end shrink-0 mt-2 sm:mt-0">
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-[var(--color-aqua)] hover:text-[var(--color-ocean-blue)] hover:bg-[var(--color-aqua)]/10 h-8 px-2 text-xs"
                      >
                        <CheckCircle2 size={14} className="mr-1" /> Mark Read
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 px-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
