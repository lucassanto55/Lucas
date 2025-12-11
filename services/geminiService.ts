import { GoogleGenAI } from "@google/genai";
import { RoutePlan } from "../types";

// Safe access to process.env for browser environments
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is undefined
  }
  return 'mock-key';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const analyzeRouteWithAI = async (route: RoutePlan): Promise<string> => {
  if (apiKey === 'mock-key') {
    return "Simulação IA: A rota parece eficiente. O trânsito na zona sul pode afetar a entrega #3. Recomendo sair antes das 08:00.";
  }

  try {
    const prompt = `
      Analise esta rota de entrega para a empresa Hibryda Pescados.
      Veículo: ${route.vehicleId}
      Total Distância: ${route.totalDistance.toFixed(2)} km
      Paradas: ${route.stops.map(s => s.client.address).join(' -> ')}
      
      Forneça 3 insights curtos sobre eficiência, possíveis riscos de tráfego e sugestão de melhoria.
      Responda em Português.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar análise.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Erro ao conectar com a IA da Hibryda.";
  }
};