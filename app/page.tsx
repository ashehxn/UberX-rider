import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <img src="/kamu-logo.png" height="196" width="196" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">Kamu.lk</h1>
          <p className="text-green-600 text-center">
            Deliver happiness, one meal at a time
          </p>
        </div>

        <Card className="shadow-lg border-green-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Link href="/login" className="block w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 py-6"
                >
                  Register as a Rider
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
