import FormContent from "@/components/FormPage/FormContent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Submit Car Listing",
  description: "Submit your car details for listing",
}

/**
 * SubmitCarPage component renders a form page for submitting car listings.
 *
 * @returns {JSX.Element} The main container with a heading and the CarSubmissionForm component.
 */
export default function SubmitCarPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Submit Car Listing</h1>
      <FormContent />
    </main>
  )
}

