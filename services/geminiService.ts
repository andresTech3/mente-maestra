import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface SubtasksResponse {
  subtasks: string[];
}

export const breakDownTask = async (taskTitle: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Eres un asesor académico experto. Desglosa la siguiente tarea universitaria compleja en 3-5 subtareas simples y accionables. El usuario es un estudiante que lucha contra la procrastinación. Las subtareas deben ser alentadoras y claras. La tarea es: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              description: "Una lista de 3 a 5 subtareas simples y accionables.",
              items: {
                type: Type.STRING,
                description: "Una única subtarea."
              },
            },
          },
          required: ["subtasks"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsed: SubtasksResponse = JSON.parse(jsonText);
    return parsed.subtasks || [];
  } catch (error) {
    console.error("Error breaking down task:", error);
    // Fallback in case of API error
    return ["Revisar requisitos", "Crear un esquema", "Redactar el borrador", "Revisar y entregar"];
  }
};

export const getEmotionalSupport = async (feeling: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: feeling,
      config: {
         systemInstruction: "Eres un bot de compañía amigable y de apoyo llamado Playto. Estás hablando con un estudiante universitario que se siente estresado o ansioso. Tu objetivo es proporcionar un ejercicio breve, simple y alentador de terapia cognitivo-conductual (TCC) o de mindfulness. **No eres un terapeuta y no debes dar consejos médicos.** Comienza tu respuesta con una frase alentadora. Mantén tu respuesta por debajo de 100 palabras. Formula la sugerencia como una técnica simple para probar, no como una cura.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting emotional support:", error);
    return "Está perfectamente bien sentirse así. Recuerda ser amable contigo mismo. Tomar algunas respiraciones profundas puede ser un excelente primer paso para centrar tus pensamientos.";
  }
};