import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Building } from "lucide-react"

// In a real app, this would fetch from your API
async function getJob(id: string) {
  // Mock data for now
  return {
    id: Number.parseInt(id),
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for a skilled Frontend Developer with experience in React and Next.js to join our team. You'll be responsible for building user interfaces, implementing new features, and ensuring the performance and reliability of our web applications.",
    requirements: [
      "3+ years of experience with React",
      "Experience with Next.js and TypeScript",
      "Strong understanding of HTML, CSS, and JavaScript",
      "Experience with responsive design and cross-browser compatibility",
      "Familiarity with RESTful APIs and GraphQL",
      "Good understanding of web performance optimization techniques",
      "Ability to write clean, maintainable code",
      "Experience with testing frameworks like Jest and React Testing Library",
    ],
    responsibilities: [
      "Develop and maintain user interfaces for our web applications",
      "Collaborate with designers, product managers, and backend developers",
      "Implement new features and improve existing ones",
      "Ensure the performance, quality, and responsiveness of applications",
      "Identify and fix bugs and performance bottlenecks",
      "Participate in code reviews and help maintain code quality",
      "Stay up-to-date with emerging trends and technologies",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote work options",
      "Professional development budget",
      "Home office stipend",
      "Paid time off and parental leave",
    ],
    postedDate: "2023-10-15",
  }
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all jobs
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {job.department}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.type}
                  </Badge>
                </div>
              </CardDescription>
            </div>
            <Link href={`/jobs/${job.id}/apply`}>
              <Button size="lg">Apply Now</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.benefits.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-6">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            Posted: {new Date(job.postedDate).toLocaleDateString()}
          </p>
          <Link href={`/jobs/${job.id}/apply`}>
            <Button>Apply for this Position</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

