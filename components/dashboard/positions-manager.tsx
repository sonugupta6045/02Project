"use client"

import { useState, memo, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Mock data - would come from your database in production
const mockPositions = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    applicants: 24,
    postedDate: "2023-10-15",
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    status: "Open",
    applicants: 18,
    postedDate: "2023-10-10",
  },
  {
    id: 3,
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    applicants: 15,
    postedDate: "2023-10-05",
  },
  {
    id: 4,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Closed",
    applicants: 32,
    postedDate: "2023-09-20",
  },
  {
    id: 5,
    title: "Data Scientist",
    department: "Data",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    applicants: 12,
    postedDate: "2023-10-01",
  },
]

// Memoized table row component for better performance
const PositionRow = memo(
  ({
    position,
    onToggleStatus,
    onEdit,
  }: {
    position: (typeof mockPositions)[0]
    onToggleStatus: (id: number) => void
    onEdit: (position: (typeof mockPositions)[0]) => void
  }) => (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-muted/50"
    >
      <TableCell className="font-medium">{position.title}</TableCell>
      <TableCell>{position.department}</TableCell>
      <TableCell>{position.location}</TableCell>
      <TableCell>{position.type}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            position.status === "Open"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {position.status}
        </Badge>
      </TableCell>
      <TableCell>{position.applicants}</TableCell>
      <TableCell>{new Date(position.postedDate).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(position)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit position</span>
          </Button>
          <Button
            variant={position.status === "Open" ? "destructive" : "outline"}
            size="sm"
            onClick={() => onToggleStatus(position.id)}
          >
            {position.status === "Open" ? "Close" : "Reopen"}
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  ),
)

PositionRow.displayName = "PositionRow"

export function PositionsManager() {
  const [positions, setPositions] = useState(mockPositions)
  const [isAddingPosition, setIsAddingPosition] = useState(false)
  const [isEditingPosition, setIsEditingPosition] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<(typeof mockPositions)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [newPosition, setNewPosition] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  })

  const addPosition = () => {
    // In a real app, this would call an API to add the position
    const position = {
      id: positions.length + 1,
      ...newPosition,
      status: "Open",
      applicants: 0,
      postedDate: new Date().toISOString().split("T")[0],
    }

    setPositions([...positions, position])
    setIsAddingPosition(false)
    setNewPosition({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
    })
  }

  const editPosition = () => {
    if (!currentPosition) return

    setPositions(positions.map((pos) => (pos.id === currentPosition.id ? currentPosition : pos)))
    setIsEditingPosition(false)
    setCurrentPosition(null)
  }

  const togglePositionStatus = (id: number) => {
    setPositions(
      positions.map((position) => {
        if (position.id === id) {
          return {
            ...position,
            status: position.status === "Open" ? "Closed" : "Open",
          }
        }
        return position
      }),
    )
  }

  const handleEdit = (position: (typeof mockPositions)[0]) => {
    setCurrentPosition(position)
    setIsEditingPosition(true)
  }

  // Filter positions based on search term and status
  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesSearch =
        position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || position.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [positions, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage)
  const paginatedPositions = filteredPositions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddingPosition} onOpenChange={setIsAddingPosition}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Position</DialogTitle>
                <DialogDescription>Create a new job position for your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newPosition.title}
                      onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newPosition.department}
                      onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newPosition.location}
                      onChange={(e) => setNewPosition({ ...newPosition, location: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      value={newPosition.type}
                      onValueChange={(value) => setNewPosition({ ...newPosition, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newPosition.description}
                    onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    value={newPosition.requirements}
                    onChange={(e) => setNewPosition({ ...newPosition, requirements: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPosition(false)}>
                  Cancel
                </Button>
                <Button onClick={addPosition}>Add Position</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPositions.length > 0 ? (
              paginatedPositions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  onToggleStatus={togglePositionStatus}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No positions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Position Dialog */}
      <Dialog open={isEditingPosition} onOpenChange={setIsEditingPosition}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>Update the job position details.</DialogDescription>
          </DialogHeader>
          {currentPosition && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={currentPosition.title}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={currentPosition.department}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={currentPosition.location}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Job Type</Label>
                  <Select
                    value={currentPosition.type}
                    onValueChange={(value) => setCurrentPosition({ ...currentPosition, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPosition(false)}>
              Cancel
            </Button>
            <Button onClick={editPosition}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

