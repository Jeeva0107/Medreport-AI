"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  FileText,
  Scan,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Beaker,
  Radio,
  Upload,
  X,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const labSampleReports = [
  { id: "cbc", name: "Complete Blood Count (CBC)", type: "lab" },
  { id: "lipid", name: "Lipid Panel", type: "lab" },
  { id: "metabolic", name: "Comprehensive Metabolic Panel", type: "lab" },
  { id: "thyroid", name: "Thyroid Function Test", type: "lab" },
  { id: "hemoglobin", name: "Hemoglobin A1C", type: "lab" },
]

const radiologySampleReports = [
  { id: "chest-xray", name: "Chest X-Ray", type: "radiology" },
  { id: "brain-mri", name: "Brain MRI", type: "radiology" },
  { id: "ct-abdomen", name: "CT Abdomen/Pelvis", type: "radiology" },
  { id: "knee-mri", name: "Knee MRI", type: "radiology" },
  { id: "spine-xray", name: "Spine X-Ray", type: "radiology" },
]

const sampleReportContent: Record<string, string> = {
  cbc: `COMPLETE BLOOD COUNT (CBC)
Patient: John Doe | DOB: 05/15/1980 | Date: 01/05/2026

White Blood Cells (WBC): 7.2 x10^9/L (Normal: 4.5-11.0)
Red Blood Cells (RBC): 4.8 x10^12/L (Normal: 4.5-5.5)
Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)
Hematocrit: 42% (Normal: 38-50%)
Platelet Count: 245 x10^9/L (Normal: 150-400)
MCV: 88 fL (Normal: 80-100)
MCH: 29.6 pg (Normal: 27-33)
MCHC: 33.8 g/dL (Normal: 32-36)

INTERPRETATION: All values within normal limits.`,
  lipid: `LIPID PANEL
Patient: John Doe | DOB: 05/15/1980 | Date: 01/03/2026

Total Cholesterol: 215 mg/dL (Desirable: <200) [HIGH]
LDL Cholesterol: 138 mg/dL (Optimal: <100) [HIGH]
HDL Cholesterol: 52 mg/dL (Normal: >40)
Triglycerides: 125 mg/dL (Normal: <150)
VLDL: 25 mg/dL (Normal: 5-40)

INTERPRETATION: Elevated total and LDL cholesterol. Consider lifestyle modifications.`,
  metabolic: `COMPREHENSIVE METABOLIC PANEL (CMP)
Patient: John Doe | DOB: 05/15/1980 | Date: 01/04/2026

Glucose: 95 mg/dL (Normal: 70-100)
BUN: 15 mg/dL (Normal: 7-20)
Creatinine: 1.0 mg/dL (Normal: 0.7-1.3)
Sodium: 140 mEq/L (Normal: 136-145)
Potassium: 4.2 mEq/L (Normal: 3.5-5.0)
Chloride: 102 mEq/L (Normal: 98-106)
CO2: 24 mEq/L (Normal: 23-29)
Calcium: 9.5 mg/dL (Normal: 8.5-10.5)
Total Protein: 7.0 g/dL (Normal: 6.0-8.3)
Albumin: 4.2 g/dL (Normal: 3.5-5.0)
Bilirubin: 0.8 mg/dL (Normal: 0.1-1.2)
ALT: 25 U/L (Normal: 7-56)
AST: 22 U/L (Normal: 10-40)

INTERPRETATION: All values within normal limits.`,
  thyroid: `THYROID FUNCTION TEST
Patient: John Doe | DOB: 05/15/1980 | Date: 01/02/2026

TSH: 2.5 mIU/L (Normal: 0.4-4.0)
Free T4: 1.2 ng/dL (Normal: 0.8-1.8)
Free T3: 3.0 pg/mL (Normal: 2.3-4.2)

INTERPRETATION: Thyroid function is normal.`,
  hemoglobin: `HEMOGLOBIN A1C TEST
Patient: John Doe | DOB: 05/15/1980 | Date: 01/01/2026

Hemoglobin A1C: 5.8% (Normal: <5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%)

INTERPRETATION: Result indicates prediabetes range. Recommend lifestyle modifications.`,
  "chest-xray": `CHEST X-RAY (PA AND LATERAL)
Patient: John Doe | DOB: 05/15/1980 | Date: 12/28/2025

FINDINGS:
- Heart size normal, cardiothoracic ratio within normal limits
- Lungs are clear bilaterally without focal consolidation
- No pleural effusion or pneumothorax identified
- Mediastinal contours are normal
- Bony thorax intact without acute abnormality

IMPRESSION: Normal chest radiograph. No acute cardiopulmonary disease.`,
  "brain-mri": `BRAIN MRI WITHOUT CONTRAST
Patient: John Doe | DOB: 05/15/1980 | Date: 12/15/2025

TECHNIQUE: Multiplanar, multisequence MRI of the brain without IV contrast.

FINDINGS:
- No acute intracranial hemorrhage
- No mass effect or midline shift
- Ventricles and sulci normal in size and configuration
- White matter appears normal without signal abnormality
- No restricted diffusion to suggest acute infarct
- Visualized paranasal sinuses and mastoid air cells are clear

IMPRESSION: Normal MRI of the brain. No acute intracranial abnormality.`,
  "ct-abdomen": `CT ABDOMEN AND PELVIS WITH CONTRAST
Patient: John Doe | DOB: 05/15/1980 | Date: 12/20/2025

FINDINGS:
- Liver, spleen, pancreas, and adrenal glands appear normal
- Kidneys enhance symmetrically without hydronephrosis
- No abdominal or pelvic lymphadenopathy
- Bowel gas pattern is nonobstructive
- No free fluid or free air

IMPRESSION: Unremarkable CT of the abdomen and pelvis.`,
  "knee-mri": `MRI RIGHT KNEE WITHOUT CONTRAST
Patient: John Doe | DOB: 05/15/1980 | Date: 12/10/2025

FINDINGS:
- ACL and PCL intact
- Medial and lateral menisci show no definite tear
- Mild joint effusion present
- Articular cartilage shows mild thinning at medial compartment
- No bone marrow edema

IMPRESSION: Mild degenerative changes. No acute ligamentous or meniscal injury.`,
  "spine-xray": `LUMBAR SPINE X-RAY
Patient: John Doe | DOB: 05/15/1980 | Date: 12/05/2025

FINDINGS:
- Vertebral body heights are maintained
- Disc spaces show mild narrowing at L4-L5
- Facet joints appear unremarkable
- No spondylolisthesis
- Sacroiliac joints are normal

IMPRESSION: Mild degenerative disc disease at L4-L5. No acute findings.`,
}

