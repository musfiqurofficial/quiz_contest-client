# Question Import Feature

## Overview

The Question Import feature allows administrators to automatically extract questions from various file formats using AI-powered OCR (Optical Character Recognition) with Google's Gemini API.

## Supported File Types

- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX
- **Text Files**: TXT

## Question Types Supported

1. **MCQ (Multiple Choice Questions)**

   - 4 options (A, B, C, D)
   - Correct answer selection
   - Marks and difficulty level

2. **Short Answer Questions**

   - Expected answer
   - Marks and difficulty level
   - Optional image attachments

3. **Written/Essay Questions**
   - Expected answer
   - Word limit (minimum 50 words)
   - Time limit (minimum 1 minute)
   - Marks and difficulty level
   - Optional image attachments

## How to Use

### Step 1: Access Import Feature

1. Navigate to Admin Dashboard
2. Go to "Questions" tab
3. Click "Import Questions" button

### Step 2: Configure Import Settings

1. **Select Quiz**: Choose the target quiz for imported questions
2. **Question Type Filter**:
   - "All Types (Mixed)" - Import all question types
   - "MCQ Only" - Import only multiple choice questions
   - "Short Answer Only" - Import only short answer questions
   - "Essay Only" - Import only essay questions

### Step 3: Upload Files

1. Click "Choose Files" button
2. Select one or more files (PDF, DOC, DOCX, images, or text files)
3. Maximum file size: 10MB per file
4. Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, WebP, TXT

### Step 4: Extract Questions

1. Click "Extract Questions" button
2. Wait for AI processing (may take 30-60 seconds)
3. Review extracted questions in the preview

### Step 5: Review and Edit (Optional)

1. **View Extracted Questions**: All extracted questions are displayed with:

   - Question text
   - Question type badge
   - Difficulty level
   - Marks
   - Options (for MCQ)
   - Expected answers (for Short/Written)

2. **Edit Questions**: Click the edit button to modify:

   - Question text
   - Options (for MCQ)
   - Correct answers
   - Marks and difficulty
   - Word/time limits (for Written questions)

3. **Delete Questions**: Remove unwanted questions using the delete button

### Step 6: Import Questions

1. Click "Import All Questions" button
2. Questions will be created in the selected quiz
3. Success message will show the number of imported questions

## AI Processing Details

### Gemini API Configuration

- **Model**: Gemini 2.0 Flash
- **API Key**: Configured in `src/lib/ocr/gemini-ocr.ts`
- **Temperature**: 0.1 (for consistent results)
- **Max Output Tokens**: 8192

### Extraction Process

1. **File Processing**: Files are converted to appropriate format (base64 for images/PDFs, text for documents)
2. **AI Analysis**: Gemini API analyzes content and extracts questions
3. **Validation**: Extracted questions are validated for required fields
4. **Formatting**: Questions are formatted according to the application's data structure

### Error Handling

- **File Type Validation**: Only supported file types are accepted
- **Size Validation**: Files larger than 10MB are rejected
- **Content Validation**: Questions without required fields are flagged
- **API Error Handling**: Network and API errors are caught and displayed

## Technical Implementation

### Frontend Components

- `QuestionImportDialog.tsx` - Main import interface
- `QuestionsTab.tsx` - Integration with questions management
- `gemini-ocr.ts` - AI processing service

### Backend API

- `POST /api/questions/bulk` - Bulk question creation endpoint
- Validation for all question types
- Error handling and response formatting

### Redux Integration

- `importQuestions` action for bulk import
- Loading states and error handling
- Automatic UI updates after import

## Best Practices

### File Preparation

1. **Clear Images**: Use high-resolution images with clear text
2. **Well-Formatted Documents**: Use proper headings and structure
3. **Consistent Formatting**: Maintain consistent question numbering and formatting

### Question Quality

1. **Review Extracted Questions**: Always review and edit extracted questions
2. **Validate Answers**: Ensure correct answers are properly identified
3. **Check Difficulty Levels**: Verify AI-assigned difficulty levels
4. **Test Questions**: Test imported questions before publishing

### Performance Tips

1. **Batch Processing**: Import multiple questions at once for efficiency
2. **File Size**: Keep individual files under 10MB
3. **Network**: Ensure stable internet connection for API calls

## Troubleshooting

### Common Issues

1. **No Questions Extracted**: Check file format and content clarity
2. **Incorrect Question Types**: Review and edit question type assignments
3. **Missing Options**: For MCQ questions, ensure all options are present
4. **API Errors**: Check internet connection and API key validity

### Error Messages

- "Unsupported file type" - File format not supported
- "File size too large" - File exceeds 10MB limit
- "No content extracted" - File could not be processed
- "API request failed" - Network or API error

## Security Considerations

- API key is stored in frontend code (consider moving to environment variables)
- File uploads are processed client-side before API calls
- No sensitive data is stored during the import process

## Future Enhancements

- Support for more file formats (PPT, XLSX)
- Batch file processing
- Question template matching
- Advanced AI prompts for better extraction
- Import history and rollback functionality
