const mockPatientLabAnalysis = {
  summary:
    "Your blood work shows mostly normal results with a few values that your doctor may want to discuss with you. Overall, your kidney and liver function appear healthy.",
  findings: [
    "Your hemoglobin level is slightly lower than the typical range, which might explain any tiredness you've been feeling. This is called anemia and is very common.",
    "Blood sugar (glucose) is within the normal fasting range, which is good news for diabetes screening.",
    "Cholesterol levels are borderline - not dangerous, but worth monitoring with diet and exercise.",
    "Kidney function markers (creatinine, BUN) are all in healthy ranges.",
    "White blood cell count is normal, suggesting no current infection.",
  ],
  questionsToAsk: [
    "Should I be concerned about my slightly low hemoglobin, and would iron supplements help?",
    "What lifestyle changes would you recommend to improve my cholesterol numbers?",
    "How often should I repeat these blood tests to monitor my health?",
    "Are there any symptoms I should watch for based on these results?",
  ],
}

const mockPatientRadiologyAnalysis = {
  summary:
    "Your imaging scan was completed successfully and shows the area examined in good detail. The radiologist has noted their observations which your doctor will review with you.",
  findings: [
    "The overall structure of the examined area appears normal in size and shape.",
    "No masses, tumors, or unusual growths were identified in the scan.",
    "Some minor age-related changes were noted, which are common and usually not concerning.",
    "Blood vessels in the area appear to be functioning normally.",
    "No signs of acute injury or inflammation were detected.",
  ],
  questionsToAsk: [
    "Can you explain what the minor changes mentioned in the report mean for me?",
    "Do I need any follow-up imaging or additional tests?",
    "Are there any activities I should avoid based on these findings?",
    "When should I schedule my next imaging study for comparison?",
  ],
}

const mockClinicianLabAnalysis = {
  clinicalImpression:
    "Laboratory panel reveals mild microcytic anemia (Hgb 11.2 g/dL, MCV 76 fL) warranting iron studies workup. Lipid panel shows borderline LDL elevation consistent with metabolic syndrome. Renal function shows early CKD (eGFR 52). Fasting glucose 126 mg/dL meets criteria for diabetes. Thyroid panel suggests primary hypothyroidism.",
  criticalValues: [
    { parameter: "Hemoglobin", value: "11.2 g/dL", reference: "12.0-16.0 g/dL" },
    { parameter: "MCV", value: "76 fL", reference: "80-100 fL" },
    { parameter: "LDL Cholesterol", value: "168 mg/dL", reference: "<100 mg/dL optimal" },
    { parameter: "eGFR", value: "52 mL/min/1.73m²", reference: ">60 mL/min/1.73m²" },
    { parameter: "Fasting Glucose", value: "126 mg/dL", reference: "70-100 mg/dL" },
    { parameter: "TSH", value: "8.5 mIU/L", reference: "0.4-4.0 mIU/L" },
  ],
  differentials: [
    "Iron deficiency anemia (most likely given low MCV) - consider GI workup for occult blood loss",
    "Metabolic syndrome with diabetes, dyslipidemia, and early nephropathy",
    "Primary hypothyroidism requiring thyroid hormone replacement",
    "CKD Stage 3a - likely secondary to diabetes/hypertension",
    "Cardiovascular disease risk - elevated based on multiple risk factors",
  ],
  suggestedActions: [
    "Order iron studies panel (serum iron, TIBC, ferritin) for anemia workup",
    "Consider GI evaluation (colonoscopy) if iron deficiency confirmed",
    "Initiate statin therapy per ACC/AHA guidelines for ASCVD risk reduction",
    "Start levothyroxine for hypothyroidism, recheck TSH in 6-8 weeks",
    "Diabetes management: A1C, consider metformin if not contraindicated by renal function",
    "Nephrology referral for CKD management, ACE-I/ARB for renoprotection",
    "Repeat labs in 4-6 weeks after interventions initiated",
  ],
  guidelines:
    "ACC/AHA 2018 Cholesterol Guidelines for statin therapy. ADA Standards of Care 2025 for diabetes management. KDIGO 2024 for CKD staging and management. ATA guidelines for hypothyroidism treatment.",
}

const mockClinicianRadiologyAnalysis = {
  clinicalImpression:
    "Imaging demonstrates findings consistent with underlying chronic disease processes. Cardiomegaly with pulmonary vascular congestion suggests heart failure. Chronic small vessel ischemic changes on brain MRI. Hepatic steatosis with features of metabolic syndrome. Degenerative changes in musculoskeletal studies appropriate for age but may require intervention.",
  criticalValues: [
    { parameter: "Cardiothoracic Ratio", value: "0.58", reference: "<0.50 normal" },
    { parameter: "Fazekas Grade", value: "Grade 2", reference: "Grade 0 = none" },
    { parameter: "Liver Attenuation", value: "Decreased (steatosis)", reference: "Normal parenchyma" },
    { parameter: "Meniscus", value: "Grade 2 tear", reference: "Intact" },
    { parameter: "L4-L5 Listhesis", value: "Grade 1", reference: "No listhesis" },
  ],
  differentials: [
    "Congestive heart failure - cardiomegaly with pulmonary edema pattern",
    "Chronic small vessel ischemic disease secondary to HTN/DM",
    "Non-alcoholic fatty liver disease (NAFLD) in setting of metabolic syndrome",
    "Medial meniscus tear with secondary osteoarthritis",
    "Degenerative spondylolisthesis with spinal stenosis",
  ],
  suggestedActions: [
    "Echocardiogram to assess LV function and structural abnormalities",
    "Cardiology referral for heart failure workup and management",
    "Optimize cardiovascular risk factors (BP, lipids, glucose)",
    "Hepatology referral for NAFLD evaluation, consider fibroscan",
    "Orthopedic consultation for symptomatic meniscal tear",
    "Spine specialist evaluation if neurological symptoms present",
    "Follow-up adrenal CT in 6-12 months for incidental nodule",
  ],
  guidelines:
    "RSNA guidelines for cardiac imaging. ACR Appropriateness Criteria for musculoskeletal imaging. AASLD guidelines for NAFLD management. AHA/ACC heart failure guidelines for diagnostic workup.",
}

export async function POST(request: Request) {
  try {
    const { report, mode, reportType } = await request.json()

    if (!report || typeof report !== "string") {
      return Response.json({ error: "Report text is required" }, { status: 400 })
    }

    const isPatientMode = mode === "patient"
    const isLabReport = reportType === "lab"

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (isPatientMode) {
      return Response.json(isLabReport ? mockPatientLabAnalysis : mockPatientRadiologyAnalysis)
    } else {
      return Response.json(isLabReport ? mockClinicianLabAnalysis : mockClinicianRadiologyAnalysis)
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: "Failed to analyze report" }, { status: 500 })
  }
}
