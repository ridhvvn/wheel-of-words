
export interface Question {
  id: number;
  peribahasa: string;
  tahap: string;
  markah: number;
}

export const fetchQuestions = async (): Promise<Question[]> => {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrkt2G-3z1GcIyE9SRHHBLXd-Xk5nZrmG_hjR60WDuRB0bI0KYBJiqVvIaPGc9K0U8Aov-MVzJkq9T/pub?output=csv";
  
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    
    // Simple CSV parser
    const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
    
    const questions: Question[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',');
      
      if (values.length >= 3) {
        questions.push({
          id: i,
          peribahasa: values[0].trim(),
          tahap: values[1].trim(),
          markah: parseInt(values[2].trim()) || 0
        });
      }
    }
    
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
