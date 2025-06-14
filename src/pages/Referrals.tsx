
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Referrals = () => {
  const referralCode = "BUILDAURA2025";
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(`https://buildaura.com/?ref=${referralCode}`);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Earn Free Months
            </h1>
            <p className="text-xl text-gray-600">
              Invite your friends to BuildAura and earn free subscription months for every successful referral
            </p>
          </div>

          <Card className="p-8 mb-12 border-0 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-navy-900 mb-6">Your Referral Stats</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <div className="text-gray-600">Friends Invited</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3</div>
                <div className="text-gray-600">Successful Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-gray-600">Free Months Earned</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🎉 You've earned 3 free months!</h3>
              <p>Your subscription has been extended until April 2025</p>
            </div>
          </Card>

          <Card className="p-8 mb-12 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Share Your Referral Link</h2>
            
            <div className="flex gap-4 mb-6">
              <Input 
                value={`https://buildaura.com/?ref=${referralCode}`}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyCode} className="bg-primary hover:bg-primary/90">
                Copy Link
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center justify-center">
                <span className="mr-2">📧</span>
                Email
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <span className="mr-2">💬</span>
                WhatsApp
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <span className="mr-2">🐦</span>
                Twitter
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <span className="mr-2">💼</span>
                LinkedIn
              </Button>
            </div>
          </Card>

          <Card className="p-8 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">Share Your Link</h3>
                <p className="text-gray-600">Send your unique referral link to friends and colleagues</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">They Sign Up</h3>
                <p className="text-gray-600">Your friend creates an account and starts their free trial</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">You Both Win</h3>
                <p className="text-gray-600">You get a free month, they get 20% off their first month</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Referrals;
