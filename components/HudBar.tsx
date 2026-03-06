"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PetKind, PetBreed } from "@/types/pet";
import { CatType } from "@/types/cat";
import { DogType } from "@/types/dog";
import CatFaceIcon from "./CatFaceIcon";
import DogFaceIcon from "./DogFaceIcon";
import { Pet } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HudBarProps {
  petName: string;
  daysTogether: number;
  totalPats: number;
  petMood: string;
  petKind: PetKind;
  petBreed: PetBreed;
  allPets: Pet[];
  selectedPetId: string | null;
  onPetChange: (petId: string) => void;
  onAddPet: () => void;
  // New stat fields
  happiness?: number;
  hunger?: number;
  energy?: number;
  cleanliness?: number;
  health?: number;
  totalFeeds?: number;
  totalPlays?: number;
  totalBaths?: number;
  lastFed?: string;
  lastPlayed?: string;
  lastBathed?: string;
  currentScene?: string;
}

export default function HudBar({
  petName,
  daysTogether,
  totalPats,
  petMood,
  petKind,
  petBreed,
  allPets,
  selectedPetId,
  onPetChange,
  onAddPet,
  happiness = 75,
  hunger = 50,
  energy = 80,
  cleanliness = 70,
  health = 90,
  totalFeeds = 0,
  totalPlays = 0,
  totalBaths = 0,
  lastFed,
  lastPlayed,
  lastBathed,
  currentScene = "room",
}: HudBarProps) {
  // Deduplicate pets by id
  const uniquePets = Array.from(
    new Map(allPets.map((pet) => [pet.id, pet])).values(),
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dropdownOpen]);

  const isCat = petKind === "cat";
  const moodEmoji =
    {
      ecstatic: "🤩",
      happy: "😊",
      content: "🙂",
      neutral: "😐",
      tired: "🥱",
      hungry: "😿",
      grumpy: "😾",
      sad: "🥺",
    }[petMood.toLowerCase()] ?? "💖";

  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        right: "12px",
        zIndex: 30,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "flex-start" : "space-between",
        alignItems: "flex-start",
        gap: isMobile ? "8px" : "20px",
        pointerEvents: "none",
      }}
    >
      {/* Left controls: pet selector + exit button */}
      <div style={{ display: "flex", gap: "8px", pointerEvents: "auto", flexWrap: "wrap" }}>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "4px" : "8px",
              padding: isMobile ? "6px 10px" : "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "2px solid rgb(101, 50, 15)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "600",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255, 255, 255, 1)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            {isCat ? (
              <CatFaceIcon type={petBreed as CatType} size={isMobile ? 16 : 20} />
            ) : (
              <DogFaceIcon type={petBreed as DogType} size={isMobile ? 16 : 20} />
            )}
            {!isMobile && <span>{petName}</span>}
            <span style={{ fontSize: "12px" }}>▼</span>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                marginTop: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgb(101, 50, 15)",
                borderRadius: "6px",
                minWidth: "200px",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              {uniquePets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => {
                    onPetChange(pet.id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor:
                      selectedPetId === pet.id
                        ? "rgba(200, 180, 140, 0.3)"
                        : "transparent",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPetId !== pet.id) {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "rgba(200, 180, 140, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPetId !== pet.id) {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {pet.pet_type === "cat" ? (
                    <CatFaceIcon type={pet.pet_breed as CatType} size={18} />
                  ) : (
                    <DogFaceIcon type={pet.pet_breed as DogType} size={18} />
                  )}
                  <span>{pet.pet_name}</span>
                </button>
              ))}

              {/* Add Pet Button */}
              <button
                onClick={() => {
                  onAddPet();
                  setDropdownOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "rgba(101, 50, 15, 0.1)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "rgb(101, 50, 15)",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(101, 50, 15, 0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "rgba(101, 50, 15, 0.1)";
                }}
              >
                <span style={{ fontSize: "18px" }}>+</span>
                <span>Add Pet</span>
              </button>
            </div>
          )}
        </div>

        <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
          <AlertDialogTrigger asChild>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "3px" : "6px",
                padding: isMobile ? "6px 10px" : "8px 12px",
                backgroundColor: "rgba(255, 245, 245, 0.95)",
                border: "2px solid rgba(176, 60, 60, 0.7)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: isMobile ? "11px" : "13px",
                fontWeight: 700,
                color: "#8a2d2d",
              }}
            >
              <span>↩</span>
              {!isMobile && <span>Exit Game</span>}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Exit game?</AlertDialogTitle>
              <AlertDialogDescription>
                You will leave the game and go back to dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => {
                  setExitDialogOpen(false);
                  router.push("/dashboard");
                }}
              >
                Exit to Dashboard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Stats Display */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "6px" : "12px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#5a3a1c",
          pointerEvents: "auto",
        }}
      >
        {/* Primary Stats Row - Compact on mobile */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? "6px" : "8px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <StatCard 
            label="Days" 
            value={daysTogether} 
            minWidth={isMobile ? "50px" : "70px"}
            compact={isMobile}
          />
          <StatCard 
            label="Pats" 
            value={totalPats} 
            minWidth={isMobile ? "50px" : "70px"}
            compact={isMobile}
          />
          <StatCard
            label="Mood"
            value={`${moodEmoji}`}
            minWidth={isMobile ? "50px" : "70px"}
            compact={isMobile}
            style={{ fontSize: "14px" }}
          />
        </div>

        {/* Scene-Specific Stats - Compact on mobile */}
        {(currentScene === "feed" || currentScene === "play" || currentScene === "bath") && (
          <div
            style={{
              display: "flex",
              gap: isMobile ? "4px" : "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {currentScene === "feed" && (
              <>
                <StatCard label="Feeds" value={totalFeeds} minWidth={isMobile ? "45px" : "65px"} compact={isMobile} />
                {lastFed && (
                  <StatCard
                    label="Last Fed"
                    value={formatTimeAgo(lastFed)}
                    minWidth={isMobile ? "60px" : "90px"}
                    fontSize={isMobile ? "9px" : "10px"}
                    compact={isMobile}
                  />
                )}
              </>
            )}

            {currentScene === "play" && (
              <>
                <StatCard label="Plays" value={totalPlays} minWidth={isMobile ? "45px" : "65px"} compact={isMobile} />
                {lastPlayed && (
                  <StatCard
                    label="Last Play"
                    value={formatTimeAgo(lastPlayed)}
                    minWidth={isMobile ? "60px" : "90px"}
                    fontSize={isMobile ? "9px" : "10px"}
                    compact={isMobile}
                  />
                )}
              </>
            )}

            {currentScene === "bath" && (
              <>
                <StatCard label="Baths" value={totalBaths} minWidth={isMobile ? "45px" : "65px"} compact={isMobile} />
                {lastBathed && (
                  <StatCard
                    label="Last Bath"
                    value={formatTimeAgo(lastBathed)}
                    minWidth={isMobile ? "60px" : "90px"}
                    fontSize={isMobile ? "9px" : "10px"}
                    compact={isMobile}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Pet Health/Status Stats - Desktop only */}
        {!isTablet && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
              gap: "6px",
              fontSize: "11px",
            }}
          >
            <StatMeter label="HP" value={health} maxValue={100} />
            <StatMeter label="Happiness" value={happiness} maxValue={100} />
            <StatMeter label="Energy" value={energy} maxValue={100} />
            <StatMeter label="Hunger" value={hunger} maxValue={100} />
            <StatMeter label="Clean" value={cleanliness} maxValue={100} />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for stat cards
function StatCard({
  label,
  value,
  minWidth,
  fontSize,
  compact,
  style,
}: {
  label: string;
  value: string | number;
  minWidth?: string;
  fontSize?: string;
  compact?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        border: "2px solid rgba(101, 50, 15, 0.22)",
        borderRadius: "10px",
        padding: compact ? "4px 6px" : "6px 8px",
        minWidth: minWidth || "70px",
        textAlign: "right",
        ...style,
      }}
    >
      <span style={{ fontSize: compact ? "7px" : "9px", opacity: 0.75, display: "block" }}>
        {label}
      </span>
      <span style={{ fontSize: fontSize || compact ? "12px" : "14px", fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
}

// Helper component for stat meters
function StatMeter({
  label,
  value,
  maxValue = 100,
}: {
  label: string;
  value: number;
  maxValue?: number;
}) {
  const percentage = (value / maxValue) * 100;
  let barColor = "#4ade80"; // green
  if (percentage < 30)
    barColor = "#ef4444"; // red
  else if (percentage < 60) barColor = "#eab308"; // yellow

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        border: "1px solid rgba(101, 50, 15, 0.2)",
        borderRadius: "6px",
        padding: "4px",
        minWidth: "60px",
      }}
    >
      <div
        style={{
          fontSize: "8px",
          fontWeight: 700,
          marginBottom: "2px",
          color: "#5a3a1c",
        }}
      >
        {label}
      </div>
      <div
        style={{
          backgroundColor: "rgba(200, 180, 140, 0.3)",
          borderRadius: "2px",
          height: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: barColor,
            height: "100%",
            width: `${percentage}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div style={{ fontSize: "7px", color: "#999", marginTop: "1px" }}>
        {Math.round(value)}/{maxValue}
      </div>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  } catch {
    return "unknown";
  }
}
