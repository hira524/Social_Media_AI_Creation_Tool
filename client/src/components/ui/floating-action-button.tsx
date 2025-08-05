import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Image, History, Heart, Settings } from "lucide-react";

interface FloatingActionButtonProps {
  onActionSelect?: (action: string) => void;
}

export default function FloatingActionButton({ onActionSelect }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'create', icon: Sparkles, label: 'Create Image', color: 'from-primary to-purple-600' },
    { id: 'gallery', icon: Image, label: 'View Gallery', color: 'from-blue-500 to-cyan-500' },
    { id: 'history', icon: History, label: 'History', color: 'from-green-500 to-emerald-500' },
    { id: 'favorites', icon: Heart, label: 'Favorites', color: 'from-pink-500 to-rose-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-slate-500 to-gray-600' },
  ];

  const handleAction = (actionId: string) => {
    onActionSelect?.(actionId);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div className={`flex flex-col-reverse space-y-reverse space-y-2 mb-3 transition-all duration-200 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
      }`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="relative group"
              style={{ transitionDelay: isOpen ? `${index * 30}ms` : '0ms' }}
            >
              {/* Label */}
              <div className="absolute right-14 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium text-slate-700 shadow-sm border border-white/40">
                  {action.label}
                </div>
              </div>
              
              {/* Action button */}
              <Button
                onClick={() => handleAction(action.id)}
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-0`}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0 ${
          isOpen ? 'rotate-45 scale-105' : 'rotate-0 scale-100'
        }`}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
