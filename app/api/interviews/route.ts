import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Get the user from the database using Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create interviews for each application
    const interviews = []

    for (const applicationId of data.applicationIds) {
      // Get the application to access the candidate
      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          candidate: true,
        },
      })

      if (!application) {
        continue
      }

      // In a real app, you would generate a Google Meet link here
      // using the Google Calendar API
      const meetingUrl = `https://meet.google.com/fake-meeting-${Math.random().toString(36).substring(7)}`

      // Create the interview
      const interview = await prisma.interview.create({
        data: {
          scheduledFor: new Date(data.scheduledFor),
          duration: data.duration || 60,
          meetingUrl,
          notes: data.notes,
          applicationId,
          candidateId: application.candidate.id,
          userId: user.id,
        },
      })

      // Update the application status
      await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status: "Interview Scheduled",
        },
      })

      interviews.push(interview)

      // In a real app, you would send an email to the candidate here
      // using the Gmail API
      console.log(`Email would be sent to ${application.candidate.email} with meeting link ${meetingUrl}`)
    }

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error scheduling interviews:", error)
    return NextResponse.json({ error: "Failed to schedule interviews" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        application: {
          include: {
            position: true,
          },
        },
        candidate: true,
        scheduler: true,
      },
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

