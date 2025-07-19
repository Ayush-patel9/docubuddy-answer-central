
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.uid) return;
      
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          setLocation(data.location || "");
          setExperience(data.experience || "");
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    try {
      await setDoc(doc(db, "profiles", user.uid), {
        name,
        phone,
        location,
        experience,
        email: user.email,
        uid: user.uid,
        updatedAt: new Date().toISOString()
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-blue-700 dark:text-blue-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white dark:bg-gray-900">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300">My Professional Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-8 px-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{user?.email}</div>
            <div className="text-xs text-muted-foreground">User ID: {user?.uid}</div>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSave}>
            <div>
              <Label htmlFor="name" className="text-blue-700 dark:text-blue-300">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-2 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-blue-700 dark:text-blue-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-2 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-blue-700 dark:text-blue-300">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="mt-2 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="experience" className="text-blue-700 dark:text-blue-300">Experience</Label>
              <Input
                id="experience"
                type="text"
                placeholder="e.g. 5 years in AI, Web Dev"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="mt-2 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2 flex justify-center mt-6">
              <Button type="submit" className="bg-blue-700 text-white dark:bg-blue-500 dark:text-white px-8 py-2 rounded-lg shadow hover:bg-blue-800 dark:hover:bg-blue-600">Save</Button>
            </div>
          </form>
          <div className="flex justify-center mt-8">
            <Button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              variant="outline"
              className="text-blue-700 border-blue-700 dark:text-blue-300 dark:border-blue-300"
            >
              Logout
            </Button>
          </div>
          {showToast && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
              Profile saved to Firebase successfully!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