export default function PatientScan() {
  const [reportType, setReportType] = useState<"lab" | "radiology">("lab")
  const [reportText, setReportText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSampleSelect = (reportId: string) => {
    setReportText(sampleReportContent[reportId] || "")
    setAnalysis(null)
    setAttachedFile(null)
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
      // Read file content if it's a text file
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setReportText(e.target?.result as string)
        }
        reader.readAsText(file)
      }
    }
  }

  const handleAnalyze = async () => {
    if (!reportText.trim()) return

    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: reportText,
          mode: "patient",
          reportType: reportType,
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const renderInputCard = (type: "lab" | "radiology") => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === "lab" ? <Beaker className="h-5 w-5 text-primary" /> : <Radio className="h-5 w-5 text-primary" />}
          {type === "lab" ? "Lab Report Input" : "Radiology Report Input"}
        </CardTitle>
        <CardDescription>
          {type === "lab"
            ? "Paste your lab report, select a sample, or attach a file"
            : "Paste your imaging report, select a sample, or attach a file"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleSampleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sample report" />
          </SelectTrigger>
          <SelectContent>
            {(type === "lab" ? labSampleReports : radiologySampleReports).map((report) => (
              <SelectItem key={report.id} value={report.id}>
                {report.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileAttach}
            accept=".txt,.pdf,.doc,.docx"
            className="hidden"
          />
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Attach Report File
          </Button>
        </div>

        {attachedFile && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm flex-1 truncate">{attachedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setAttachedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        <Textarea
          placeholder={type === "lab" ? "Paste your lab report here..." : "Paste your radiology report here..."}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          className="min-h-[250px] font-mono text-sm"
        />
        <Button onClick={handleAnalyze} disabled={!reportText.trim() || isAnalyzing} className="w-full">
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4 mr-2" />
              Analyze Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderResultsCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Results Explained</CardTitle>
        <CardDescription>Simple, easy-to-understand explanations of your medical report</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p>Select or paste a report and click analyze to see results</p>
          </div>
        )}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing your report in simple terms...</p>
          </div>
        )}
        {analysis && (
          <div className="space-y-4">
            {/* Simple Summary */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                In Simple Terms
              </h4>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            {/* What It May Mean */}
            {analysis.findings && (
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  What This May Mean For You
                </h4>
                <ul className="space-y-3 text-sm">
                  {analysis.findings.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span className="leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions to Ask Doctor */}
            {analysis.questionsToAsk && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400">
                  <HelpCircle className="h-4 w-4" />
                  Questions to Ask Your Doctor
                </h4>
                <ul className="space-y-2 text-sm">
                  {analysis.questionsToAsk.map((q: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5 shrink-0">
                        {i + 1}
                      </Badge>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citation Sources */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                Information Sources
              </h4>
              <p className="text-xs text-muted-foreground">
                Based on guidelines from CDC, NIH, and medical reference standards. This is for educational purposes
                only.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Report Scan</h1>
        <p className="text-muted-foreground">Get easy-to-understand explanations of your medical reports</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This tool provides educational information only and is NOT a medical diagnosis. Always discuss your results
          with your healthcare provider.
        </AlertDescription>
      </Alert>

      <Tabs
        value={reportType}
        onValueChange={(v) => {
          setReportType(v as "lab" | "radiology")
          setAnalysis(null)
        }}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="lab" className="gap-2">
            <Beaker className="h-4 w-4" />
            Lab Reports
          </TabsTrigger>
          <TabsTrigger value="radiology" className="gap-2">
            <Radio className="h-4 w-4" />
            Radiology Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lab" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {renderInputCard("lab")}
            {renderResultsCard()}
          </div>
        </TabsContent>

        <TabsContent value="radiology" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {renderInputCard("radiology")}
            {renderResultsCard()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
