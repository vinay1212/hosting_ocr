import fs from 'fs';

const filePath = 'output.txt'; 

// Read text from the file
const readTextFromFile = (filePath) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error.message);
      return null;
    }
  };

// Usage example
const outputText = readTextFromFile(filePath);

const extractAllDates = (input) => {
    const dateRegex = /\b(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\.?\s+(\d{4})\b/g;
  
    const dates = new Array(3).fill(null);
    let match;
    let i = 0;

    while ((match = dateRegex.exec(input)) !== null) {
      dates[i++] = match[0];
    }
    return dates;
};


const extractedDates = extractAllDates(outputText);
console.log(extractedDates);

// Extract information using regular expressions
const extractInformation = (pattern, text) => {
  const match = text.match(pattern);
  return match ? match[1].trim() : 'Not found';
};

const extraction = async (outputText) => {

    // Define patterns for various pieces of information
    const namePattern = /Name\s*([^\n]+)/;
    const lastNamePattern = /Last name\s*([^\n]+)/;
    const identificationNumberPattern = /\b[0-9]{13}\b/;


    

    // Extract and print information
    const extractedInformation = {
        name: extractInformation(namePattern, outputText),
        lastName: extractInformation(lastNamePattern, outputText),
        identificationNumber: extractInformation(identificationNumberPattern, outputText),
        dateOfBirth: extractedDates[0],
        dateOfIssue: extractedDates[1],
        dateOfExpiry: extractedDates[2],
    };

    // Print the JSON object
    console.log(JSON.stringify(extractedInformation, null, 2));

    return extractedInformation;
}

// extraction(outputText);
export default extraction;
