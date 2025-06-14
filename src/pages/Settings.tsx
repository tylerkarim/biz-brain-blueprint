
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "Startup Inc."
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    marketingEmails: false
  });

  const handleSaveProfile = () => {
    // Save profile logic
    console.log("Profile saved:", profile);
  };

  const handleSavePreferences = () => {
    // Save preferences logic
    console.log("Preferences saved:", preferences);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Settings</h1>
            <p className="text-xl text-gray-600">Manage your account preferences and billing</p>
          </div>

          <div className="space-y-8">
            {/* Profile Settings */}
            <Card className="p-8 border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                  </label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="w-full"
                  />
                </div>
                
                <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                  Save Profile
                </Button>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="p-8 border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications about your account activity</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
                    <p className="text-sm text-gray-600">Get a weekly summary of your progress and new features</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.weeklyDigest}
                    onChange={(e) => setPreferences({...preferences, weeklyDigest: e.target.checked})}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={preferences.marketingEmails}
                    onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
                    className="w-5 h-5 text-primary"
                  />
                </div>
                
                <Button onClick={handleSavePreferences} className="bg-primary hover:bg-primary/90">
                  Save Preferences
                </Button>
              </div>
            </Card>

            {/* Billing */}
            <Card className="p-8 border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Billing & Subscription</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Plan</h3>
                    <p className="text-sm text-gray-600">Pro Monthly - $9/month</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Next Billing Date</h3>
                    <p className="text-sm text-gray-600">January 15, 2025</p>
                  </div>
                  <Button variant="outline">Update Payment</Button>
                </div>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-8 border-0 shadow-lg border-red-200">
              <h2 className="text-2xl font-bold text-red-600 mb-6">Danger Zone</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
