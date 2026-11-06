/**
 * Deterministic Rules Parser (قواعد نمطية قطعية محددة مسبقاً)
 *
 * CRITICAL TRANSPARENCY NOTICE:
 * This is an explicit rule-based string classifier using static keyword lookups.
 * It is NOT an Artificial Intelligence model, LLM, or clinical reasoning engine.
 * Simplistic keywords can misclassify Arabic or English syntax.
 * The physician must personally review and adjust all categorized statements.
 */

export interface ParsedCategoryItem {
  id: string;
  category: 'complaint' | 'negated' | 'clinician_instruction' | 'test' | 'medication' | 'unclassified';
  labelAr: string;
  sourceSentence: string;
  extractedText: string;
}

export interface StructuredDraft {
  complaints: ParsedCategoryItem[];
  negated: ParsedCategoryItem[];
  clinicianInstructions: ParsedCategoryItem[];
  tests: ParsedCategoryItem[];
  medications: ParsedCategoryItem[];
  unclassified: ParsedCategoryItem[];
}

// Split into sentences using Arabic & English punctuation delimiters
export function splitSentences(text: string): string[] {
  if (!text || !text.trim()) return [];
  
  // Normalize line breaks and separators
  const normalized = text
    .replace(/[\r\n]+/g, ' . ')
    .replace(/[؛;]/g, ' . ')
    .replace(/[؟?]/g, ' . ')
    .replace(/[!]/g, ' . ');

  // Split on dots or Arabic comma when followed by spacing
  const rawParts = normalized.split(/\s*[\.،,]\s*/);

  return rawParts
    .map(p => p.trim())
    .filter(p => p.length > 2);
}

// Deterministic keywords for rule-based matching
const NEGATED_KEYWORDS = [
  'لا يوجد', 'مافيش', 'مفيش', 'معنديش', 'ما عنديش', 'مش عندي', 'مليش', 'لا أعاني', 'لا اعاني', 'ينفي', 'انفي', 'أنفي', 'ليس لدي', 'ليس عندي',
  'لم اشتك', 'لم أشتك', 'دون', 'بدون', 'غير موجود', 'no ', 'denies ', 'not ', 'negative for ', 'without ',
  'no fever', 'no pain', 'no headache', 'no cough'
];

const COMPLAINT_KEYWORDS = [
  'ألم', 'الم', 'وجع', 'صداع', 'سخونة', 'سخونية', 'حرارة', 'كحة', 'سعال', 'دوخة', 'دوار', 'تعب', 'إرهاق', 'ارهاق',
  'ضيق تنفس', 'مغص', 'غثيان', 'قيء', 'ترجيع', 'مفاصل', 'صدر', 'بطن', 'ظهر', 'حرقان',
  'pain', 'fever', 'cough', 'headache', 'dizzy', 'fatigue', 'shortness of breath', 'ache', 'sore', 'nausea'
];

const INSTRUCTION_KEYWORDS = [
  'يجب', 'عليك', 'نوصي', 'راحة', 'اشرب', 'تناول', 'تجنب', 'راجعنا', 'متابعة', 'تعليمات', 'التزم', 'حمية',
  'advise', 'recommend', 'rest', 'avoid', 'follow up', 'drink', 'instruct', 'take care', 'diet'
];

const TEST_KEYWORDS = [
  'تحليل', 'أشعة', 'اشعة', 'فحص', 'رسم قلب', 'صورة دم', 'إيكو', 'ايكو', 'سونار', 'مزرعة', 'وظائف كبد', 'وظائف كلى',
  'cbc', 'x-ray', 'ecg', 'ultrasound', 'scan', 'test', 'labs', 'mri', 'ct', 'echo', 'blood test'
];

const MEDICATION_KEYWORDS = [
  'علاج', 'دواء', 'أقراص', 'اقراص', 'كبسولات', 'مضاد حيوي', 'باراسيتامول', 'أوجمنتين', 'اوجمنتين', 'بخاخ',
  'مرهم', 'شراب', 'حقن', 'جرعة', 'فيتامين', 'مسكن',
  'medication', 'pill', 'tablet', 'antibiotic', 'paracetamol', 'inhaler', 'mg', 'dose', 'syrup', 'capsule'
];

function containsAny(sentence: string, keywords: string[]): boolean {
  const lower = sentence.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

export function parseTranscriptDeterministically(rawText: string): StructuredDraft {
  const sentences = splitSentences(rawText);

  const draft: StructuredDraft = {
    complaints: [],
    negated: [],
    clinicianInstructions: [],
    tests: [],
    medications: [],
    unclassified: [],
  };

  sentences.forEach((sentence, idx) => {
    const id = `item-${idx}-${Date.now()}`;

    // 1. Check for explicit negation first
    if (containsAny(sentence, NEGATED_KEYWORDS)) {
      draft.negated.push({
        id,
        category: 'negated',
        labelAr: 'نفي أعراض / استبعاد',
        sourceSentence: sentence,
        extractedText: sentence,
      });
      return;
    }

    // 2. Clinician instructions
    if (containsAny(sentence, INSTRUCTION_KEYWORDS)) {
      draft.clinicianInstructions.push({
        id,
        category: 'clinician_instruction',
        labelAr: 'تعليمات الطبيب والتوصيات',
        sourceSentence: sentence,
        extractedText: sentence,
      });
      return;
    }

    // 3. Requested tests
    if (containsAny(sentence, TEST_KEYWORDS)) {
      draft.tests.push({
        id,
        category: 'test',
        labelAr: 'فحوصات وتحاليل مطلوبة',
        sourceSentence: sentence,
        extractedText: sentence,
      });
      return;
    }

    // 4. Medications mentioned
    if (containsAny(sentence, MEDICATION_KEYWORDS)) {
      draft.medications.push({
        id,
        category: 'medication',
        labelAr: 'أدوية ومستحضرات مذكورة',
        sourceSentence: sentence,
        extractedText: sentence,
      });
      return;
    }

    // 5. Complaints and symptoms
    if (containsAny(sentence, COMPLAINT_KEYWORDS)) {
      draft.complaints.push({
        id,
        category: 'complaint',
        labelAr: 'شكاوى وأعراض مذكورة',
        sourceSentence: sentence,
        extractedText: sentence,
      });
      return;
    }

    // 6. Unknown stays unclassified - never invent
    draft.unclassified.push({
      id,
      category: 'unclassified',
      labelAr: 'غير مصنف (بحاجة لمراجعة الطبيب)',
      sourceSentence: sentence,
      extractedText: sentence,
    });
  });

  return draft;
}
