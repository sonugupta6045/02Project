import { NextResponse } from "next/server"

// This is a mock resume parser API
// In a real app, you would use a service like Affinda, Sovren, or build your own ML model
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In a real app, you would process the file and extract information
    // For this demo, we'll return mock data

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock parsed data
    const parsedData = {
      name: "John Applicant",
      email: "john.applicant@example.com",
      phone: "+1 (555) 987-6543",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      experience: "5 years of frontend development experience",
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Computer Science",
          year: "2018",
        },
      ],
      // Store the file URL for later retrieval
      resumeUrl: `/uploads/${Date.now()}-${file.name}`,
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}

