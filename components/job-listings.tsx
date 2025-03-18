"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MapPin, Clock, Building, ArrowRight } from "lucide-react"

// Mock data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "We're looking for a skilled Frontend Developer with experience in React and Next.js to join our team.",
    requirements: ["3+ years of React experience", "Next.js knowledge", "TypeScript proficiency"],
    postedDate: "2023-10-15",
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    description: "Join our design team to create beautiful and intuitive user experiences for our products.",
    requirements: ["Portfolio showcasing UX work", "Figma expertise", "3+ years of experience"],
    postedDate: "2023-10-10",
  },
  {
    id: 3,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Help us build robust and scalable backend systems using Node.js and PostgreSQL.",
    requirements: ["Node.js experience", "Database design", "API development"],
    postedDate: "2023-10-05",
  },
]

interface JobListingsProps {
  featured?: boolean
}

export default function JobListings({ featured = false }: JobListingsProps) {
  const [jobs, setJobs] = useState(mockJobs)

  // In a real app, you would fetch jobs from your API
  useEffect(() => {
    // Example API call:
    // const fetchJobs = async () => {
    //   const response = await fetch('/api/jobs');
    //   const data = await response.json();
    //   setJobs(data);
    // };
    // fetchJobs();

    // For now, we'll just use the mock data
    if (featured) {
      setJobs(mockJobs.slice(0, 2)) // Only show 2 jobs on the homepage
    }
  }, [featured])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {jobs.map((job) => (
        <motion.div key={job.id} variants={item}>
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{job.type}</Badge>
              </div>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                <span className="flex items-center text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  {job.department}
                </span>
                <span className="flex items-center text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="mb-4 text-muted-foreground">{job.description}</p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
              <Link href={`/jobs/${job.id}/apply`}>
                <Button className="group">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

