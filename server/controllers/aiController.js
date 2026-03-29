import { json } from "express";
import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
try {
  const {userContent} = req.body;

  if(!userContent) {
    return res.status(400).json({message: 'Missing required fields'})
  }

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
      max_tokens: 120,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS-fiendly and only return text no options or anything else." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
  })

  const enhancedContent = response.choices[0].message.content || "Unable to generate description";
  return res.status(200).json({enhancedContent})
} catch (error) {
  return res.status(400).json({message: error.message})
}
}

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const  enhanceJobDescription= async (req, res) => {
try {
  const {userContent} = req.body;

  if(!userContent) {
    return res.status(400).json({message: 'Missing required fields'})
  }

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
      max_tokens: 120,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. You task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and enhancements. Use action verbs and quantifiable results where possible. Make it ATS-friendly and only return test no options or anything else." 
        },
        {
            role: "user",
            content: userContent,
        },
    ],
  })

  const enhancedContent = response.choices[0].message.content || "Unable to generate description";
  return res.status(200).json({enhancedContent})
} catch (error) {
  return res.status(400).json({message: error.message})
}
}

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume


//import ai from "../configs/ai.js";

export const uploadResume = async (req, res) => {
  try {

    const { resumeText, title } = req.body;
    const userId = req.userId;

    const aiResponse = await ai.responses.create({
  model: "llama-3.3-70b-versatile",
  input: `Extract the resume data into JSON format.

Resume Text:
${resumeText}

Return JSON with this structure:
{
  "personal_info": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "skills": [],
  "education": [],
  "projects": [],
  "experience": []
}`
});

const parsedData = JSON.parse(aiResponse.output[0].content[0].text);

    

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData
    });

    res.json({ resumeId: newResume._id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

