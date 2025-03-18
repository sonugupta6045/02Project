"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, FileText, User, Mail, Phone, Briefcase, CheckCircle } from "lucide-react"

export default function ApplyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [step, setStep] = useState(1)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parsedData, setParsedData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    candidateId: "",
    resumeUrl: "",
    coverLetter: "",
  })

  const handleResumeUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/resume-parser", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to parse resume")
      }

      const data = await response.json()
      setParsedData({
        ...parsedData,
        name: data.name,
        email: data.email,
        phone: data.phone,
        skills: data.skills.join(", "),
        experience: data.experience,
        candidateId: data.candidateId,
        resumeUrl: data.resumeUrl,
      })
      setResumeUploaded(true)
      toast({
        title: "Resume uploaded successfully",
        description: "We've extracted your information. Please review and make any necessary changes.",
        variant: "default",
      })
      setStep(2)
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: "Failed to parse resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: params.id,
          candidateId: parsedData.candidateId,
          resumeUrl: parsedData.resumeUrl,
          coverLetter: parsedData.coverLetter,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit application")
      }

      router.push(`/jobs/${params.id}/apply/success`)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setParsedData((prev) => ({ ...prev, [name]: value }))
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href={`/jobs/${params.id}`}
            className="inline-flex items-center text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job details
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Apply for Position</CardTitle>
              <CardDescription>Complete the application process to apply for this position.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="ml-2 font-medium">Resume</span>
                    </div>
                    <div
                      className={`flex-1 border-t-2 mx-4 ${step >= 2 ? "border-primary" : "border-muted-foreground"}`}
                    ></div>
                    <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <span className="ml-2 font-medium">Review</span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs value={`step-${step}`} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="step-1" disabled={step !== 1} onClick={() => setStep(1)}>
                    Upload Resume
                  </TabsTrigger>
                  <TabsTrigger value="step-2" disabled={!resumeUploaded} onClick={() => resumeUploaded && setStep(2)}>
                    Review Information
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <TabsContent value="step-1" className="py-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            Upload Your Resume
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            Please upload your resume. We'll automatically extract your information to make the
                            application process easier. We support PDF and Word documents.
                          </p>
                          <FileUploader onFileUpload={handleResumeUpload} />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <Link href={`/jobs/${params.id}`}>
                            <Button variant="outline">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                          </Link>
                          <Button onClick={() => resumeUploaded && setStep(2)} disabled={!resumeUploaded}>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>
                  )}

                  {step === 2 && (
                    <TabsContent value="step-2" className="py-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={parsedData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email" className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={parsedData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              Phone
                            </Label>
                            <Input id="phone" name="phone" value={parsedData.phone} onChange={handleInputChange} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="skills" className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                              Skills
                            </Label>
                            <Textarea
                              id="skills"
                              name="skills"
                              value={parsedData.skills}
                              onChange={handleInputChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience" className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                              Experience
                            </Label>
                            <Textarea
                              id="experience"
                              name="experience"
                              value={parsedData.experience}
                              onChange={handleInputChange}
                              required
                              rows={4}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="coverLetter" className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              Cover Letter (Optional)
                            </Label>
                            <Textarea
                              id="coverLetter"
                              name="coverLetter"
                              value={parsedData.coverLetter}
                              onChange={handleInputChange}
                              placeholder="Tell us why you're interested in this position and why you'd be a good fit."
                              rows={6}
                            />
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Submit Application
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

