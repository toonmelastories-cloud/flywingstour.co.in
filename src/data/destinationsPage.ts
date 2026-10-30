/**
 * The FAQ block on /destinations.
 *
 * Kept here rather than inside the client component so the server page
 * can put the same questions into FAQPage structured data without the
 * two drifting apart.
 *
 * Answers may carry [label](/href) links, which <LinkedText> renders
 * and `stripLinks` removes for the schema. Every destination named has
 * a page, and the months quoted match that destination's own data.
 */
export const DESTINATIONS_FAQS: { question: string; answer: string }[] = [
  {
    question: "Which are the best international destinations to visit from India?",
    answer:
      "[Dubai](/destinations/dubai), [Thailand](/destinations/thailand), [Bali](/destinations/bali), [Maldives](/destinations/maldives), [Singapore](/destinations/singapore), [Malaysia](/destinations/malaysia), Kazakhstan and [Vietnam](/destinations/vietnam) are popular international destinations for Indian travellers. The ideal destination depends on your budget, travel preferences and holiday duration.",
  },
  {
    question: "Which are the best domestic holiday destinations in India?",
    answer:
      "[Kashmir](/destinations/kashmir) and [Himachal Pradesh](/destinations/himachal) are popular choices for travellers looking for beautiful mountain views, peaceful valleys, sightseeing and adventure experiences.",
  },
  {
    question: "What is the best time to plan an international holiday?",
    answer:
      "The best time depends on your selected destination. For example, November to March is popular for visiting Dubai, while April to October is generally suitable for travelling to Bali.",
  },
  {
    question: "Does Flywings provide customized holiday packages?",
    answer:
      "Yes, Flywings helps travellers plan customized domestic and international holiday packages according to their travel preferences, budget and trip duration.",
  },
  {
    question: "How can I book a holiday package with Flywings?",
    answer:
      "You can contact our travel experts to discuss your preferred destination, travel dates, number of travellers and budget. Our team can assist you with suitable holiday planning and booking options.",
  },
];
