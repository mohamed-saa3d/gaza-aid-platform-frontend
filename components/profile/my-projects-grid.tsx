"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { myProjects } from "@/lib/mock-data"

export function MyProjectsGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">مشاريعي</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {myProjects.map((project) => (
            <div key={project.id} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              </div>
              <span className="text-sm font-semibold text-foreground">{project.title}</span>
              <div className="flex items-center gap-2">
                <Progress value={project.progress} className="h-1.5" />
                <span className="text-xs font-medium text-muted-foreground">{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
