import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AwaitingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg border-green-100">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-green-800">
              Application Under Review
            </CardTitle>
            <CardDescription className="text-center">
              Your rider application is currently being reviewed by our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-gray-500">
                    We've received your application
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-full border-2 border-amber-500 flex items-center justify-center flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                </div>
                <div>
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-gray-500">
                    We're verifying your driver's license
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-500">Background Check</p>
                  <p className="text-sm text-gray-500">
                    Standard verification process
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-500">Approval</p>
                  <p className="text-sm text-gray-500">
                    Final step before you can start delivering
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">
                  Approval in Progress
                </p>
                <p className="text-sm text-amber-700">
                  This process typically takes 1-3 business days. We'll notify
                  you by email once your application is approved.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                Back to Login
              </Button>
            </Link>
            <div className="text-sm text-center text-gray-500">
              Have questions? Contact our support at{" "}
              <a
                href="mailto:support@ubereats.com"
                className="text-green-600 hover:underline"
              >
                support@kamu.lk
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
